import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@emotion/react';
import type { AppTheme } from '@/theme';
import { MapViewWithPin } from '@/components/MapViewWithPin/MapViewWithPin';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { getCoordDynamic, DynamicCoord } from '@/api/coord';
import { CurrentLocationButton } from '@/components/CurrentLocationButton';
import { LocationActionButtons } from '@/components/LocationActionButtons';
interface ResultItem extends DynamicCoord {
  distance: number;
  time: number;
}

export default function DynamicResultScreen() {
  const { navicode } = useLocalSearchParams<{ navicode: string }>();
  const theme = useTheme() as AppTheme;
  const styles = useStyles(theme);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [filterOn, setFilterOn] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const DEFAULT_CLUSTER_DISTANCE = 0.01;
  const [clusterDistance, setClusterDistance] = useState(DEFAULT_CLUSTER_DISTANCE);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const mapRef = useRef<MapView>(null);
  const [hasCentered, setHasCentered] = useState(false);

  const handleCurrentLocation = async () => {
    if (!mapRef.current) return;

    if (userLocation) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setUserLocation(coords);
      mapRef.current.animateToRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission to access location was denied');
          return;
        }
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);
  useEffect(() => {
    async function fetchResults() {
      if (!navicode || !userLocation) return;
      try {
        const { latitude, longitude } = userLocation;
        const res = await getCoordDynamic(navicode, latitude.toString(), longitude.toString());
        const mapped: ResultItem[] = res
          .map((item) => {
            const distance = calculateDistance(latitude, longitude, item.latitude, item.longitude);
            const time = (distance / 4) * 60; // 4km/h walking speed
            return { ...item, distance, time };
          })
          .sort((a, b) => a.distance - b.distance);
        setResults(mapped);
      } catch (e) {
        console.warn(e);
      }
    }
    fetchResults();
  }, [navicode, userLocation]);

  useEffect(() => {
    if (!hasCentered && navicode && userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setHasCentered(true);
    }
  }, [navicode, userLocation, hasCentered]);

  const displayed = useMemo(() => {
    const filtered = filterOn ? results.filter((r) => r.distance <= 1) : results;
    return filtered.slice(0, 5);
  }, [results, filterOn]);

  const handleClusterPress = (coords: { latitude: number; longitude: number }[]) => {
    setClusterDistance(0);
    setSelectedIdx(null);
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 50, bottom: 50, left: 50, right: 50 },
        animated: true,
      });
    }
  };

  const handleMapPress = () => {
    setSelectedIdx(null);
    setClusterDistance(DEFAULT_CLUSTER_DISTANCE);
  };

  return (
    <View style={styles.container}>
      <MapViewWithPin
        ref={mapRef}
        markers={displayed.map(({ latitude, longitude }) => ({
          latitude,
          longitude,
        }))}
        showUserLocation
        onUserLocationChange={(coords) => setUserLocation(coords)}
        onMarkerPress={(idx) => setSelectedIdx(idx)}
        onClusterPress={handleClusterPress}
        onMapPress={handleMapPress}
        clusterDistance={clusterDistance}
      />
      <BottomSheet
        index={0}
        snapPoints={['25%', '50%']}
        backgroundStyle={{
          backgroundColor: theme.colors.backgroundFill,
          opacity: 0.9,
        }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.textSub }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterButton, filterOn && styles.filterButtonActive]}
              onPress={() => setFilterOn((prev) => !prev)}
            >
              <Text style={[styles.filterButtonText, filterOn && styles.filterButtonTextActive]}>
                1km 이내만
              </Text>
            </TouchableOpacity>
          </View>
          {selectedIdx !== null ? (
            <View key={selectedIdx} style={styles.listItem}>
              <Text style={styles.itemName}>{displayed[selectedIdx].name}</Text>
              <Text style={styles.itemMeta}>
                {displayed[selectedIdx].distance.toFixed(2)}km · 약{' '}
                {Math.round(displayed[selectedIdx].time)}분
              </Text>
            </View>
          ) : (
            displayed.map((item, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>
                  {item.distance.toFixed(2)}km · 약 {Math.round(item.time)}분
                </Text>
                <LocationActionButtons
                  name={item.name}
                  coords={{ latitude: item.latitude, longitude: item.longitude }}
                />
              </View>
            ))
          )}
        </BottomSheetView>
      </BottomSheet>
      <CurrentLocationButton onPress={handleCurrentLocation} style={styles.currentLocationButton} />
    </View>
  );
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function useStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1 },
    sheetContent: {
      padding: theme.spacing.spacing4,
      gap: theme.spacing.spacing3,
    },
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    filterButton: {
      paddingHorizontal: theme.spacing.spacing3,
      paddingVertical: theme.spacing.spacing1,
      borderRadius: theme.spacing.spacing3,
      backgroundColor: theme.colors.backgroundDefault,
      borderWidth: 1,
      borderColor: theme.colors.borderDefault,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.info,
    },
    filterButtonText: {
      ...theme.typography.body2Regular,
      color: theme.colors.textDefault,
    },
    filterButtonTextActive: {
      color: theme.colors.gray00,
    },
    listItem: {
      paddingVertical: theme.spacing.spacing2,
      gap: theme.spacing.spacing1,
    },
    itemName: {
      ...theme.typography.body1Bold,
      color: theme.colors.textDefault,
    },
    itemMeta: {
      ...theme.typography.body2Regular,
      color: theme.colors.textSub,
    },
    currentLocationButton: {
      bottom: undefined,
      top: theme.spacing.spacing4,
    },
  });
}

import React, { useRef, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '@emotion/react';
import type { AppTheme } from '@/theme';
import { MapViewWithPin } from '@/components/MapViewWithPin/MapViewWithPin';
import { SearchBar } from '@/components/SearchBar';
import { CurrentLocationButton } from '@/components/CurrentLocationButton';
import { BottomBar } from '@/components/BottomBar/BottomBar';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const theme = useTheme() as AppTheme;
  const router = useRouter();
  const styles = useStyles(theme);
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();

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

  React.useEffect(() => {
    (async () => {
      try {
        await Location.requestForegroundPermissionsAsync();
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {__DEV__ && (
          <TouchableOpacity
            style={styles.devButton}
            onPress={() =>
              router.push({
                pathname: '/static-result',
                params: {
                  name: '테스트 장소',
                  latitude: '37.5665',
                  longitude: '126.9780',
                },
              })
            }
          >
            <Text style={styles.devButtonText}>정적 결과보기</Text>
          </TouchableOpacity>
        )}
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>NaviCode</Text>
        </View>
        {__DEV__ && (
          <TouchableOpacity
            style={styles.devButtonRight}
            onPress={() =>
              router.push({
                pathname: '/dynamic-result',
                params: { navicode: 'TEST123' },
              })
            }
          >
            <Text style={styles.devButtonText}>동적 결과보기</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.mapContainer}>
        <MapViewWithPin
          ref={mapRef}
          showUserLocation
          onUserLocationChange={(coords) => setUserLocation(coords)}
        />
        <View style={styles.searchOverlay} pointerEvents="box-none">
          <SearchBar location={userLocation} />
        </View>
        <CurrentLocationButton
          onPress={handleCurrentLocation}
          style={styles.currentLocationButton}
        />
        <BottomBar selected="explore" />
      </View>
    </SafeAreaView>
  );
}

function useStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundDefault,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.spacing4,
      paddingVertical: theme.spacing.spacing4,
    },
    devButton: {
      position: 'absolute',
      left: theme.spacing.spacing4,
      paddingVertical: theme.spacing.spacing1,
      paddingHorizontal: theme.spacing.spacing2,
      borderRadius: theme.spacing.spacing2,
      backgroundColor: theme.colors.backgroundFill,
    },
    devButtonText: {
      ...theme.typography.label2Bold,
      color: theme.colors.textDefault,
    },
    devButtonRight: {
      position: 'absolute',
      right: theme.spacing.spacing4,
      paddingVertical: theme.spacing.spacing1,
      paddingHorizontal: theme.spacing.spacing2,
      borderRadius: theme.spacing.spacing2,
      backgroundColor: theme.colors.backgroundFill,
    },
    brandContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.spacing2,
    },
    brandText: {
      textAlign: 'center',
      ...theme.typography.title1Bold,
      color: theme.colors.textDefault,
    },
    mapContainer: {
      flex: 1,
      position: 'relative',
    },
    searchOverlay: {
      position: 'absolute',
      top: theme.spacing.spacing4,
      left: 0,
      right: 0,
      zIndex: 1,
    },
    currentLocationButton: {
      bottom: theme.spacing.spacingCLB + theme.spacing.spacing4,
    },
  });
}

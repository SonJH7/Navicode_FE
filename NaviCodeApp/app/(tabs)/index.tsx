import React, { useRef, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '@emotion/react';
import type { AppTheme } from '@/theme';
import { MapViewWithPin } from '@/components/MapViewWithPin/MapViewWithPin';
import { SearchBar } from '@/components/SearchBar';
import { CurrentLocationButton } from '@/components/CurrentLocationButton';

export default function HomeScreen() {
  const theme = useTheme() as AppTheme;
  const styles = useStyles(theme);
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number }>();

  const markers = [
    { latitude: 37.5665, longitude: 126.978 },
    { latitude: 37.5655, longitude: 126.976 },
    { latitude: 37.567, longitude: 126.979 },
  ];

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
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>NaviCode</Text>
        </View>
      </View>
      <View style={styles.mapContainer}>
        <MapViewWithPin
          ref={mapRef}
          showUserLocation
          markers={markers}
          onUserLocationChange={(coords) => setUserLocation(coords)}
        />
        <View style={styles.searchOverlay} pointerEvents="box-none">
          <SearchBar />
        </View>
        <CurrentLocationButton onPress={handleCurrentLocation} />
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
  });
}

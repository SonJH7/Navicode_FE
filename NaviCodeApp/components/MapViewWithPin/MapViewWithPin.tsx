import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@emotion/react';
import type { AppTheme } from '@/theme';
import { StyledMapView } from './MapViewWithPin.styles';

const DEFAULT_LAT = 37.5665;
const DEFAULT_LNG = 126.978;

interface Coords {
  latitude: number;
  longitude: number;
}


interface MapViewWithPinProps {
  markerCoords?: Coords;
  markers?: Coords[];
  onMarkerDragEnd?: (coords: Coords) => void;
  onUserLocationChange?: (coords: Coords) => void;
  showUserLocation?: boolean;
}

export const MapViewWithPin = React.forwardRef<MapView, MapViewWithPinProps>(
  function MapViewWithPin(
    {
      markerCoords,
      markers = [],
      onMarkerDragEnd,
      onUserLocationChange,
      showUserLocation = false,
    }: MapViewWithPinProps,
    ref,
  ) {
    const theme = useTheme() as AppTheme;
    const styles = useStyles(theme);

    const clusters = React.useMemo(() => clusterMarkers(markers), [markers]);

    return (
      <StyledMapView
        ref={ref}
        initialRegion={{
          latitude: markerCoords?.latitude ?? DEFAULT_LAT,
          longitude: markerCoords?.longitude ?? DEFAULT_LNG,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={showUserLocation}
        onUserLocationChange={(e) =>
          onUserLocationChange?.(e.nativeEvent.coordinate)
        }
      >
        {markerCoords && (
          <Marker
            coordinate={markerCoords}
            draggable={Boolean(onMarkerDragEnd)}
            onDragEnd={(e) => onMarkerDragEnd?.(e.nativeEvent.coordinate)}
          />
        )}
        {clusters.map((cluster, idx) =>
          cluster.count === 1 ? (
            <Marker
              key={`marker-${idx}`}
              coordinate={cluster.markers[0]}
            />
          ) : (
            <Marker
              key={`cluster-${idx}`}
              coordinate={{
                latitude: cluster.latitude,
                longitude: cluster.longitude,
              }}
            >
              <View style={styles.cluster}>
                <Text style={styles.clusterText}>{cluster.count}</Text>
              </View>
            </Marker>
          ),
        )}
      </StyledMapView>
    );
  },
);

function clusterMarkers(markers: Coords[], distance = 0.01) {
  const clusters: {
    latitude: number;
    longitude: number;
    count: number;
    markers: Coords[];
  }[] = [];

  markers.forEach((m) => {
    const cluster = clusters.find(
      (c) =>
        Math.abs(c.latitude - m.latitude) <= distance &&
        Math.abs(c.longitude - m.longitude) <= distance,
    );

    if (cluster) {
      cluster.count += 1;
      cluster.markers.push(m);
    } else {
      clusters.push({
        latitude: m.latitude,
        longitude: m.longitude,
        count: 1,
        markers: [m],
      });
    }
  });

  return clusters;
}

function useStyles(theme: AppTheme) {
  return StyleSheet.create({
    cluster: {
      backgroundColor: theme.colors.info,
      borderRadius: theme.spacing.spacing5,
      paddingHorizontal: theme.spacing.spacing2,
      paddingVertical: theme.spacing.spacing1,
      minWidth: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    clusterText: {
      color: theme.colors.gray00,
      ...theme.typography.body2Bold,
    },
  });
}
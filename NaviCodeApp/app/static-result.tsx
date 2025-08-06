import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@emotion/react';
import type { AppTheme } from '@/theme';
import { MapViewWithPin } from '@/components/MapViewWithPin/MapViewWithPin';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { LocationActionButtons } from '@/components/LocationActionButtons';

export default function StaticResultScreen() {
  const { name, latitude, longitude } = useLocalSearchParams<{
    name: string;
    latitude: string;
    longitude: string;
  }>();
  const theme = useTheme() as AppTheme;
  const styles = useStyles(theme);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const coords = {
    latitude: Number(latitude),
    longitude: Number(longitude),
  };

  return (
    <View style={styles.container}>
      <MapViewWithPin markerCoords={coords} />
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: theme.colors.backgroundFill,
          opacity: 0.9,
        }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.textSub }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.coords}>
            {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
          </Text>
          <LocationActionButtons name={name} coords={coords} />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

function useStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1 },
    sheetContent: {
      padding: theme.spacing.spacing4,
      gap: theme.spacing.spacing2,
    },
    title: {
      ...theme.typography.title2Bold,
      color: theme.colors.textDefault,
    },
    coords: {
      ...theme.typography.body2Regular,
      color: theme.colors.textSub,
    },
  });
}

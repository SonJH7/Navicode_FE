import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Share } from 'react-native';
import * as Linking from 'expo-linking';
import { useTheme } from '@emotion/react';
import type { AppTheme } from '@/theme';

interface Props {
  name: string;
  coords: { latitude: number; longitude: number };
}

export function LocationActionButtons({ name, coords }: Props) {
  const theme = useTheme() as AppTheme;
  const styles = useStyles(theme);

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.latitude},${coords.longitude}`;
    Linking.openURL(url);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${name} (${coords.latitude}, ${coords.longitude})`,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.button} onPress={handleDirections}>
        <Text style={styles.buttonText}>길찾기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <Text style={styles.buttonText}>공유</Text>
      </TouchableOpacity>
    </View>
  );
}

function useStyles(theme: AppTheme) {
  return StyleSheet.create({
    buttonRow: {
      flexDirection: 'row',
      gap: theme.spacing.spacing2,
      marginTop: theme.spacing.spacing2,
    },
    button: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.backgroundDefault,
      paddingVertical: theme.spacing.spacing2,
      borderRadius: theme.spacing.spacing3,
    },
    buttonText: {
      ...theme.typography.body2Bold,
      color: theme.colors.textDefault,
    },
  });
}

export default LocationActionButtons;

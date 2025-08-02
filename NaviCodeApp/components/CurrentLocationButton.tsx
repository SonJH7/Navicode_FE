import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@emotion/react';
import type { AppTheme } from '@/theme';

interface CurrentLocationButtonProps {
  onPress: () => void;
}

export function CurrentLocationButton({ onPress }: CurrentLocationButtonProps) {
  const theme = useTheme() as AppTheme;
  const styles = useStyles(theme);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <MaterialIcons name="my-location" size={20} color={theme.colors.textDefault} />
    </TouchableOpacity>
  );
}

function useStyles(theme: AppTheme) {
  return StyleSheet.create({
    button: {
      position: 'absolute',
      bottom: theme.spacing.spacing4,
      right: theme.spacing.spacing4,
      backgroundColor: theme.colors.backgroundFill,
      borderRadius: theme.spacing.spacing6,
      borderWidth: 1,
      borderColor: theme.colors.borderDefault,
      padding: theme.spacing.spacing3,
    },
  });
}
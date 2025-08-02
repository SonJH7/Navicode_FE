import React from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@emotion/react';
import type { AppTheme } from '@/theme';
import { MapViewWithPin } from '@/components/MapViewWithPin/MapViewWithPin';


export default function HomeScreen() {
  const theme = useTheme() as AppTheme;
  const styles = useStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>NaviCode</Text>
        </View>
        <MaterialIcons name="person" size={32} color={theme.colors.iconDark} />
      </View>
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={20} color={theme.colors.textPlaceholder} />
        <TextInput
          style={styles.searchInput}
          placeholder="NaviCode 검색"
          placeholderTextColor={theme.colors.textPlaceholder}
        />
         </View>
      <View style={styles.mapContainer}>
        <MapViewWithPin showUserLocation />
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
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.spacing4,
      paddingVertical: theme.spacing.spacing4,
    },
    brandContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.spacing2,
    },
logo: {
      width: 32,
      height: 32,
    },
    brandText: {
      ...theme.typography.title1Bold,
      color: theme.colors.textDefault,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: theme.spacing.spacing4,
      marginBottom: theme.spacing.spacing4,
      backgroundColor: theme.colors.backgroundFill,
      borderRadius: theme.spacing.spacing6,
      borderWidth: 1,
      borderColor: theme.colors.borderDefault,
      paddingHorizontal: theme.spacing.spacing3,
      paddingVertical: theme.spacing.spacing2,
      gap: theme.spacing.spacing2,
    },
    searchInput: {
      flex: 1,
      ...theme.typography.body1Regular,
      color: theme.colors.textDefault,
    },
    mapContainer: {
      flex: 1,
    },
  });
}

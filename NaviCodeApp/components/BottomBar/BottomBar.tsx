import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@emotion/react';
import type { AppTheme } from '@/theme';
import { useRouter } from 'expo-router';

interface BottomBarProps {
  selected: 'explore' | 'make' | 'mypage';
}

export function BottomBar({ selected }: BottomBarProps) {
  const theme = useTheme() as AppTheme;
  const styles = useStyles(theme);
  const router = useRouter();

  const handleSelect = (tab: 'explore' | 'make' | 'mypage') => {
    if (tab === selected) return;
    switch (tab) {
      case 'explore':
        router.push('/');
        break;
      case 'make':
        router.push('/make');
        break;
      case 'mypage':
        router.push('/mypage');
        break;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item} onPress={() => handleSelect('explore')}>
        <View style={[styles.iconWrapper, selected === 'explore' && styles.selected]}>
          <Ionicons
            name="location-sharp"
            size={20}
            color={selected === 'explore' ? theme.colors.info : theme.colors.iconLight}
          />
        </View>
        <Text style={[styles.text, selected === 'explore' && styles.textSelected]}>Explore</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => handleSelect('make')}>
        <MaterialIcons
          name="bookmark-border"
          size={24}
          color={selected === 'make' ? theme.colors.info : theme.colors.iconLight}
        />
        <Text style={[styles.text, selected === 'make' && styles.textSelected]}>make</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => handleSelect('mypage')}>
        <Ionicons
          name="person-circle-outline"
          size={24}
          color={selected === 'mypage' ? theme.colors.info : theme.colors.iconLight}
        />
        <Text style={[styles.text, selected === 'mypage' && styles.textSelected]}>mypage</Text>
      </TouchableOpacity>
    </View>
  );
}

function useStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: theme.spacing.spacing8,
      left: theme.spacing.spacing8,
      right: theme.spacing.spacing8,
      backgroundColor: theme.colors.backgroundDefault,
      borderRadius: theme.spacing.spacing10,
      paddingVertical: theme.spacing.spacing3,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5,
    },
    item: {
      alignItems: 'center',
      gap: theme.spacing.spacing1,
    },
    iconWrapper: {
      backgroundColor: 'transparent',
      padding: theme.spacing.spacing1,
      borderRadius: 50,
    },
    selected: {
      backgroundColor: theme.colors.infoBackground,
    },
    text: {
      fontSize: 12,
      color: theme.colors.textDefault,
    },
    textSelected: {
      fontWeight: 'bold',
      color: theme.colors.info,
    },
  });
}

export default BottomBar;

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, KeyboardTypeOptions } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@emotion/react';
import type { AppTheme } from '@/theme';
import { useCode } from '@/contexts/CodeContext';
import { useCoordSearch } from '@/hooks/useCoordSearch';
import { useRouter } from 'expo-router';

interface SearchBarProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onSearch?: (text: string) => Promise<void> | void;
  location?: { latitude: number; longitude: number };
  keyboardType?: KeyboardTypeOptions;
}

export function SearchBar({
  placeholder = 'NaviCode 검색',
  onChangeText,
  onSearch,
  location,
  keyboardType = 'phone-pad',
}: SearchBarProps) {
  const theme = useTheme() as AppTheme;
  const styles = useStyles(theme);
  const { state } = useCode();
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const { search } = useCoordSearch();

  const router = useRouter();

  const handleChangeText = (value: string) => {
    setText(value);
    onChangeText?.(value);
  };

  const handleSelect = (value: string) => {
    setText(value);
    onChangeText?.(value);
    setFocused(false);
  };

  const handleSearch = async () => {
    try {
      if (onSearch) {
        await onSearch(text);
        return;
      }
      const res = await search(text, location);
      if (res.type === '2' && res.staticResult) {
        router.push({
          pathname: '/static-result',
          params: {
            name: res.staticResult.name,
            latitude: res.staticResult.latitude.toString(),
            longitude: res.staticResult.longitude.toString(),
          },
        });
      } else if (res.type === '1') {
        router.push({
          pathname: '/dynamic-result',
          params: {
            navicode: text,
            latitude: location?.latitude?.toString() ?? '',
            longitude: location?.longitude?.toString() ?? '',
          },
        });
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleSearch}>
          <MaterialIcons name="search" size={20} color={theme.colors.textPlaceholder} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textPlaceholder}
          keyboardType={keyboardType}
          onChangeText={handleChangeText}
          value={text}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={handleSearch}
        />
      </View>
      {focused && (
        <View style={styles.dropdown}>
          {state.recent.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>최근 검색</Text>
              {state.recent.map((item) => (
                <TouchableOpacity
                  key={`recent-${item.code}`}
                  onPress={() => handleSelect(item.code)}
                >
                  <Text style={styles.itemText}>{item.code}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {state.favorites.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>즐겨찾기</Text>
              {state.favorites.map((item) => (
                <TouchableOpacity
                  key={`favorite-${item.code}`}
                  onPress={() => handleSelect(item.code)}
                >
                  <Text style={styles.itemText}>{item.code}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function useStyles(theme: AppTheme) {
  return StyleSheet.create({
    wrapper: {
      marginHorizontal: theme.spacing.spacing4,
      marginBottom: theme.spacing.spacing4,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundFill,
      borderRadius: theme.spacing.spacing6,
      borderWidth: 1,
      borderColor: theme.colors.borderDefault,
      paddingHorizontal: theme.spacing.spacing3,
      paddingVertical: theme.spacing.spacing2,
      gap: theme.spacing.spacing2,
    },
    input: {
      flex: 1,
      ...theme.typography.body1Regular,
      color: theme.colors.textDefault,
    },
    dropdown: {
      marginTop: theme.spacing.spacing1,
      backgroundColor: theme.colors.backgroundDefault,
      borderWidth: 1,
      borderColor: theme.colors.borderDefault,
      borderRadius: theme.spacing.spacing3,
      padding: theme.spacing.spacing2,
      gap: theme.spacing.spacing2,
    },
    section: {
      gap: theme.spacing.spacing1,
    },
    sectionTitle: {
      ...theme.typography.label1Bold,
      color: theme.colors.textSub,
    },
    itemText: {
      ...theme.typography.body2Regular,
      color: theme.colors.textDefault,
      paddingVertical: theme.spacing.spacing1,
    },
  });
}

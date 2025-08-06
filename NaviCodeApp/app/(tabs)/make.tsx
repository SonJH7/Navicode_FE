import React, { useRef, useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '@emotion/react';
import type { AppTheme } from '@/theme';
import { MapViewWithPin } from '@/components/MapViewWithPin/MapViewWithPin';
import { SearchBar } from '@/components/SearchBar';
import { CurrentLocationButton } from '@/components/CurrentLocationButton';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomBar } from '@/components/BottomBar/BottomBar';
import { addCoordLocation } from '@/api/coord';

export default function MakeScreen() {
  const theme = useTheme() as AppTheme;
  const styles = useStyles(theme);
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number }>();
  const [markerCoords, setMarkerCoords] = useState<{ latitude: number; longitude: number }>();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const snapPoints = useMemo(() => ['25%'], []);

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
      const coords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      setUserLocation(coords);
      setMarkerCoords(coords);
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
        await Location.requestForegroundPermissionsAsync();
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  const handleRegister = async () => {
    if (!markerCoords || name.trim() === '') {
      const msg = '이름과 위치를 모두 입력하세요';
      if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
      } else {
        Alert.alert(msg);
      }
      return;
    }

    const payload: {
      name: string;
      latitude: string;
      longitude: string;
      type: '2';
      navicode?: string;
    } = {
      name: name.trim(),
      latitude: markerCoords.latitude.toString(),
      longitude: markerCoords.longitude.toString(),
      type: '2',
    };
    if (code.trim()) {
      payload.navicode = code.trim();
    }

    try {
      const res = await addCoordLocation(payload);
      if (res.success === 'true') {
        const message = `등록 완료: ${res.navicode}`;
        if (Platform.OS === 'android') {
          ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
          Alert.alert('등록 완료', res.navicode ?? '');
        }
        setCode('');
        setName('');
      } else {
        const message = '등록 실패: 코드 중복';
        if (Platform.OS === 'android') {
          ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
          Alert.alert(message);
        }
      }
    } catch (e) {
      const message = '등록 중 오류가 발생했습니다';
      if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      } else {
        Alert.alert(message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <MapViewWithPin
        ref={mapRef}
        markerCoords={markerCoords}
        onMarkerDragEnd={setMarkerCoords}
        showUserLocation
        onUserLocationChange={(coords) => {
          setUserLocation(coords);
          if (!markerCoords) setMarkerCoords(coords);
        }}
      />
      <View style={styles.searchOverlay} pointerEvents="box-none">
        <SearchBar location={userLocation} />
      </View>
      <CurrentLocationButton onPress={handleCurrentLocation} style={styles.currentLocationButton} />
      <BottomBar selected="make" />
      <BottomSheet
        index={0}
        snapPoints={snapPoints}
        bottomInset={theme.spacing.spacingCLB}
        backgroundStyle={{ backgroundColor: theme.colors.backgroundFill, opacity: 0.9 }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.textSub }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.title}>정적 위치 등록</Text>
          <TextInput
            style={styles.singleInput}
            value={name}
            onChangeText={setName}
            placeholder="장소 이름을 입력하세요"
            placeholderTextColor={theme.colors.textPlaceholder}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="코드를 입력하세요"
              placeholderTextColor={theme.colors.textPlaceholder}
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>등록</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

function useStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
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
    sheetContent: {
      padding: theme.spacing.spacing4,
      gap: theme.spacing.spacing4,
    },
    title: {
      ...theme.typography.title2Bold,
      color: theme.colors.textDefault,
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 999,
      borderColor: theme.colors.borderDefault,
      alignItems: 'center',
      paddingHorizontal: theme.spacing.spacing2,
      backgroundColor: theme.colors.backgroundDefault,
    },
    singleInput: {
      borderWidth: 1,
      borderRadius: 999,
      borderColor: theme.colors.borderDefault,
      paddingVertical: theme.spacing.spacing3,
      paddingHorizontal: theme.spacing.spacing3,
      ...theme.typography.body2Regular,
      color: theme.colors.textDefault,
      backgroundColor: theme.colors.backgroundDefault,
    },
    input: {
      flex: 1,
      paddingVertical: theme.spacing.spacing3,
      paddingHorizontal: theme.spacing.spacing3,
      ...theme.typography.body2Regular,
      color: theme.colors.textDefault,
    },
    button: {
      backgroundColor: theme.colors.textDefault,
      paddingVertical: theme.spacing.spacing3,
      paddingHorizontal: theme.spacing.spacing3,
      borderRadius: theme.spacing.spacing2,
      marginLeft: theme.spacing.spacing2,
    },
    buttonText: {
      color: theme.colors.gray00,
      ...theme.typography.label2Bold,
    },
  });
}

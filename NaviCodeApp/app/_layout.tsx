import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from 'react-native';
import { theme } from '@/theme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CodeProvider } from '@/contexts/CodeContext';

function Navigation() {
  const { state } = useAuth();
  if (state.loading) {
    return null;
  }

  if (state.token == null) {
    return (
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
      </Stack>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="make" options={{ headerShown: false }} />
      <Stack.Screen name="mypage" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Pretendard: require('../assets/fonts/Pretendard-Regular.ttf'),
    Black: require('../assets/fonts/Pretendard-Black.ttf'),
    Bold: require('../assets/fonts/Pretendard-Bold.ttf'),
    ExtraBold: require('../assets/fonts/Pretendard-ExtraBold.ttf'),
    ExtraLight: require('../assets/fonts/Pretendard-ExtraLight.ttf'),
    Light: require('../assets/fonts/Pretendard-Light.ttf'),
    Medium: require('../assets/fonts/Pretendard-Medium.ttf'),
    SemiBold: require('../assets/fonts/Pretendard-SemiBold.ttf'),
    Thin: require('../assets/fonts/Pretendard-Thin.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CodeProvider>
          <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <EmotionThemeProvider theme={theme}>
              <Navigation />
              <StatusBar style="auto" />
            </EmotionThemeProvider>
          </NavigationThemeProvider>
        </CodeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

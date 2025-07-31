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

import { useColorScheme } from '@/hooks/useColorScheme';
import { theme } from '@/theme';

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
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <EmotionThemeProvider theme={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </EmotionThemeProvider>
    </NavigationThemeProvider>
  );
}

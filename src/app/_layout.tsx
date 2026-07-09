import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { palette } from '@/theme';

// Keep the splash up until the custom fonts are ready so the UI never
// flashes in the system font first.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PaytoneOne: require('../../assets/fonts/PaytoneOne-Regular.ttf'),
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  // Hold render until fonts resolve (or fail) to avoid a font swap flash.
  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: palette.bg },
          animation: 'slide_from_right',
          animationDuration: 240,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="index" />
        {/* Players opens like a bottom sheet. */}
        <Stack.Screen name="players" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="game/[id]" />
      </Stack>
    </SafeAreaProvider>
  );
}

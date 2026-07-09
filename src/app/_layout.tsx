import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { palette } from '@/theme';

export default function RootLayout() {
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

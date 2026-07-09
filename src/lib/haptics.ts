import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { useGameStore } from '@/store/useGameStore';

/** Fire haptic feedback if enabled and supported (no-op on web). */
export function tap(style: 'light' | 'medium' | 'heavy' = 'light') {
  if (Platform.OS === 'web') return;
  if (!useGameStore.getState().settings.haptics) return;
  const map = {
    light: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
  } as const;
  Haptics.impactAsync(map[style]).catch(() => {});
}

export function notify(type: 'success' | 'warning' | 'error' = 'success') {
  if (Platform.OS === 'web') return;
  if (!useGameStore.getState().settings.haptics) return;
  const map = {
    success: Haptics.NotificationFeedbackType.Success,
    warning: Haptics.NotificationFeedbackType.Warning,
    error: Haptics.NotificationFeedbackType.Error,
  } as const;
  Haptics.notificationAsync(map[type]).catch(() => {});
}

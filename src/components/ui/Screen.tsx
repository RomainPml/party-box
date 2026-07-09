import { router } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Txt } from '@/components/ui/Txt';
import { tap } from '@/lib/haptics';
import { palette, radius, spacing } from '@/theme';

type Props = {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  /** Accent used for the ambient top glow. */
  glowColor?: string;
  scroll?: boolean;
};

export function Screen({ children, title, showBack = false, glowColor = palette.violet }: Props) {
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 3800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulse]);

  const glowTopStyle = useAnimatedStyle(() => ({ opacity: 0.1 + pulse.value * 0.11 }));
  const glowBottomStyle = useAnimatedStyle(() => ({ opacity: 0.05 + (1 - pulse.value) * 0.09 }));

  return (
    <View style={styles.root}>
      {/* Ambient glow blobs (slow pulse) for the "premium dark" feel */}
      <Animated.View
        style={[styles.glow, styles.glowTop, glowTopStyle, { backgroundColor: glowColor, pointerEvents: 'none' }]}
      />
      <Animated.View
        style={[styles.glow, styles.glowBottom, glowBottomStyle, { backgroundColor: palette.magenta, pointerEvents: 'none' }]}
      />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {(showBack || title) && (
          <View style={styles.header}>
            {showBack ? (
              <Pressable
                onPress={() => {
                  tap('light');
                  // Guard against GO_BACK errors when there's no history
                  // (direct URL / reload on web): fall back to the menu.
                  if (router.canGoBack()) router.back();
                  else router.replace('/');
                }}
                hitSlop={12}
                style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
              >
                <Txt variant="heading" color={palette.text}>
                  ‹
                </Txt>
              </Pressable>
            ) : (
              <View style={styles.backBtn} />
            )}
            <Txt variant="heading" style={styles.headerTitle} numberOfLines={1}>
              {title ?? ''}
            </Txt>
            <View style={styles.backBtn} />
          </View>
        )}
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg },
  safe: { flex: 1 },
  glow: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    opacity: 0.16,
  },
  glowTop: { top: -160, right: -120 },
  glowBottom: { bottom: -180, left: -140, opacity: 0.1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
  },
  headerTitle: { flex: 1, textAlign: 'center' },
  content: { flex: 1 },
});

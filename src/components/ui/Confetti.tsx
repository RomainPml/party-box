import { useEffect, useMemo } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { palette } from '@/theme';

const COLORS = [
  palette.violet,
  palette.magenta,
  palette.cyan,
  palette.lime,
  palette.amber,
  palette.blue,
];

type PieceConfig = {
  left: string;
  size: number;
  color: string;
  delay: number;
  drift: number;
  spin: number;
  duration: number;
  round: boolean;
};

function Piece({ left, size, color, delay, drift, spin, duration, round }: PieceConfig) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }), -1, true),
    );
  }, [t, delay, duration]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: t.value * drift }, { rotate: `${t.value * spin}deg` }],
    opacity: 0.25 + t.value * 0.45,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: left as ViewStyle['left'],
          top: -6,
          width: size,
          height: round ? size : size * 1.7,
          borderRadius: round ? size : 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

/** Purely decorative confetti drift behind the header. Non-interactive. */
export function Confetti({ count = 14 }: { count?: number }) {
  const pieces = useMemo<PieceConfig[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${Math.round((i / count) * 100 + (Math.random() * 8 - 4))}%`,
        size: 5 + Math.random() * 5,
        color: COLORS[i % COLORS.length],
        delay: Math.round(Math.random() * 2400),
        drift: 60 + Math.random() * 70,
        spin: (Math.random() > 0.5 ? 1 : -1) * (120 + Math.random() * 180),
        duration: 3200 + Math.random() * 2600,
        round: Math.random() > 0.55,
      })),
    [count],
  );

  return (
    <View pointerEvents="none" style={styles.layer}>
      {pieces.map((p, i) => (
        <Piece key={i} {...p} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    overflow: 'hidden',
  },
});

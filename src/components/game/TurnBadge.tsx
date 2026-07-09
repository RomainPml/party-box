import { StyleSheet, View } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import { palette, radius, spacing } from '@/theme';

export function TurnBadge({ name, color }: { name: string; color: string }) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Txt variant="label" color={palette.text}>
        Au tour de {name}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
});

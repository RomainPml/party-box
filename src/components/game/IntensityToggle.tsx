import { Pressable, StyleSheet, View } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import { tap } from '@/lib/haptics';
import { useGameStore, type Intensity } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

const OPTIONS: { id: Intensity; label: string; emoji: string; color: string }[] = [
  { id: 'soft', label: 'Soft', emoji: '😇', color: palette.cyan },
  { id: 'hardcore', label: 'Hardcore', emoji: '🔥', color: palette.red },
];

/** Session-wide spice level. Persisted; shared across all games. */
export function IntensityToggle() {
  const intensity = useGameStore((s) => s.settings.intensity) ?? 'soft';
  const setSetting = useGameStore((s) => s.setSetting);

  return (
    <View style={styles.wrap}>
      {OPTIONS.map((o) => {
        const selected = intensity === o.id;
        return (
          <Pressable
            key={o.id}
            onPress={() => {
              tap('light');
              setSetting('intensity', o.id);
            }}
            accessibilityRole="button"
            accessibilityLabel={o.label}
            accessibilityState={{ selected }}
            style={[
              styles.chip,
              { borderColor: selected ? o.color : palette.border },
              selected && { backgroundColor: o.color + '1F' },
            ]}
          >
            <Txt style={{ fontSize: 15 }}>{o.emoji}</Txt>
            <Txt variant="label" color={selected ? palette.text : palette.textMuted}>
              {o.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: palette.surface,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
});

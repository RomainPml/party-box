import { Pressable } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import { tap } from '@/lib/haptics';
import { palette, radius, spacing } from '@/theme';

/** Small selectable pill used in game setup screens. */
export function Chip({
  label,
  emoji,
  selected,
  accent,
  onPress,
}: {
  label: string;
  emoji?: string;
  selected: boolean;
  accent: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        tap('light');
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          backgroundColor: selected ? accent + '1F' : palette.surface,
          borderRadius: radius.pill,
          borderWidth: 1.5,
          borderColor: selected ? accent : palette.border,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {emoji ? <Txt style={{ fontSize: 15 }}>{emoji}</Txt> : null}
      <Txt variant="label" color={selected ? palette.text : palette.textMuted}>
        {label}
      </Txt>
    </Pressable>
  );
}

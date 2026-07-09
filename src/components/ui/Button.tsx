import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import { tap } from '@/lib/haptics';
import { darken, font, glow, gradient, lighten, palette, radius, spacing } from '@/theme';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  accent?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  accent = palette.violet,
  disabled = false,
  fullWidth = true,
  style,
}: Props) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      onPress={() => {
        if (disabled) return;
        tap('medium');
        onPress?.();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        isPrimary && {
          backgroundColor: accent,
          ...gradient(`linear-gradient(150deg, ${lighten(accent, 0.2)}, ${darken(accent, 0.14)})`),
          ...glow(accent, 0.4),
        },
        variant === 'secondary' && {
          backgroundColor: palette.surfaceHi,
          borderWidth: 1,
          borderColor: palette.borderHi,
        },
        isGhost && { backgroundColor: 'transparent' },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View>
        <Txt
          color={isPrimary ? palette.black : isGhost ? palette.textMuted : palette.text}
          style={{ fontSize: font.size.md, fontFamily: font.family.bodyBold, letterSpacing: 0.2 }}
        >
          {label}
        </Txt>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { alignSelf: 'stretch' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.4 },
});

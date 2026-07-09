import { Text, type TextProps, type TextStyle } from 'react-native';

import { font, palette } from '@/theme';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'muted' | 'label' | 'caption';

const VARIANTS: Record<Variant, TextStyle> = {
  display: { fontSize: font.size.display, fontWeight: font.weight.heavy, color: palette.text },
  title: { fontSize: font.size.xxl, fontWeight: font.weight.heavy, color: palette.text },
  heading: { fontSize: font.size.lg, fontWeight: font.weight.bold, color: palette.text },
  body: { fontSize: font.size.md, fontWeight: font.weight.regular, color: palette.text },
  muted: { fontSize: font.size.sm, fontWeight: font.weight.regular, color: palette.textMuted },
  label: { fontSize: font.size.sm, fontWeight: font.weight.bold, color: palette.textMuted },
  caption: { fontSize: font.size.xs, fontWeight: font.weight.medium, color: palette.textFaint },
};

export function Txt({
  variant = 'body',
  color,
  style,
  ...rest
}: TextProps & { variant?: Variant; color?: string }) {
  return (
    <Text
      {...rest}
      style={[VARIANTS[variant], color ? { color } : null, style]}
    />
  );
}

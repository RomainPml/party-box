import { Text, type TextProps, type TextStyle } from 'react-native';

import { font, palette } from '@/theme';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'muted' | 'label' | 'caption';

// Custom fonts bake the weight into the family, so each variant picks a
// `fontFamily` rather than a `fontWeight`. Display/title/heading use the
// expressive Paytone One; body/UI text uses Poppins. Slight negative tracking
// tightens the large rounded display sizes.
const VARIANTS: Record<Variant, TextStyle> = {
  display: { fontSize: font.size.display, fontFamily: font.family.display, color: palette.text, letterSpacing: -0.5 },
  title: { fontSize: font.size.xxl, fontFamily: font.family.display, color: palette.text, letterSpacing: -0.4 },
  heading: { fontSize: font.size.lg, fontFamily: font.family.display, color: palette.text, letterSpacing: -0.2 },
  body: { fontSize: font.size.md, fontFamily: font.family.body, color: palette.text },
  muted: { fontSize: font.size.sm, fontFamily: font.family.body, color: palette.textMuted },
  label: { fontSize: font.size.sm, fontFamily: font.family.bodyBold, color: palette.textMuted },
  caption: { fontSize: font.size.xs, fontFamily: font.family.bodyMedium, color: palette.textFaint },
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

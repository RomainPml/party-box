/**
 * PartyBox — design tokens (dark premium).
 * Single source of truth for colors, spacing, radius, typography.
 * Games reference `accent` values from here so the palette stays coherent.
 */
import { Platform, type ViewStyle } from 'react-native';

export const palette = {
  // Deep near-black backgrounds with a subtle violet tint
  bg: '#0B0910',
  bgElevated: '#151221',
  surface: '#1B1729',
  surfaceHi: '#241E36',
  border: '#2C2740',
  borderHi: '#3A3352',

  text: '#F4F1FB',
  textMuted: '#A79FC2',
  textFaint: '#6E6785',

  // Neon accents — assigned to games/families for visual identity
  violet: '#A855F7',
  magenta: '#EC4899',
  cyan: '#22D3EE',
  lime: '#A3E635',
  amber: '#FBBF24',
  red: '#F43F5E',
  blue: '#5B8CFF',
  teal: '#2DD4BF',

  white: '#FFFFFF',
  black: '#000000',

  danger: '#F43F5E',
  success: '#34D399',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const font = {
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 26,
    xxl: 34,
    display: 44,
  },
  weight: {
    regular: '400',
    medium: '600',
    bold: '700',
    heavy: '800',
  },
  /**
   * Font-family names. These MUST match the keys registered in `useFonts`
   * (see app/_layout.tsx). With custom fonts the weight is baked into the
   * family, so components pick a family rather than a `fontWeight`.
   *  - `display`: Paytone One — fat rounded display for the wordmark & titles.
   *  - `body*`  : Poppins — clean geometric sans for everything else.
   */
  family: {
    display: 'PaytoneOne',
    body: 'Poppins-Regular',
    bodyMedium: 'Poppins-Medium',
    bodySemiBold: 'Poppins-SemiBold',
    bodyBold: 'Poppins-Bold',
  },
} as const;

/** Soft glow shadow, tinted by an accent color. */
export const glow = (color: string, opacity = 0.45) => ({
  shadowColor: color,
  shadowOpacity: opacity,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 8 },
  elevation: 8,
});

/**
 * Cross-platform CSS gradient background. RN 0.86 draws linear/radial
 * gradients from a CSS string via `experimental_backgroundImage` on native
 * and `backgroundImage` on web. Use for glows, buttons, washes.
 *   gradient(`linear-gradient(150deg, ${a}, ${b})`)
 *   gradient(`radial-gradient(circle at 50% 40%, ${a}, transparent 70%)`)
 */
export const gradient = (css: string): ViewStyle =>
  (Platform.OS === 'web'
    ? { backgroundImage: css }
    : { experimental_backgroundImage: css }) as ViewStyle;

// --- Small hex-color maths so gradients can derive tints from an accent ---

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));

const toRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
};

const toHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((n) => clamp(n).toString(16).padStart(2, '0')).join('');

/** Blend two hex colors: t=0 → a, t=1 → b. */
export const mix = (a: string, b: string, t: number) => {
  const [r1, g1, b1] = toRgb(a);
  const [r2, g2, b2] = toRgb(b);
  return toHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
};

/** Lighten a hex color toward white by `amt` (0–1). */
export const lighten = (hex: string, amt: number) => mix(hex, palette.white, amt);

/** Darken a hex color toward black by `amt` (0–1). */
export const darken = (hex: string, amt: number) => mix(hex, palette.black, amt);

/** Append an alpha byte to a 6-digit hex (0–1 → #RRGGBBAA). */
export const alpha = (hex: string, a: number) =>
  hex + clamp(a * 255).toString(16).padStart(2, '0');

export type AccentColor = keyof Pick<
  typeof palette,
  'violet' | 'magenta' | 'cyan' | 'lime' | 'amber' | 'red' | 'blue' | 'teal'
>;

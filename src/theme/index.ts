/**
 * PartyBox — design tokens (dark premium).
 * Single source of truth for colors, spacing, radius, typography.
 * Games reference `accent` values from here so the palette stays coherent.
 */

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
} as const;

/** Soft glow shadow, tinted by an accent color. */
export const glow = (color: string, opacity = 0.45) => ({
  shadowColor: color,
  shadowOpacity: opacity,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 8 },
  elevation: 8,
});

export type AccentColor = keyof Pick<
  typeof palette,
  'violet' | 'magenta' | 'cyan' | 'lime' | 'amber' | 'red' | 'blue' | 'teal'
>;

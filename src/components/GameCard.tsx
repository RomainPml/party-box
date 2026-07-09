import { Pressable, StyleSheet, View } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import type { GameMeta } from '@/data/games';
import { tap } from '@/lib/haptics';
import { glow, gradient, mix, palette, radius, spacing } from '@/theme';

export function GameCard({ game, onPress }: { game: GameMeta; onPress: () => void }) {
  const accent = palette[game.accent];
  const soon = game.status === 'soon';

  // Opaque accent wash across the card (corner tint → surface) so every game
  // reads as its own colour — the menu becomes a colourful arcade grid.
  const cardWash = gradient(
    `linear-gradient(120deg, ${mix(palette.surface, accent, 0.16)}, ${palette.surface} 62%)`,
  );
  // Emoji tile: a punchier accent gradient that glows in its own colour.
  const chipWash = gradient(
    `linear-gradient(145deg, ${mix(palette.surface, accent, 0.5)}, ${mix(palette.surface, accent, 0.16)})`,
  );

  return (
    <Pressable
      onPress={() => {
        tap('light');
        onPress();
      }}
      style={({ pressed }) => [
        styles.card,
        cardWash,
        { borderColor: pressed ? accent : palette.border },
        pressed && { transform: [{ scale: 0.97 }], ...glow(accent, 0.5) },
      ]}
    >
      <View style={[styles.emojiWrap, chipWash, { borderColor: accent + '66' }, glow(accent, 0.45)]}>
        <Txt style={styles.emoji}>{game.emoji}</Txt>
      </View>

      <View style={styles.textWrap}>
        <Txt variant="heading" numberOfLines={1}>
          {game.title}
        </Txt>
        <Txt variant="muted" numberOfLines={2}>
          {game.tagline}
        </Txt>
      </View>

      {soon ? (
        <View style={styles.soonBadge}>
          <Txt variant="caption" color={palette.textMuted}>
            BIENTÔT
          </Txt>
        </View>
      ) : (
        <View style={[styles.dot, { backgroundColor: accent }, glow(accent, 0.7)]} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  emojiWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 26 },
  textWrap: { flex: 1, gap: 2 },
  soonBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: palette.bgElevated,
    borderWidth: 1,
    borderColor: palette.border,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
});

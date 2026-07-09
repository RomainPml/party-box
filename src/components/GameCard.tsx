import { Pressable, StyleSheet, View } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import type { GameMeta } from '@/data/games';
import { tap } from '@/lib/haptics';
import { palette, radius, spacing } from '@/theme';

export function GameCard({ game, onPress }: { game: GameMeta; onPress: () => void }) {
  const accent = palette[game.accent];
  const soon = game.status === 'soon';

  return (
    <Pressable
      onPress={() => {
        tap('light');
        onPress();
      }}
      style={({ pressed }) => [
        styles.card,
        { borderColor: pressed ? accent : palette.border },
        pressed && { transform: [{ scale: 0.97 }] },
      ]}
    >
      <View style={[styles.emojiWrap, { backgroundColor: accent + '22', borderColor: accent + '55' }]}>
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
        <View style={[styles.dot, { backgroundColor: accent }]} />
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

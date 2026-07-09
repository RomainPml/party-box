import { Pressable, StyleSheet, View } from 'react-native';

import { Txt } from '@/components/ui/Txt';
import { notify } from '@/lib/haptics';
import type { Player } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

/**
 * Shared "who is the culprit?" voting grid used by the secret-word games
 * (Imposteur, Undercover). Tapping a player fires a warning haptic and
 * reports the pick.
 */
export function VotePicker({
  question,
  players,
  accent,
  onPick,
}: {
  question: string;
  players: Player[];
  accent: string;
  onPick: (p: Player) => void;
}) {
  return (
    <View style={styles.playWrap}>
      <View style={[styles.card, { borderColor: accent }]}>
        <Txt variant="title" style={styles.question}>
          {question}
        </Txt>
      </View>
      <View style={styles.grid}>
        {players.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => {
              notify('warning');
              onPick(p);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Voter contre ${p.name}`}
            style={({ pressed }) => [
              styles.chip,
              { borderColor: pressed ? p.color : palette.border },
              pressed && { backgroundColor: p.color + '1F' },
            ]}
          >
            <View style={[styles.chipDot, { backgroundColor: p.color }]} />
            <Txt variant="heading" style={{ fontSize: 16 }} numberOfLines={1}>
              {p.name}
            </Txt>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  playWrap: { flex: 1, justifyContent: 'center', gap: spacing.lg },
  card: {
    alignSelf: 'stretch',
    borderRadius: radius.xl,
    borderWidth: 1.5,
    backgroundColor: palette.surface,
    padding: spacing.xl,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  question: { textAlign: 'center', fontSize: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: palette.surface,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  chipDot: { width: 10, height: 10, borderRadius: 5 },
});

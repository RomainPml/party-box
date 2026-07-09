import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { Gate } from '@/components/game/Gate';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import { IntensityToggle } from '@/components/game/IntensityToggle';
import { QUI_PARMI_NOUS, QUI_PARMI_NOUS_HOT } from '@/data/decks/qui-parmi-nous';
import { QUI_POURRAIT, QUI_POURRAIT_HOT } from '@/data/decks/qui-pourrait';
import type { GameMeta } from '@/data/games';
import { useDeck } from '@/games/_engine/deck';
import { notify, tap } from '@/lib/haptics';
import type { Player } from '@/store/useGameStore';
import { useGameStore } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

/** Question pools keyed by game id — both games share this "designation" engine. */
const POOLS: Record<string, string[]> = {
  'qui-pourrait': QUI_POURRAIT,
  'qui-parmi-nous': QUI_PARMI_NOUS,
};
const POOLS_HOT: Record<string, string[]> = {
  'qui-pourrait': QUI_POURRAIT_HOT,
  'qui-parmi-nous': QUI_PARMI_NOUS_HOT,
};
const EMPTY: string[] = [];

export function Designation({ game }: { game: GameMeta }) {
  const players = useGameStore((s) => s.players);
  const accent = palette[game.accent];
  const intensity = useGameStore((s) => s.settings.intensity);
  const deck = useDeck((intensity === 'hardcore' ? POOLS_HOT : POOLS)[game.id] ?? EMPTY);
  const [started, setStarted] = useState(false);
  const [chosen, setChosen] = useState<Player | null>(null);

  if (players.length < game.minPlayers) {
    return (
      <Screen title={game.title} showBack glowColor={accent}>
        <Gate emoji={game.emoji} minPlayers={game.minPlayers} current={players.length} accent={accent} />
      </Screen>
    );
  }

  const designate = (p: Player) => {
    notify('success');
    setChosen(p);
  };

  const nextQuestion = () => {
    tap('medium');
    deck.next();
    setChosen(null);
  };

  return (
    <Screen title={game.title} showBack glowColor={accent}>
      <View style={styles.container}>
        {!started ? (
          <View style={styles.center}>
            <Txt style={styles.emoji}>{game.emoji}</Txt>
            <Txt variant="title" style={{ textAlign: 'center' }}>
              {game.title}
            </Txt>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              On lit la question, tout le monde pointe la personne à voix haute,{'\n'}
              puis on tape celle qui ressort. 👇
            </Txt>
            <IntensityToggle />
            <View style={styles.actions}>
              <Button label="C’est parti" accent={accent} onPress={() => setStarted(true)} />
            </View>
          </View>
        ) : chosen ? (
          <View style={styles.center}>
            <Txt variant="label" color={palette.textMuted}>
              LE GROUPE A DÉSIGNÉ
            </Txt>
            <Animated.View
              entering={ZoomIn.springify().damping(12)}
              style={[styles.winnerAvatar, { backgroundColor: chosen.color }]}
            >
              <Txt variant="display" color={palette.black}>
                {chosen.name.charAt(0).toUpperCase()}
              </Txt>
            </Animated.View>
            <Txt variant="title" style={{ textAlign: 'center' }} color={chosen.color}>
              {chosen.name}
            </Txt>
            <Txt variant="muted" style={styles.revealQuestion}>
              {deck.current}
            </Txt>
            <View style={styles.actions}>
              <Button label="Question suivante →" accent={accent} onPress={nextQuestion} />
            </View>
          </View>
        ) : (
          <View style={styles.playWrap}>
            <Animated.View
              key={deck.current}
              entering={FadeIn.duration(260)}
              style={[styles.card, { borderColor: accent }]}
            >
              <Txt variant="title" style={styles.questionText}>
                {deck.current}
              </Txt>
            </Animated.View>

            <Txt variant="label" style={styles.pickHint}>
              TAPE LA PERSONNE DÉSIGNÉE
            </Txt>
            <View style={styles.grid}>
              {players.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => designate(p)}
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
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, maxWidth: 560, width: '100%', alignSelf: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emoji: { fontSize: 56 },
  actions: { alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.md },

  playWrap: { flex: 1, justifyContent: 'center', gap: spacing.lg },
  card: {
    borderRadius: radius.xl,
    borderWidth: 1.5,
    backgroundColor: palette.surface,
    padding: spacing.xl,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: { textAlign: 'center', fontSize: 24, lineHeight: 32 },
  pickHint: { textAlign: 'center', letterSpacing: 1.5 },
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

  winnerAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  revealQuestion: { textAlign: 'center', marginTop: spacing.xs },
});

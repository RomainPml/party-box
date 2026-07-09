import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Gate } from '@/components/game/Gate';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import { IntensityToggle } from '@/components/game/IntensityToggle';
import { JAMAIS, JAMAIS_HOT } from '@/data/decks/je-nai-jamais';
import type { GameMeta } from '@/data/games';
import { useDeck } from '@/games/_engine/deck';
import { useGameStore } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

export function JeNaiJamais({ game }: { game: GameMeta }) {
  const players = useGameStore((s) => s.players);
  const accent = palette[game.accent];
  const intensity = useGameStore((s) => s.settings.intensity);
  const deck = useDeck(intensity === 'hardcore' ? JAMAIS_HOT : JAMAIS);
  const [started, setStarted] = useState(false);

  if (players.length < game.minPlayers) {
    return (
      <Screen title={game.title} showBack glowColor={accent}>
        <Gate emoji={game.emoji} minPlayers={game.minPlayers} current={players.length} accent={accent} />
      </Screen>
    );
  }

  return (
    <Screen title={game.title} showBack glowColor={accent}>
      <View style={styles.container}>
        {!started ? (
          <View style={styles.center}>
            <Txt style={styles.emoji}>{game.emoji}</Txt>
            <Txt variant="title" style={{ textAlign: 'center' }}>
              Je n’ai jamais…
            </Txt>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              On lit la carte à voix haute. Ceux qui l’ont déjà fait… boivent. 🍻
            </Txt>
            <IntensityToggle />
            <View style={styles.actions}>
              <Button label="C’est parti" accent={accent} onPress={() => setStarted(true)} />
            </View>
          </View>
        ) : (
          <View style={styles.center}>
            <Animated.View
              key={deck.current}
              entering={FadeIn.duration(260)}
              style={[styles.card, { borderColor: accent }]}
            >
              <Txt variant="label" color={accent}>
                JE N’AI JAMAIS
              </Txt>
              <Txt variant="title" style={styles.cardText}>
                {deck.current}
              </Txt>
            </Animated.View>
            <View style={styles.actions}>
              <Button label="Suivant →" accent={accent} onPress={deck.next} />
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, maxWidth: 560, width: '100%', alignSelf: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  emoji: { fontSize: 56 },
  card: {
    alignSelf: 'stretch',
    minHeight: 240,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    backgroundColor: palette.surface,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  cardText: { textAlign: 'center', fontSize: 26, lineHeight: 34 },
  actions: { alignSelf: 'stretch', gap: spacing.md },
});

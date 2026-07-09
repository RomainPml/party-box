import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Gate } from '@/components/game/Gate';
import { IntensityToggle } from '@/components/game/IntensityToggle';
import { PassPhone } from '@/components/game/PassPhone';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import { QUI_POURRAIT, QUI_POURRAIT_HOT } from '@/data/decks/qui-pourrait';
import type { GameMeta } from '@/data/games';
import { useDeck } from '@/games/_engine/deck';
import { usePlayerTurn } from '@/games/_engine/usePlayerTurn';
import { tap } from '@/lib/haptics';
import { useGameStore } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

type Phase = 'intro' | 'handoff' | 'question' | 'choice' | 'revealed';

const EMPTY: string[] = [];

export function Paranoia({ game }: { game: GameMeta }) {
  const players = useGameStore((s) => s.players);
  const accent = palette[game.accent];
  const intensity = useGameStore((s) => s.settings.intensity);
  const deck = useDeck((intensity === 'hardcore' ? QUI_POURRAIT_HOT : QUI_POURRAIT) ?? EMPTY);
  const { current, advance } = usePlayerTurn(players);

  const [phase, setPhase] = useState<Phase>('intro');

  if (players.length < game.minPlayers) {
    return (
      <Screen title={game.title} showBack glowColor={accent}>
        <Gate emoji={game.emoji} minPlayers={game.minPlayers} current={players.length} accent={accent} />
      </Screen>
    );
  }

  // Move to the next holder with a fresh secret question.
  const nextRound = () => {
    tap('medium');
    advance();
    deck.next();
    setPhase('handoff');
  };

  return (
    <Screen title={game.title} showBack glowColor={accent}>
      <View style={styles.container}>
        {phase === 'intro' && (
          <View style={styles.center}>
            <Txt style={styles.emoji}>{game.emoji}</Txt>
            <Txt variant="title" style={{ textAlign: 'center' }}>
              Paranoïa
            </Txt>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              Un(e) joueur(se) lit une question en secret et désigne quelqu’un à
              voix haute.{'\n'}
              Le groupe entend le prénom… mais pas la question. La personne
              désignée peut boire une gorgée pour la découvrir. 😱
            </Txt>
            <IntensityToggle />
            <View style={styles.actions}>
              <Button label="C’est parti" accent={accent} onPress={() => setPhase('handoff')} />
            </View>
          </View>
        )}

        {phase === 'handoff' && current && (
          <PassPhone
            name={current.name}
            color={current.color}
            subtitle="Lis la question en secret, sans la montrer."
            cta="Voir la question"
            accent={accent}
            onReady={() => {
              tap('light');
              setPhase('question');
            }}
          />
        )}

        {phase === 'question' && current && (
          <View style={styles.center}>
            <Txt variant="label" color={palette.textMuted}>
              QUESTION SECRÈTE DE {current.name.toUpperCase()}
            </Txt>
            <Animated.View
              key={deck.current}
              entering={FadeIn.duration(240)}
              style={[styles.card, { borderColor: accent }]}
            >
              <Txt variant="title" style={styles.questionText}>
                {deck.current}
              </Txt>
            </Animated.View>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              Désigne quelqu’un du doigt, à voix haute. Ne dis pas la question !
            </Txt>
            <View style={styles.actions}>
              <Button label="C’est dit →" accent={accent} onPress={() => setPhase('choice')} />
            </View>
          </View>
        )}

        {phase === 'choice' && (
          <View style={styles.center}>
            <Txt style={styles.emoji}>🍻</Txt>
            <Txt variant="title" style={{ textAlign: 'center' }}>
              Révéler la question ?
            </Txt>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              La personne désignée boit une gorgée pour découvrir la question…
              ou garde le mystère.
            </Txt>
            <View style={styles.actions}>
              <Button label="🍻 Elle boit — révéler" accent={accent} onPress={() => {
                tap('medium');
                setPhase('revealed');
              }} />
              <Button label="🙈 Garder le secret →" variant="secondary" onPress={nextRound} />
            </View>
          </View>
        )}

        {phase === 'revealed' && (
          <View style={styles.center}>
            <Txt variant="label" color={palette.textMuted}>
              LA QUESTION ÉTAIT
            </Txt>
            <View style={[styles.card, { borderColor: accent }]}>
              <Txt variant="title" style={styles.questionText}>
                {deck.current}
              </Txt>
            </View>
            <View style={styles.actions}>
              <Button label="Manche suivante →" accent={accent} onPress={nextRound} />
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
  card: {
    alignSelf: 'stretch',
    borderRadius: radius.xl,
    borderWidth: 1.5,
    backgroundColor: palette.surface,
    padding: spacing.xl,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: { textAlign: 'center', fontSize: 24, lineHeight: 32 },
});

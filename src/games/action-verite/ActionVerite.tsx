import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Gate } from '@/components/game/Gate';
import { TurnBadge } from '@/components/game/TurnBadge';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import { IntensityToggle } from '@/components/game/IntensityToggle';
import { ACTIONS, ACTIONS_HOT, VERITES, VERITES_HOT } from '@/data/decks/action-verite';
import type { GameMeta } from '@/data/games';
import { fillTemplate, useDeck } from '@/games/_engine/deck';
import { usePlayerTurn } from '@/games/_engine/usePlayerTurn';
import { tap } from '@/lib/haptics';
import { useGameStore } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

type Phase = 'intro' | 'choose' | 'card';
type Kind = 'action' | 'verite';

export function ActionVerite({ game }: { game: GameMeta }) {
  const players = useGameStore((s) => s.players);
  const accent = palette[game.accent];
  const intensity = useGameStore((s) => s.settings.intensity);
  const { current, others, advance } = usePlayerTurn(players);
  const actionDeck = useDeck(intensity === 'hardcore' ? ACTIONS_HOT : ACTIONS);
  const veriteDeck = useDeck(intensity === 'hardcore' ? VERITES_HOT : VERITES);

  const [phase, setPhase] = useState<Phase>('intro');
  const [kind, setKind] = useState<Kind>('action');
  const [card, setCard] = useState<string>('');

  if (players.length < game.minPlayers) {
    return (
      <Screen title={game.title} showBack glowColor={accent}>
        <Gate emoji={game.emoji} minPlayers={game.minPlayers} current={players.length} accent={accent} />
      </Screen>
    );
  }

  const pick = (k: Kind) => {
    tap('medium');
    const deck = k === 'action' ? actionDeck : veriteDeck;
    const raw = deck.current ?? '';
    setCard(fillTemplate(raw, current?.name, others));
    deck.next();
    setKind(k);
    setPhase('card');
  };

  const nextTurn = () => {
    advance();
    setPhase('choose');
  };

  return (
    <Screen title={game.title} showBack glowColor={accent}>
      <View style={styles.container}>
        {phase === 'intro' && (
          <View style={styles.center}>
            <Txt style={styles.emoji}>{game.emoji}</Txt>
            <Txt variant="title" style={{ textAlign: 'center' }}>
              Action ou Vérité
            </Txt>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              Chacun son tour, choisis Action ou Vérité.{'\n'}Refuser = tu bois. 🍻
            </Txt>
            <IntensityToggle />
            <View style={styles.actions}>
              <Button label="C’est parti" accent={accent} onPress={() => setPhase('choose')} />
            </View>
          </View>
        )}

        {phase === 'choose' && current && (
          <View style={styles.center}>
            <TurnBadge name={current.name} color={current.color} />
            <Txt variant="title" style={styles.question}>
              Action{'\n'}ou Vérité ?
            </Txt>
            <View style={styles.actions}>
              <Button label="🔥 Action" accent={palette.magenta} onPress={() => pick('action')} />
              <Button label="💬 Vérité" accent={palette.cyan} onPress={() => pick('verite')} />
            </View>
          </View>
        )}

        {phase === 'card' && current && (
          <View style={styles.center}>
            <TurnBadge name={current.name} color={current.color} />
            <Animated.View
              key={card}
              entering={FadeIn.duration(260)}
              style={[
                styles.card,
                { borderColor: kind === 'action' ? palette.magenta : palette.cyan },
              ]}
            >
              <Txt variant="label" color={kind === 'action' ? palette.magenta : palette.cyan}>
                {kind === 'action' ? 'ACTION' : 'VÉRITÉ'}
              </Txt>
              <Txt variant="title" style={styles.cardText}>
                {card}
              </Txt>
            </Animated.View>
            <View style={styles.actions}>
              <Button label="Suivant →" accent={accent} onPress={nextTurn} />
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
  question: { textAlign: 'center', fontSize: 30 },
  card: {
    alignSelf: 'stretch',
    minHeight: 220,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    backgroundColor: palette.surface,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  cardText: { textAlign: 'center', fontSize: 24, lineHeight: 32 },
  actions: { alignSelf: 'stretch', gap: spacing.md },
});

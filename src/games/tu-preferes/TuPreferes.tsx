import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Gate } from '@/components/game/Gate';
import { TurnBadge } from '@/components/game/TurnBadge';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import { IntensityToggle } from '@/components/game/IntensityToggle';
import { DILEMMES, DILEMMES_HOT, type Dilemme } from '@/data/decks/tu-preferes';
import type { GameMeta } from '@/data/games';
import { fillTemplate, useDeck } from '@/games/_engine/deck';
import { usePlayerTurn } from '@/games/_engine/usePlayerTurn';
import { tap } from '@/lib/haptics';
import { useGameStore, type Player } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

export function TuPreferes({ game }: { game: GameMeta }) {
  const players = useGameStore((s) => s.players);
  const accent = palette[game.accent];
  const intensity = useGameStore((s) => s.settings.intensity);
  const { current, advance, index } = usePlayerTurn(players);
  const deck = useDeck(intensity === 'hardcore' ? DILEMMES_HOT : DILEMMES);

  const [started, setStarted] = useState(false);
  const [choice, setChoice] = useState<'a' | 'b' | null>(null);
  // Filled copy of the current dilemma with {autre} resolved to a participant.
  const [card, setCard] = useState<Dilemme | null>(null);

  if (players.length < game.minPlayers) {
    return (
      <Screen title={game.title} showBack glowColor={accent}>
        <Gate emoji={game.emoji} minPlayers={game.minPlayers} current={players.length} accent={accent} />
      </Screen>
    );
  }

  // Show the current dilemma (names resolved) and queue the pointer forward.
  // `turnPlayer` is whoever's turn it is; they're excluded from {autre} so a
  // card never names the person currently playing.
  const drawFor = (turnPlayer: Player | undefined) => {
    const d = deck.current;
    const pool = players.filter((p) => p.id !== turnPlayer?.id).map((p) => p.name);
    setCard(
      d
        ? { a: fillTemplate(d.a, turnPlayer?.name, pool), b: fillTemplate(d.b, turnPlayer?.name, pool) }
        : null,
    );
    deck.next();
  };

  const startGame = () => {
    tap('medium');
    drawFor(current);
    setStarted(true);
  };

  const next = () => {
    // advance() is async, so derive the upcoming player explicitly.
    const nextPlayer = players[(index + 1) % players.length];
    advance();
    setChoice(null);
    drawFor(nextPlayer);
  };

  const Option = ({ side, text }: { side: 'a' | 'b'; text: string }) => {
    const selected = choice === side;
    const optColor = side === 'a' ? palette.cyan : palette.magenta;
    return (
      <Pressable
        onPress={() => {
          tap('medium');
          setChoice(side);
        }}
        style={({ pressed }) => [
          styles.option,
          { borderColor: selected ? optColor : palette.border },
          selected && { backgroundColor: optColor + '1F' },
          pressed && { opacity: 0.9 },
        ]}
      >
        <Txt variant="label" color={optColor}>
          {side === 'a' ? 'A' : 'B'}
        </Txt>
        <Txt variant="heading" style={styles.optionText}>
          {text}
        </Txt>
      </Pressable>
    );
  };

  return (
    <Screen title={game.title} showBack glowColor={accent}>
      <View style={styles.container}>
        {!started ? (
          <View style={styles.center}>
            <Txt style={styles.emoji}>{game.emoji}</Txt>
            <Txt variant="title" style={{ textAlign: 'center' }}>
              Tu préfères…
            </Txt>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              Deux choix, aucun bon. Chacun son tour, défends ta réponse !
            </Txt>
            <IntensityToggle />
            <View style={styles.actions}>
              <Button label="C’est parti" accent={accent} onPress={startGame} />
            </View>
          </View>
        ) : (
          <View style={styles.center}>
            {current && <TurnBadge name={current.name} color={current.color} />}
            <Animated.View key={card?.a} entering={FadeIn.duration(260)} style={styles.options}>
              <Option side="a" text={card?.a ?? ''} />
              <View style={styles.orWrap}>
                <Txt variant="label" color={palette.textFaint}>
                  OU
                </Txt>
              </View>
              <Option side="b" text={card?.b ?? ''} />
            </Animated.View>
            <View style={styles.actions}>
              <Button
                label={choice ? 'Suivant →' : 'Passer →'}
                accent={accent}
                variant={choice ? 'primary' : 'secondary'}
                onPress={next}
              />
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
  options: { alignSelf: 'stretch', gap: spacing.sm },
  option: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    backgroundColor: palette.surface,
    padding: spacing.xl,
    gap: spacing.sm,
    minHeight: 120,
    justifyContent: 'center',
  },
  optionText: { fontSize: 20, lineHeight: 26 },
  orWrap: { alignSelf: 'center', paddingVertical: 2 },
  actions: { alignSelf: 'stretch', gap: spacing.md },
});

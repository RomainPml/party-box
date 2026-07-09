import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Gate } from '@/components/game/Gate';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import { PICOLO, PICOLO_HOT } from '@/data/decks/picolo';
import type { GameMeta } from '@/data/games';
import { shuffle, useDeck } from '@/games/_engine/deck';
import { tap } from '@/lib/haptics';
import type { Player } from '@/store/useGameStore';
import { useGameStore } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

type Mode = 'classique' | 'hardcore';

/** Fills {j1}, {j2}… with distinct random players (same token = same player). */
function fillPicolo(text: string, players: Player[]): string {
  const names = shuffle(players.map((p) => p.name));
  const map: Record<string, string> = {};
  let i = 0;
  return text.replace(/\{j(\d)\}/g, (_m, n: string) => {
    if (!map[n]) {
      map[n] = names[i % names.length] ?? 'quelqu’un';
      i++;
    }
    return map[n];
  });
}

export function Picolo({ game }: { game: GameMeta }) {
  const players = useGameStore((s) => s.players);
  const accent = palette[game.accent];

  const [mode, setMode] = useState<Mode>('classique');
  const [started, setStarted] = useState(false);
  const [card, setCard] = useState('');

  const deck = useDeck(mode === 'hardcore' ? PICOLO_HOT : PICOLO);

  if (players.length < game.minPlayers) {
    return (
      <Screen title={game.title} showBack glowColor={accent}>
        <Gate emoji={game.emoji} minPlayers={game.minPlayers} current={players.length} accent={accent} />
      </Screen>
    );
  }

  const draw = () => {
    setCard(fillPicolo(deck.current ?? '', players));
    deck.next();
  };

  const startGame = () => {
    tap('medium');
    draw();
    setStarted(true);
  };

  return (
    <Screen title={game.title} showBack glowColor={accent}>
      <View style={styles.container}>
        {!started ? (
          <View style={styles.center}>
            <Txt style={styles.emoji}>{game.emoji}</Txt>
            <Txt variant="title" style={{ textAlign: 'center' }}>
              Picolo
            </Txt>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              On se passe le téléphone, on suit les cartes… et on boit. 🍻
            </Txt>

            <View style={styles.modes}>
              <Chip label="Classique" emoji="😄" selected={mode === 'classique'} accent={accent} onPress={() => setMode('classique')} />
              <Chip label="Hardcore" emoji="🔥" selected={mode === 'hardcore'} accent={palette.red} onPress={() => setMode('hardcore')} />
            </View>

            <View style={styles.actions}>
              <Button label="C’est parti" accent={accent} onPress={startGame} />
            </View>

            <Txt variant="caption" color={palette.textFaint} style={{ textAlign: 'center', marginTop: spacing.sm }}>
              À consommer avec modération.
            </Txt>
          </View>
        ) : (
          <View style={styles.center}>
            <Animated.View key={card} entering={FadeIn.duration(240)} style={[styles.card, { borderColor: accent }]}>
              <Txt variant="title" style={styles.cardText}>
                {card}
              </Txt>
            </Animated.View>
            <View style={styles.actions}>
              <Button label="Suivant →" accent={accent} onPress={draw} />
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
  modes: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  actions: { alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.md },
  card: {
    alignSelf: 'stretch',
    minHeight: 240,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    backgroundColor: palette.surface,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { textAlign: 'center', fontSize: 24, lineHeight: 32 },
});

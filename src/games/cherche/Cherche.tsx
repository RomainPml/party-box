import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Gate } from '@/components/game/Gate';
import { PassPhone } from '@/components/game/PassPhone';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import type { GameMeta } from '@/data/games';
import { pickWord, type WordCategory } from '@/data/words';
import { tap } from '@/lib/haptics';
import { useGameStore } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

type Phase = 'intro' | 'handoff' | 'card' | 'playing';

export function Cherche({ game }: { game: GameMeta }) {
  const players = useGameStore((s) => s.players);
  const accent = palette[game.accent];

  const [phase, setPhase] = useState<Phase>('intro');
  const [roundIndex, setRoundIndex] = useState(0);
  const [category, setCategory] = useState<WordCategory | null>(null);
  const [word, setWord] = useState('');

  if (players.length < game.minPlayers) {
    return (
      <Screen title={game.title} showBack glowColor={accent}>
        <Gate emoji={game.emoji} minPlayers={game.minPlayers} current={players.length} accent={accent} />
      </Screen>
    );
  }

  const answerer = players[roundIndex % players.length];

  const deal = () => {
    const picked = pickWord();
    setCategory(picked.category);
    setWord(picked.word);
    setPhase('handoff');
  };

  const nextRound = () => {
    tap('medium');
    setRoundIndex((i) => i + 1);
    deal();
  };

  return (
    <Screen title={game.title} showBack glowColor={accent}>
      <View style={styles.container}>
        {phase === 'intro' && (
          <View style={styles.center}>
            <Txt style={styles.emoji}>{game.emoji}</Txt>
            <Txt variant="title" style={{ textAlign: 'center' }}>
              Cherche
            </Txt>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              Une personne voit un mot secret et ne répond que par oui ou non.{'\n'}
              Les autres posent des questions pour le deviner.
            </Txt>
            <View style={styles.actions}>
              <Button label="Commencer" accent={accent} onPress={deal} />
            </View>
          </View>
        )}

        {phase === 'handoff' && answerer && (
          <PassPhone
            name={answerer.name}
            color={answerer.color}
            subtitle="Toi seul(e) vois le mot. Les autres vont te questionner."
            cta="Voir le mot"
            accent={accent}
            onReady={() => {
              tap('light');
              setPhase('card');
            }}
          />
        )}

        {phase === 'card' && (
          <View style={styles.center}>
            <View style={[styles.card, { borderColor: accent }]}>
              <Txt variant="label" color={palette.textMuted}>
                {category?.emoji} {category?.name?.toUpperCase()}
              </Txt>
              <Txt variant="title" style={styles.cardBig} color={accent}>
                {word}
              </Txt>
              <Txt variant="muted" style={{ textAlign: 'center' }}>
                Mémorise-le. Tu ne réponds que par oui / non.
              </Txt>
            </View>
            <View style={styles.actions}>
              <Button label="C’est bon, on joue !" accent={accent} onPress={() => setPhase('playing')} />
            </View>
          </View>
        )}

        {phase === 'playing' && answerer && (
          <View style={styles.center}>
            <Txt style={styles.emoji}>❓</Txt>
            <Txt variant="title" style={{ textAlign: 'center' }}>
              <Txt variant="title" color={answerer.color}>
                {answerer.name}
              </Txt>{' '}
              a son mot
            </Txt>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              Posez des questions à répondre par oui ou non.{'\n'}
              À vous de deviner le mot !
            </Txt>
            <View style={styles.actions}>
              <Button label="Trouvé ! Manche suivante →" accent={accent} onPress={nextRound} />
              <Button
                label="Revoir le mot"
                variant="secondary"
                onPress={() => {
                  tap('light');
                  setPhase('card');
                }}
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emoji: { fontSize: 56 },
  actions: { alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.md },
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
  cardBig: { fontSize: 34, textAlign: 'center' },
});

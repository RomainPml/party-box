import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Gate } from '@/components/game/Gate';
import { PassPhone } from '@/components/game/PassPhone';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import type { GameMeta } from '@/data/games';
import { pickPair } from '@/data/words/pairs';
import { notify, tap } from '@/lib/haptics';
import type { Player } from '@/store/useGameStore';
import { useGameStore } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

type Phase = 'intro' | 'handoff' | 'card' | 'discuss' | 'vote' | 'result';

export function Undercover({ game }: { game: GameMeta }) {
  const players = useGameStore((s) => s.players);
  const accent = palette[game.accent];

  const [phase, setPhase] = useState<Phase>('intro');
  const [major, setMajor] = useState(''); // majority word
  const [minor, setMinor] = useState(''); // undercover word
  const [undercoverId, setUndercoverId] = useState('');
  const [revealIndex, setRevealIndex] = useState(0);
  const [accused, setAccused] = useState<Player | null>(null);

  if (players.length < game.minPlayers) {
    return (
      <Screen title={game.title} showBack glowColor={accent}>
        <Gate emoji={game.emoji} minPlayers={game.minPlayers} current={players.length} accent={accent} />
      </Screen>
    );
  }

  const start = () => {
    const pair = pickPair();
    setMajor(pair.major);
    setMinor(pair.minor);
    setUndercoverId(players[Math.floor(Math.random() * players.length)].id);
    setRevealIndex(0);
    setAccused(null);
    setPhase('handoff');
  };

  const current = players[revealIndex];
  const isUndercover = current?.id === undercoverId;
  const myWord = isUndercover ? minor : major;
  const isLast = revealIndex >= players.length - 1;
  const undercover = players.find((p) => p.id === undercoverId);
  const groupWon = accused?.id === undercoverId;

  return (
    <Screen title={game.title} showBack glowColor={accent}>
      <View style={styles.container}>
        {phase === 'intro' && (
          <View style={styles.center}>
            <Txt style={styles.emoji}>{game.emoji}</Txt>
            <Txt variant="title" style={{ textAlign: 'center' }}>
              Undercover
            </Txt>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              Tout le monde reçoit un mot… mais l’un de vous a un mot légèrement
              différent — et il ne le sait pas.{'\n'}
              Chacun décrit son mot d’un seul mot. Débusquez l’intrus !
            </Txt>
            <View style={styles.actions}>
              <Button label="Distribuer les mots" accent={accent} onPress={start} />
            </View>
          </View>
        )}

        {phase === 'handoff' && current && (
          <PassPhone
            name={current.name}
            color={current.color}
            subtitle="Regarde ton mot sans le montrer aux autres."
            cta="Voir mon mot"
            accent={accent}
            onReady={() => {
              tap('light');
              setPhase('card');
            }}
          />
        )}

        {/* Every card looks identical — the undercover isn't told anything. */}
        {phase === 'card' && current && (
          <View style={styles.center}>
            <View style={[styles.card, { borderColor: accent }]}>
              <Txt variant="muted">Ton mot secret</Txt>
              <Txt variant="title" style={styles.cardBig} color={accent}>
                {myWord}
              </Txt>
              <Txt variant="muted" style={{ textAlign: 'center' }}>
                Prépare un indice… sans le dire trop tôt.
              </Txt>
            </View>
            <View style={styles.actions}>
              <Button
                label={isLast ? 'Lancer le débat →' : 'J’ai vu, cacher →'}
                accent={accent}
                onPress={() => {
                  tap('medium');
                  if (isLast) {
                    setPhase('discuss');
                  } else {
                    setRevealIndex((i) => i + 1);
                    setPhase('handoff');
                  }
                }}
              />
            </View>
          </View>
        )}

        {phase === 'discuss' && (
          <View style={styles.center}>
            <Txt style={styles.emoji}>🗣️</Txt>
            <Txt variant="title" style={{ textAlign: 'center' }}>
              À vous de jouer
            </Txt>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              Chacun son tour, dites UN mot qui décrit votre mot secret.{'\n'}
              Celui dont le mot détonne… c’est peut-être l’undercover.
            </Txt>
            <View style={styles.actions}>
              <Button label="Passer au vote" accent={accent} onPress={() => setPhase('vote')} />
            </View>
          </View>
        )}

        {phase === 'vote' && (
          <View style={styles.playWrap}>
            <View style={[styles.card, { borderColor: accent }]}>
              <Txt variant="title" style={{ textAlign: 'center', fontSize: 24 }}>
                Qui est l’undercover ?
              </Txt>
            </View>
            <View style={styles.grid}>
              {players.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => {
                    notify('warning');
                    setAccused(p);
                    setPhase('result');
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
        )}

        {phase === 'result' && undercover && (
          <View style={styles.center}>
            <Animated.Text entering={ZoomIn.springify().damping(11)} style={styles.emoji}>
              {groupWon ? '🎯' : '🥸'}
            </Animated.Text>
            <Txt variant="title" style={{ textAlign: 'center' }} color={groupWon ? palette.success : palette.red}>
              {groupWon ? 'Undercover démasqué !' : 'L’undercover s’en sort !'}
            </Txt>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              L’undercover était{' '}
              <Txt variant="heading" color={undercover.color}>
                {undercover.name}
              </Txt>
              .
            </Txt>
            <View style={styles.wordsRow}>
              <View style={[styles.wordPill, { borderColor: accent }]}>
                <Txt variant="caption" color={palette.textMuted}>
                  LE GROUPE
                </Txt>
                <Txt variant="heading" color={accent}>
                  {major}
                </Txt>
              </View>
              <View style={[styles.wordPill, { borderColor: palette.red }]}>
                <Txt variant="caption" color={palette.textMuted}>
                  L’UNDERCOVER
                </Txt>
                <Txt variant="heading" color={palette.red}>
                  {minor}
                </Txt>
              </View>
            </View>
            <View style={styles.actions}>
              <Button label="Nouvelle manche" accent={accent} onPress={start} />
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

  wordsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm, alignSelf: 'stretch' },
  wordPill: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
});

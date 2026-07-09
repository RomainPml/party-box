import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Gate } from '@/components/game/Gate';
import { PassPhone } from '@/components/game/PassPhone';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import type { GameMeta } from '@/data/games';
import { CATEGORIES, pickWord, type WordCategory } from '@/data/words';
import { notify, tap } from '@/lib/haptics';
import type { Player } from '@/store/useGameStore';
import { useGameStore } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

type Phase = 'intro' | 'handoff' | 'card' | 'discuss' | 'vote' | 'result';

export function Imposteur({ game }: { game: GameMeta }) {
  const players = useGameStore((s) => s.players);
  const accent = palette[game.accent];

  const [phase, setPhase] = useState<Phase>('intro');
  const [themeId, setThemeId] = useState<string | null>(null); // null = surprise (toutes)
  const [category, setCategory] = useState<WordCategory | null>(null);
  const [word, setWord] = useState('');
  const [impostorId, setImpostorId] = useState<string>('');
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
    const picked = pickWord(themeId ?? undefined);
    setCategory(picked.category);
    setWord(picked.word);
    setImpostorId(players[Math.floor(Math.random() * players.length)].id);
    setRevealIndex(0);
    setAccused(null);
    setPhase('handoff');
  };

  const current = players[revealIndex];
  const isImpostor = current?.id === impostorId;
  const isLast = revealIndex >= players.length - 1;
  const impostor = players.find((p) => p.id === impostorId);
  const groupWon = accused?.id === impostorId;

  return (
    <Screen title={game.title} showBack glowColor={accent}>
      <View style={styles.container}>
        {phase === 'intro' && (
          <ScrollView
            contentContainerStyle={styles.introScroll}
            showsVerticalScrollIndicator={false}
          >
            <Txt style={styles.emoji}>{game.emoji}</Txt>
            <Txt variant="title" style={{ textAlign: 'center' }}>
              Imposteur
            </Txt>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              Tout le monde reçoit le même mot secret… sauf l’imposteur.{'\n'}
              À tour de rôle, donnez un indice lié au mot. Démasquez l’intrus !
            </Txt>

            <Txt variant="label" style={styles.themeLabel}>
              THÈME
            </Txt>
            <View style={styles.grid}>
              <ThemeChip
                emoji="🎲"
                label="Surprise"
                selected={themeId === null}
                accent={accent}
                onPress={() => {
                  tap('light');
                  setThemeId(null);
                }}
              />
              {CATEGORIES.map((c) => (
                <ThemeChip
                  key={c.id}
                  emoji={c.emoji}
                  label={c.name}
                  selected={themeId === c.id}
                  accent={accent}
                  onPress={() => {
                    tap('light');
                    setThemeId(c.id);
                  }}
                />
              ))}
            </View>

            <View style={styles.actions}>
              <Button label="Distribuer les rôles" accent={accent} onPress={start} />
            </View>
          </ScrollView>
        )}

        {phase === 'handoff' && current && (
          <PassPhone
            name={current.name}
            color={current.color}
            subtitle="Regarde ton rôle sans le montrer aux autres."
            cta="Voir mon rôle"
            accent={accent}
            onReady={() => {
              tap('light');
              setPhase('card');
            }}
          />
        )}

        {phase === 'card' && current && (
          <View style={styles.center}>
            <View
              style={[
                styles.card,
                { borderColor: isImpostor ? palette.red : accent },
              ]}
            >
              <Txt variant="label" color={palette.textMuted}>
                CATÉGORIE · {category?.emoji} {category?.name}
              </Txt>
              {isImpostor ? (
                <>
                  <Txt variant="display" style={styles.cardBig} color={palette.red}>
                    🤫
                  </Txt>
                  <Txt variant="title" color={palette.red} style={{ textAlign: 'center' }}>
                    Tu es l’imposteur
                  </Txt>
                  <Txt variant="muted" style={{ textAlign: 'center' }}>
                    Fais semblant de connaître le mot. Ne te fais pas griller.
                  </Txt>
                </>
              ) : (
                <>
                  <Txt variant="muted">Le mot secret est</Txt>
                  <Txt variant="title" style={styles.cardBig} color={accent}>
                    {word}
                  </Txt>
                </>
              )}
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
              Chacun son tour, donnez un mot lié au mot secret.{'\n'}
              Repérez celui qui bluffe… puis votez.
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
                Qui est l’imposteur ?
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

        {phase === 'result' && impostor && (
          <View style={styles.center}>
            <Animated.Text entering={ZoomIn.springify().damping(11)} style={styles.emoji}>
              {groupWon ? '🎯' : '🕵️'}
            </Animated.Text>
            <Txt variant="title" style={{ textAlign: 'center' }} color={groupWon ? palette.success : palette.red}>
              {groupWon ? 'Imposteur démasqué !' : 'L’imposteur s’en sort !'}
            </Txt>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              L’imposteur était{' '}
              <Txt variant="heading" color={impostor.color}>
                {impostor.name}
              </Txt>
              .{'\n'}Le mot secret était{' '}
              <Txt variant="heading" color={accent}>
                {word}
              </Txt>
              .
            </Txt>
            <View style={styles.actions}>
              <Button label="Nouvelle manche" accent={accent} onPress={start} />
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}

function ThemeChip({
  emoji,
  label,
  selected,
  accent,
  onPress,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  accent: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.themeChip,
        { borderColor: selected ? accent : palette.border },
        selected && { backgroundColor: accent + '1F' },
        pressed && { opacity: 0.8 },
      ]}
    >
      <Txt style={{ fontSize: 15 }}>{emoji}</Txt>
      <Txt variant="label" color={selected ? palette.text : palette.textMuted}>
        {label}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, maxWidth: 560, width: '100%', alignSelf: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emoji: { fontSize: 56 },
  actions: { alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.md },

  introScroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  themeLabel: { marginTop: spacing.sm, letterSpacing: 1.5 },
  themeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: palette.surface,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },

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
});

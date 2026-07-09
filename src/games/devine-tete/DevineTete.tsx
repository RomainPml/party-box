import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Gate } from '@/components/game/Gate';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import { CATEGORIES, pickWord } from '@/data/words';
import { pickSilly } from '@/data/words/tamere';
import type { GameMeta } from '@/data/games';
import { useTilt } from '@/games/_engine/useTilt';
import { notify, tap } from '@/lib/haptics';
import { useGameStore } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

type Phase = 'setup' | 'countdown' | 'play' | 'result';
type Result = { text: string; found: boolean };

const DURATIONS = [30, 60, 90];

const THEMES = [
  { id: 'tamere', label: 'Ta mère en slip', emoji: '🩲' },
  { id: 'surprise', label: 'Surprise', emoji: '🎲' },
  ...CATEGORIES.map((c) => ({ id: c.id, label: c.name, emoji: c.emoji })),
];

export function DevineTete({ game }: { game: GameMeta }) {
  const players = useGameStore((s) => s.players);
  const accent = palette[game.accent];

  const [phase, setPhase] = useState<Phase>('setup');
  const [themeId, setThemeId] = useState('tamere');
  const [duration, setDuration] = useState(60);
  const [count, setCount] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [current, setCurrent] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [flash, setFlash] = useState<'found' | 'pass' | null>(null);

  const nextWord = () => {
    if (themeId === 'tamere') return pickSilly();
    if (themeId === 'surprise') return pickWord().word;
    return pickWord(themeId).word;
  };

  const startGame = () => {
    setResults([]);
    setTimeLeft(duration);
    setCount(3);
    setPhase('countdown');
  };

  const advance = (found: boolean) => {
    setFlash(found ? 'found' : 'pass');
    if (found) notify('success');
    else tap('light');
    setResults((r) => [...r, { text: current, found }]);
    setCurrent(nextWord());
  };

  useTilt(
    phase === 'play',
    () => advance(true),
    () => advance(false),
  );

  // Countdown 3 → 2 → 1 → GO
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (count <= 0) {
      setCurrent(nextWord());
      setPhase('play');
      return;
    }
    const id = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, count]);

  // Round timer
  useEffect(() => {
    if (phase !== 'play') return;
    if (timeLeft <= 0) {
      setPhase('result');
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft]);

  // Flash reset
  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(null), 220);
    return () => clearTimeout(id);
  }, [flash]);

  if (players.length < game.minPlayers) {
    return (
      <Screen title={game.title} showBack glowColor={accent}>
        <Gate emoji={game.emoji} minPlayers={game.minPlayers} current={players.length} accent={accent} />
      </Screen>
    );
  }

  // ---- Immersive full-screen phases (countdown + play) ----
  if (phase === 'countdown') {
    return (
      <View style={[styles.full, { backgroundColor: palette.bg }]}>
        <Txt variant="display" style={styles.countNumber} color={accent}>
          {count > 0 ? count : 'GO'}
        </Txt>
        <Txt variant="muted">Pose le téléphone sur ton front 📱</Txt>
      </View>
    );
  }

  if (phase === 'play') {
    const bg =
      flash === 'found' ? palette.success : flash === 'pass' ? palette.amber : palette.bgElevated;
    return (
      <View style={[styles.full, { backgroundColor: bg }]}>
        {/* Tap zones: top = passer, bottom = trouvé */}
        <Pressable style={styles.zone} onPress={() => advance(false)}>
          <Txt variant="label" color={palette.text} style={styles.zoneLabel}>
            ⬆︎ PASSER
          </Txt>
        </Pressable>

        <View style={styles.playCenter} pointerEvents="none">
          <Txt variant="caption" color={palette.text}>
            {timeLeft}s
          </Txt>
          <Txt variant="display" style={styles.prompt} color={palette.white}>
            {flash === 'found' ? 'TROUVÉ !' : flash === 'pass' ? 'PASSÉ' : current}
          </Txt>
        </View>

        <Pressable style={styles.zone} onPress={() => advance(true)}>
          <Txt variant="label" color={palette.text} style={styles.zoneLabel}>
            TROUVÉ ⬇︎
          </Txt>
        </Pressable>
      </View>
    );
  }

  // ---- Setup + Result (framed) ----
  const foundCount = results.filter((r) => r.found).length;

  return (
    <Screen title={game.title} showBack glowColor={accent}>
      {phase === 'setup' && (
        <ScrollView contentContainerStyle={styles.setupScroll} showsVerticalScrollIndicator={false}>
          <Txt style={styles.emoji}>{game.emoji}</Txt>
          <Txt variant="title" style={{ textAlign: 'center' }}>
            Devine-tête
          </Txt>
          <Txt variant="muted" style={{ textAlign: 'center' }}>
            Pose le téléphone sur ton front. Les autres te font deviner le mot.{'\n'}
            Incline vers le bas = trouvé, vers le haut = passe (ou touche l’écran).
          </Txt>

          <Txt variant="label" style={styles.sectionLabel}>
            THÈME
          </Txt>
          <View style={styles.grid}>
            {THEMES.map((t) => (
              <Chip
                key={t.id}
                emoji={t.emoji}
                label={t.label}
                selected={themeId === t.id}
                accent={accent}
                onPress={() => {
                  tap('light');
                  setThemeId(t.id);
                }}
              />
            ))}
          </View>

          <Txt variant="label" style={styles.sectionLabel}>
            DURÉE
          </Txt>
          <View style={styles.grid}>
            {DURATIONS.map((d) => (
              <Chip
                key={d}
                emoji="⏱️"
                label={`${d}s`}
                selected={duration === d}
                accent={accent}
                onPress={() => {
                  tap('light');
                  setDuration(d);
                }}
              />
            ))}
          </View>

          <View style={styles.actions}>
            <Button label="Commencer" accent={accent} onPress={startGame} />
          </View>
        </ScrollView>
      )}

      {phase === 'result' && (
        <View style={styles.container}>
          <View style={styles.center}>
            <Txt style={styles.emoji}>🏆</Txt>
            <Txt variant="display" color={accent} style={{ textAlign: 'center' }}>
              {foundCount}
            </Txt>
            <Txt variant="title" style={{ textAlign: 'center' }}>
              {foundCount > 1 ? 'trouvés !' : 'trouvé !'}
            </Txt>
          </View>

          <ScrollView style={styles.recap} contentContainerStyle={{ gap: spacing.sm }}>
            {results.map((r, i) => (
              <View key={i} style={styles.recapRow}>
                <Txt style={{ fontSize: 16 }}>{r.found ? '✅' : '⏭️'}</Txt>
                <Txt variant="body" style={{ flex: 1 }} color={r.found ? palette.text : palette.textMuted}>
                  {r.text}
                </Txt>
              </View>
            ))}
          </ScrollView>

          <View style={styles.actions}>
            <Button label="Rejouer" accent={accent} onPress={startGame} />
            <Button label="Changer de thème" variant="secondary" onPress={() => setPhase('setup')} />
          </View>
        </View>
      )}
    </Screen>
  );
}

function Chip({
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
        styles.chip,
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
  center: { alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.lg },
  emoji: { fontSize: 56 },
  actions: { alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.md },

  setupScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  sectionLabel: { marginTop: spacing.md, letterSpacing: 1.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: palette.surface,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },

  full: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  countNumber: { fontSize: 96, marginBottom: spacing.md },
  zone: { flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  zoneLabel: { opacity: 0.5, letterSpacing: 2 },
  playCenter: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.xl },
  prompt: { fontSize: 40, textAlign: 'center', lineHeight: 46 },

  recap: { alignSelf: 'stretch', maxHeight: 260, marginTop: spacing.sm },
  recapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
  },
});

import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Gate } from '@/components/game/Gate';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import { BOMBE_THEMES } from '@/data/bombe';
import type { GameMeta } from '@/data/games';
import { useDeck } from '@/games/_engine/deck';
import { notify, tap } from '@/lib/haptics';
import { useGameStore } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

type Phase = 'intro' | 'playing' | 'boom';

// Hidden fuse length. Random each round so nobody can count it down.
const MIN_MS = 12_000;
const MAX_MS = 32_000;

export function Bombe({ game }: { game: GameMeta }) {
  const players = useGameStore((s) => s.players);
  const accent = palette[game.accent];
  const deck = useDeck(BOMBE_THEMES);

  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState(0); // bumping re-arms the fuse

  // Bomb wobble — constant speed so it never betrays the remaining time.
  const wobble = useSharedValue(0);
  useEffect(() => {
    wobble.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 140, easing: Easing.inOut(Easing.ease) }),
        withTiming(-1, { duration: 140, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [wobble]);
  const bombStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wobble.value * 8}deg` }, { scale: 1 + Math.abs(wobble.value) * 0.05 }],
  }));

  // The fuse: a hidden timer with accelerating tick haptics until it blows.
  useEffect(() => {
    if (phase !== 'playing') return;
    const duration = MIN_MS + Math.random() * (MAX_MS - MIN_MS);
    const startedAt = Date.now();
    let lastTick = startedAt;
    const id = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startedAt;
      if (elapsed >= duration) {
        clearInterval(id);
        notify('error');
        tap('heavy');
        setPhase('boom');
        return;
      }
      // Ticks speed up from ~900ms apart down to ~130ms as the fuse burns.
      const cadence = 900 - (elapsed / duration) * 770;
      if (now - lastTick >= cadence) {
        lastTick = now;
        tap('light');
      }
    }, 80);
    return () => clearInterval(id);
  }, [phase, round]);

  if (players.length < game.minPlayers) {
    return (
      <Screen title={game.title} showBack glowColor={accent}>
        <Gate emoji={game.emoji} minPlayers={game.minPlayers} current={players.length} accent={accent} />
      </Screen>
    );
  }

  const startRound = (advanceTheme: boolean) => {
    tap('medium');
    if (advanceTheme) deck.next();
    setRound((r) => r + 1);
    setPhase('playing');
  };

  return (
    <Screen title={game.title} showBack glowColor={accent}>
      <View style={styles.container}>
        {phase === 'intro' && (
          <View style={styles.center}>
            <Txt style={styles.emoji}>{game.emoji}</Txt>
            <Txt variant="title" style={{ textAlign: 'center' }}>
              La Bombe
            </Txt>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              Un thème s’affiche. Chacun son tour, dis un mot qui colle et passe
              vite le téléphone.{'\n'}
              Celui qui l’a en main quand ça explose… a perdu ! 💥
            </Txt>
            <View style={styles.actions}>
              <Button label="Allumer la mèche 🔥" accent={accent} onPress={() => startRound(false)} />
            </View>
          </View>
        )}

        {phase === 'playing' && (
          <View style={styles.center}>
            <Txt variant="label" color={palette.textMuted}>
              CITE…
            </Txt>
            <View style={[styles.themeCard, { borderColor: accent }]}>
              <Txt style={styles.themeEmoji}>{deck.current?.emoji}</Txt>
              <Txt variant="title" style={styles.themeLabel}>
                {deck.current?.label}
              </Txt>
            </View>
            <Animated.Text style={[styles.bomb, bombStyle]}>💣</Animated.Text>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              Dis un mot… puis passe, vite ! ⏱️
            </Txt>
          </View>
        )}

        {phase === 'boom' && (
          <View style={styles.center}>
            <Txt style={styles.boomEmoji}>💥</Txt>
            <Txt variant="display" color={palette.red} style={{ textAlign: 'center', fontSize: 44 }}>
              BOOM !
            </Txt>
            <Txt variant="muted" style={{ textAlign: 'center' }}>
              La bombe a explosé dans les mains du dernier joueur.{'\n'}
              Il trinque 🍻 (ou relève un gage).
            </Txt>
            <View style={styles.actions}>
              <Button label="Nouvelle manche 💣" accent={accent} onPress={() => startRound(true)} />
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
  themeCard: {
    alignSelf: 'stretch',
    borderRadius: radius.xl,
    borderWidth: 1.5,
    backgroundColor: palette.surface,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  themeEmoji: { fontSize: 48 },
  themeLabel: { textAlign: 'center', fontSize: 28 },
  bomb: { fontSize: 72, marginTop: spacing.sm },
  boomEmoji: { fontSize: 96 },
});

import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { Gate } from '@/components/game/Gate';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import type { GameMeta } from '@/data/games';
import { TIER_THEMES } from '@/data/tierlists';
import { shuffle } from '@/games/_engine/deck';
import { notify, tap } from '@/lib/haptics';
import { useGameStore } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

type Phase = 'setup' | 'play' | 'result';
type Placement = { item: string; tier: number };

// Tier colours are fixed; the labels are editable. `tier` in a Placement is the
// stable index (0..4), so renaming never moves already-placed items.
const TIER_COLORS = [palette.red, palette.amber, palette.lime, palette.cyan, palette.blue];
const DEFAULT_LABELS = ['S', 'A', 'B', 'C', 'D'];

export function TierList({ game }: { game: GameMeta }) {
  const players = useGameStore((s) => s.players);
  const accent = palette[game.accent];

  const [phase, setPhase] = useState<Phase>('setup');
  const [themeId, setThemeId] = useState(TIER_THEMES[0].id);
  const [labels, setLabels] = useState<string[]>([...DEFAULT_LABELS]);
  const [items, setItems] = useState<string[]>([]);
  const [placed, setPlaced] = useState<Placement[]>([]);

  if (players.length < game.minPlayers) {
    return (
      <Screen title={game.title} showBack glowColor={accent}>
        <Gate emoji={game.emoji} minPlayers={game.minPlayers} current={players.length} accent={accent} />
      </Screen>
    );
  }

  const theme = TIER_THEMES.find((t) => t.id === themeId) ?? TIER_THEMES[0];
  const labelOf = (i: number) => labels[i]?.trim() || DEFAULT_LABELS[i];

  const start = () => {
    setItems(shuffle(theme.items));
    setPlaced([]);
    setPhase('play');
  };

  const current = items[placed.length];

  const place = (tier: number) => {
    notify('success');
    const next = [...placed, { item: current, tier }];
    setPlaced(next);
    if (next.length >= items.length) setPhase('result');
  };

  const undo = () => {
    tap('light');
    setPlaced((p) => p.slice(0, -1));
  };

  const itemsIn = (tier: number) => placed.filter((p) => p.tier === tier).map((p) => p.item);

  const TierRows = ({ interactive }: { interactive: boolean }) => (
    <ScrollView contentContainerStyle={styles.tiers} showsVerticalScrollIndicator={false}>
      {TIER_COLORS.map((color, i) => {
        const row = (
          <>
            <View style={[styles.tierBadge, { backgroundColor: color }]}>
              <Txt variant="heading" color={palette.black} style={styles.badgeText} numberOfLines={2}>
                {labelOf(i)}
              </Txt>
            </View>
            <View style={styles.tierItems}>
              {itemsIn(i).map((it) => (
                <View key={it} style={[styles.placedChip, { borderColor: color + '66' }]}>
                  <Txt variant="caption" color={palette.text}>
                    {it}
                  </Txt>
                </View>
              ))}
            </View>
          </>
        );
        return interactive ? (
          <Pressable
            key={i}
            onPress={() => place(i)}
            style={({ pressed }) => [styles.tierRow, pressed && { backgroundColor: color + '22' }]}
          >
            {row}
          </Pressable>
        ) : (
          <View key={i} style={styles.tierRow}>
            {row}
          </View>
        );
      })}
    </ScrollView>
  );

  return (
    <Screen title={game.title} showBack glowColor={accent}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          {phase === 'setup' && (
            <ScrollView contentContainerStyle={styles.setupScroll} showsVerticalScrollIndicator={false}>
              <Txt style={styles.emoji}>{game.emoji}</Txt>
              <Txt variant="title" style={{ textAlign: 'center' }}>
                Tier List
              </Txt>
              <Txt variant="muted" style={{ textAlign: 'center' }}>
                Débattez et rangez chaque élément ensemble, du haut vers le bas.
              </Txt>

              <Txt variant="label" style={styles.section}>
                THÉMATIQUE
              </Txt>
              <View style={styles.grid}>
                {TIER_THEMES.map((t) => (
                  <Chip
                    key={t.id}
                    label={t.name}
                    emoji={t.emoji}
                    selected={themeId === t.id}
                    accent={accent}
                    onPress={() => setThemeId(t.id)}
                  />
                ))}
              </View>

              <Txt variant="label" style={styles.section}>
                NOMS DES TIERS (modifiables)
              </Txt>
              <View style={styles.tierEditor}>
                {TIER_COLORS.map((color, i) => (
                  <View key={i} style={styles.editRow}>
                    <View style={[styles.swatch, { backgroundColor: color }]} />
                    <TextInput
                      value={labels[i]}
                      onChangeText={(v) => setLabels((prev) => prev.map((x, j) => (j === i ? v : x)))}
                      placeholder={DEFAULT_LABELS[i]}
                      placeholderTextColor={palette.textFaint}
                      style={styles.editInput}
                      maxLength={16}
                    />
                  </View>
                ))}
              </View>

              <View style={styles.actions}>
                <Button label="Commencer" accent={accent} onPress={start} />
              </View>
            </ScrollView>
          )}

          {phase === 'play' && current && (
            <View style={styles.playWrap}>
              <View style={styles.playHeader}>
                <Txt variant="label" color={palette.textMuted}>
                  {theme.emoji} {theme.name.toUpperCase()}
                </Txt>
                <Txt variant="label" color={palette.textFaint}>
                  {placed.length + 1}/{items.length}
                </Txt>
              </View>

              <Animated.View key={current} entering={FadeIn.duration(220)} style={[styles.itemCard, { borderColor: accent }]}>
                <Txt variant="caption" color={palette.textMuted}>
                  OÙ LE CLASSER ?
                </Txt>
                <Txt variant="title" style={styles.itemName}>
                  {current}
                </Txt>
              </Animated.View>

              <TierRows interactive />

              {placed.length > 0 && (
                <Pressable onPress={undo} style={styles.undo} hitSlop={8}>
                  <Txt variant="label" color={palette.textMuted}>
                    ↩ Annuler « {placed[placed.length - 1].item} »
                  </Txt>
                </Pressable>
              )}
            </View>
          )}

          {phase === 'result' && (
            <View style={styles.playWrap}>
              <Animated.Text entering={ZoomIn.springify().damping(12)} style={styles.resultEmoji}>
                📊
              </Animated.Text>
              <Txt variant="heading" style={{ textAlign: 'center' }}>
                {theme.emoji} {theme.name}
              </Txt>
              <TierRows interactive={false} />
              <View style={styles.actions}>
                <Button label="Rejouer" accent={accent} onPress={start} />
                <Button label="Nouvelle thématique" variant="secondary" onPress={() => setPhase('setup')} />
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: spacing.lg, maxWidth: 560, width: '100%', alignSelf: 'center' },
  emoji: { fontSize: 56 },
  actions: { alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.md },

  setupScroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  section: { marginTop: spacing.md, letterSpacing: 1.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },

  tierEditor: { alignSelf: 'stretch', gap: spacing.sm, maxWidth: 420, width: '100%' },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  swatch: { width: 28, height: 28, borderRadius: radius.sm },
  editInput: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: palette.text,
    fontSize: 15,
    fontWeight: '600',
  },

  playWrap: { flex: 1, gap: spacing.md, paddingTop: spacing.sm },
  playHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemCard: {
    alignSelf: 'stretch',
    borderRadius: radius.lg,
    borderWidth: 1.5,
    backgroundColor: palette.surface,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: 4,
  },
  itemName: { fontSize: 26, textAlign: 'center' },

  tiers: { gap: spacing.sm, paddingVertical: spacing.xs },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.sm,
    minHeight: 56,
  },
  tierBadge: { width: 78, minHeight: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, paddingVertical: 4 },
  badgeText: { fontSize: 13, textAlign: 'center' },
  tierItems: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  placedChip: {
    backgroundColor: palette.bgElevated,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },

  undo: { alignSelf: 'center', paddingVertical: spacing.sm },
  resultEmoji: { fontSize: 48, textAlign: 'center' },
});

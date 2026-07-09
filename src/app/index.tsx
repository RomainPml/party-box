import { router } from 'expo-router';
import { Pressable, SectionList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GameCard } from '@/components/GameCard';
import { Confetti } from '@/components/ui/Confetti';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import { GAME_CATEGORIES, GAMES, type GameMeta } from '@/data/games';
import { tap } from '@/lib/haptics';
import { useGameStore } from '@/store/useGameStore';
import { gradient, mix, palette, radius, spacing } from '@/theme';

// Group games into menu sections, keeping only non-empty categories.
const SECTIONS = GAME_CATEGORIES.map((c) => ({
  label: c.label,
  emoji: c.emoji,
  data: GAMES.filter((g) => (g.category ?? 'party') === c.id),
})).filter((s) => s.data.length > 0);

export default function MenuScreen() {
  const players = useGameStore((s) => s.players);

  return (
    <Screen glowColor={palette.violet}>
      <SectionList
        sections={SECTIONS}
        keyExtractor={(g) => g.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <Animated.View style={styles.headerBlock} entering={FadeInDown.duration(420)}>
            <Confetti />
            <Txt variant="caption" color={palette.textFaint} style={styles.kicker}>
              JEUX DE SOIRÉE
            </Txt>
            <Txt variant="display" style={styles.wordmark}>
              Party<Txt variant="display" color={palette.violet} style={styles.wordmarkAccent}>Box</Txt>
            </Txt>

            <Pressable
              onPress={() => {
                tap('light');
                router.push('/players');
              }}
              accessibilityRole="button"
              accessibilityLabel={
                players.length === 0
                  ? 'Aucun joueur. Ajouter des participants'
                  : `${players.length} joueurs. Gérer les joueurs`
              }
              style={({ pressed }) => [
                styles.playersBanner,
                gradient(`linear-gradient(120deg, ${mix(palette.surface, palette.violet, 0.2)}, ${palette.surface} 60%)`),
                pressed && { opacity: 0.85 },
              ]}
            >
              <View style={styles.playersLeft}>
                <View style={styles.playersEmojiWrap}>
                  <Txt style={styles.playersEmoji}>👥</Txt>
                </View>
                <View>
                  <Txt variant="heading" style={{ fontSize: 16 }}>
                    {players.length === 0
                      ? 'Aucun joueur'
                      : `${players.length} joueur${players.length > 1 ? 's' : ''}`}
                  </Txt>
                  <Txt variant="muted">
                    {players.length === 0 ? 'Ajoute les participants' : 'Gérer les joueurs'}
                  </Txt>
                </View>
              </View>
              <Txt variant="heading" color={palette.textMuted}>
                ›
              </Txt>
            </Pressable>
          </Animated.View>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Txt variant="label" color={palette.textMuted} style={styles.sectionLabel}>
              {section.emoji}  {section.label.toUpperCase()}
            </Txt>
          </View>
        )}
        renderItem={({ item, index }: { item: GameMeta; index: number }) => (
          <Animated.View entering={FadeInDown.delay(40 + index * 40).duration(360)} style={styles.itemWrap}>
            <GameCard game={item} onPress={() => router.push(`/game/${item.id}`)} />
          </Animated.View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  headerBlock: { marginBottom: spacing.sm },
  kicker: { letterSpacing: 2, marginBottom: spacing.xs },
  wordmark: {
    marginBottom: spacing.xl,
    // Soft violet neon halo around the wordmark.
    textShadowColor: palette.violet + '80',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 22,
  },
  // Stronger, tighter glow on the accented "Box".
  wordmarkAccent: {
    textShadowColor: palette.violet,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  playersBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
  },
  playersLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  playersEmojiWrap: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.bgElevated,
    borderWidth: 1,
    borderColor: palette.violet + '44',
  },
  playersEmoji: { fontSize: 24 },
  sectionHeader: { marginTop: spacing.xl, marginBottom: spacing.md },
  sectionLabel: { letterSpacing: 1.5 },
  itemWrap: { marginBottom: spacing.md },
});

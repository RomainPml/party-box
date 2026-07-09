import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import { getGame } from '@/data/games';
import { router } from 'expo-router';
import { GAME_COMPONENTS } from '@/games/registry';
import { RulesScreen } from '@/games/rules/RulesScreen';
import { useGameStore } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const game = getGame(id);
  const players = useGameStore((s) => s.players);

  if (!game) {
    return (
      <Screen title="Introuvable" showBack>
        <View style={styles.center}>
          <Txt variant="muted">Ce jeu n'existe pas.</Txt>
        </View>
      </Screen>
    );
  }

  // Rules games just display prerequisites + how to play.
  if (game.type === 'rules') {
    return <RulesScreen game={game} />;
  }

  // Built games render their own component; others fall back to the placeholder.
  const GameComponent = GAME_COMPONENTS[game.id];
  if (GameComponent) {
    return <GameComponent game={game} />;
  }

  const accent = palette[game.accent];
  const enoughPlayers = players.length >= game.minPlayers;

  return (
    <Screen title={game.title} showBack glowColor={accent}>
      <View style={styles.center}>
        <View style={[styles.badge, { backgroundColor: accent + '22', borderColor: accent + '55' }]}>
          <Txt style={{ fontSize: 56 }}>{game.emoji}</Txt>
        </View>
        <Txt variant="title" style={{ textAlign: 'center' }}>
          {game.title}
        </Txt>
        <Txt variant="muted" style={{ textAlign: 'center' }}>
          {game.tagline}
        </Txt>

        <View style={styles.pill}>
          <Txt variant="label" color={accent}>
            EN CONSTRUCTION
          </Txt>
        </View>

        {!enoughPlayers && (
          <Txt variant="muted" style={{ textAlign: 'center', marginTop: spacing.sm }}>
            Ce jeu se joue à {game.minPlayers} joueurs minimum
            {'\n'}(actuellement {players.length}).
          </Txt>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          label={enoughPlayers ? 'Gérer les joueurs' : 'Ajouter des joueurs'}
          variant="secondary"
          onPress={() => router.push('/players')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  badge: {
    width: 120,
    height: 120,
    borderRadius: radius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  pill: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  footer: { padding: spacing.lg, maxWidth: 640, width: '100%', alignSelf: 'center' },
});

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Txt } from '@/components/ui/Txt';
import { spacing } from '@/theme';

/** Shown when there aren't enough players to start a game. */
export function Gate({
  emoji,
  minPlayers,
  current,
  accent,
}: {
  emoji: string;
  minPlayers: number;
  current: number;
  accent: string;
}) {
  return (
    <View style={styles.wrap}>
      <Txt style={styles.emoji}>{emoji}</Txt>
      <Txt variant="title" style={{ textAlign: 'center' }}>
        Il manque du monde
      </Txt>
      <Txt variant="muted" style={{ textAlign: 'center' }}>
        Ce jeu se joue à {minPlayers} joueurs minimum.{'\n'}
        Tu en as {current} pour l’instant.
      </Txt>
      <View style={styles.btn}>
        <Button label="Ajouter des joueurs" accent={accent} onPress={() => router.push('/players')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  emoji: { fontSize: 56 },
  btn: { alignSelf: 'center', marginTop: spacing.lg, maxWidth: 420, width: '100%' },
});

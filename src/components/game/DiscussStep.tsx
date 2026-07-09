import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Txt } from '@/components/ui/Txt';
import { spacing } from '@/theme';

/**
 * Shared "everyone gives a clue, then vote" bridge screen used by the
 * secret-word games between the reveal loop and the vote.
 */
export function DiscussStep({
  emoji = '🗣️',
  title,
  description,
  cta,
  accent,
  onNext,
}: {
  emoji?: string;
  title: string;
  description: string;
  cta: string;
  accent: string;
  onNext: () => void;
}) {
  return (
    <View style={styles.center}>
      <Txt style={styles.emoji}>{emoji}</Txt>
      <Txt variant="title" style={{ textAlign: 'center' }}>
        {title}
      </Txt>
      <Txt variant="muted" style={{ textAlign: 'center' }}>
        {description}
      </Txt>
      <View style={styles.actions}>
        <Button label={cta} accent={accent} onPress={onNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emoji: { fontSize: 56 },
  actions: { alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.md },
});

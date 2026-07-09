import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Txt } from '@/components/ui/Txt';
import { palette, spacing } from '@/theme';

/** Neutral hand-off screen so the previous player's secret card isn't seen. */
export function PassPhone({
  name,
  color,
  subtitle,
  cta,
  accent,
  onReady,
}: {
  name: string;
  color: string;
  subtitle: string;
  cta: string;
  accent: string;
  onReady: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Txt style={styles.emoji}>📲</Txt>
      <Txt variant="label" color={palette.textMuted}>
        PASSE LE TÉLÉPHONE À
      </Txt>
      <Txt variant="display" color={color} style={styles.name} numberOfLines={1}>
        {name}
      </Txt>
      <Txt variant="muted" style={{ textAlign: 'center' }}>
        {subtitle}
      </Txt>
      <View style={styles.actions}>
        <Button label={cta} accent={accent} onPress={onReady} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  emoji: { fontSize: 52 },
  name: { textAlign: 'center', fontSize: 40 },
  actions: { alignSelf: 'center', gap: spacing.md, marginTop: spacing.lg, maxWidth: 420, width: '100%' },
});

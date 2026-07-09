import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import type { GameMeta } from '@/data/games';
import { RULES } from '@/data/rules';
import { palette, radius, spacing } from '@/theme';

type Mode = 'alcool' | 'classique';

const REPLACEMENTS: Record<Mode, Record<string, string>> = {
  alcool: { P: 'une gorgée', gorgées: 'gorgées' },
  classique: { P: 'un gage', gorgées: 'défis' },
};

function fill(text: string, mode: Mode): string {
  const r = REPLACEMENTS[mode];
  return text.replace(/\{(P|gorgées)\}/g, (_m, k: string) => r[k] ?? _m);
}

export function RulesScreen({ game }: { game: GameMeta }) {
  const accent = palette[game.accent];
  const rules = RULES[game.id];
  const [mode, setMode] = useState<Mode>('alcool');

  if (!rules) {
    return (
      <Screen title={game.title} showBack glowColor={accent}>
        <View style={styles.center}>
          <Txt variant="muted">Règles indisponibles.</Txt>
        </View>
      </Screen>
    );
  }

  return (
    <Screen title={game.title} showBack glowColor={accent}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Txt style={styles.emoji}>{game.emoji}</Txt>
          <Txt variant="title" style={{ textAlign: 'center' }}>
            {game.title}
          </Txt>
          <Txt variant="muted" style={{ textAlign: 'center' }}>
            {game.tagline}
          </Txt>
        </View>

        {/* Alcohol / no-alcohol version */}
        <View style={styles.modes}>
          <Chip label="Version alcool" emoji="🍺" selected={mode === 'alcool'} accent={accent} onPress={() => setMode('alcool')} />
          <Chip label="Sans alcool" emoji="🎯" selected={mode === 'classique'} accent={accent} onPress={() => setMode('classique')} />
        </View>

        {/* Prerequisites */}
        <View style={[styles.card, { borderColor: accent + '55' }]}>
          <Txt variant="label" color={accent}>
            PRÉREQUIS
          </Txt>
          <View style={styles.reqRow}>
            <Txt style={styles.reqEmoji}>👥</Txt>
            <Txt variant="body" style={{ flex: 1 }}>
              {rules.players}
            </Txt>
          </View>
          {rules.material.map((m, i) => (
            <View key={i} style={styles.reqRow}>
              <Txt style={styles.reqEmoji}>•</Txt>
              <Txt variant="body" style={{ flex: 1 }}>
                {fill(m, mode)}
              </Txt>
            </View>
          ))}
        </View>

        {/* Sections */}
        {rules.sections.map((s, i) => (
          <View key={i} style={styles.section}>
            <Txt variant="heading" color={accent} style={styles.sectionHeading}>
              {s.heading}
            </Txt>
            {s.lines.map((l, j) => (
              <View key={j} style={styles.line}>
                <View style={[styles.bullet, { backgroundColor: accent }]} />
                <Txt variant="body" style={{ flex: 1, lineHeight: 22 }}>
                  {fill(l, mode)}
                </Txt>
              </View>
            ))}
          </View>
        ))}

        {/* Optional card→effect table */}
        {rules.table && (
          <View style={styles.section}>
            <Txt variant="heading" color={accent} style={styles.sectionHeading}>
              {fill(rules.table.title, mode)}
            </Txt>
            <View style={[styles.table, { borderColor: palette.border }]}>
              {rules.table.rows.map((row, i) => (
                <View
                  key={i}
                  style={[styles.tableRow, i % 2 === 1 && { backgroundColor: palette.bgElevated }]}
                >
                  <View style={[styles.tableCard, { backgroundColor: accent + '22', borderColor: accent + '55' }]}>
                    <Txt variant="label" color={palette.text}>
                      {row.card}
                    </Txt>
                  </View>
                  <Txt variant="muted" style={{ flex: 1, color: palette.text }}>
                    {fill(row.effect, mode)}
                  </Txt>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl, maxWidth: 620, width: '100%', alignSelf: 'center', gap: spacing.md },
  hero: { alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  emoji: { fontSize: 52 },
  modes: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },

  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reqEmoji: { fontSize: 16, width: 20, textAlign: 'center', color: palette.textMuted },

  section: { gap: spacing.sm, marginTop: spacing.sm },
  sectionHeading: { fontSize: 18 },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },

  table: { borderRadius: radius.md, borderWidth: 1, overflow: 'hidden' },
  tableRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  tableCard: {
    minWidth: 44,
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
});

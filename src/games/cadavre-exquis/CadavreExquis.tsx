import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Gate } from '@/components/game/Gate';
import { PassPhone } from '@/components/game/PassPhone';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import type { GameMeta } from '@/data/games';
import { STORY_STARTERS } from '@/data/stories';
import { shuffle } from '@/games/_engine/deck';
import { tap } from '@/lib/haptics';
import { useGameStore } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

type Phase = 'intro' | 'handoff' | 'writing' | 'reveal';

const pickStarter = () => shuffle(STORY_STARTERS)[0] ?? STORY_STARTERS[0];

export function CadavreExquis({ game }: { game: GameMeta }) {
  const players = useGameStore((s) => s.players);
  const accent = palette[game.accent];

  const [phase, setPhase] = useState<Phase>('intro');
  const [tours, setTours] = useState(2);
  const [seed, setSeed] = useState('');
  const [lines, setLines] = useState<string[]>([]); // player contributions
  const [text, setText] = useState('');

  if (players.length < game.minPlayers) {
    return (
      <Screen title={game.title} showBack glowColor={accent}>
        <Gate emoji={game.emoji} minPlayers={game.minPlayers} current={players.length} accent={accent} />
      </Screen>
    );
  }

  const total = players.length * tours;
  // Writer for contribution N is the Nth player round-robin.
  const writer = players[lines.length % players.length];
  const prevLine = lines.length ? lines[lines.length - 1] : seed;

  const begin = () => {
    tap('medium');
    setSeed(pickStarter());
    setLines([]);
    setText('');
    setPhase('handoff');
  };

  const validate = () => {
    const t = text.trim();
    if (!t) return;
    const next = [...lines, t];
    tap('medium');
    setLines(next);
    setText('');
    setPhase(next.length >= total ? 'reveal' : 'handoff');
  };

  return (
    <Screen title={game.title} showBack glowColor={accent}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          {phase === 'intro' && (
            <View style={styles.center}>
              <Txt style={styles.emoji}>{game.emoji}</Txt>
              <Txt variant="title" style={{ textAlign: 'center' }}>
                Cadavre Exquis
              </Txt>
              <Txt variant="muted" style={{ textAlign: 'center' }}>
                On écrit une histoire à plusieurs… mais chacun ne voit que la
                phrase précédente. À la fin, on révèle le résultat délirant. 📝
              </Txt>
              <View style={styles.modes}>
                <Chip label="1 tour" emoji="⚡" selected={tours === 1} accent={accent} onPress={() => setTours(1)} />
                <Chip label="2 tours" emoji="📖" selected={tours === 2} accent={accent} onPress={() => setTours(2)} />
              </View>
              <View style={styles.actions}>
                <Button label="Commencer l’histoire" accent={accent} onPress={begin} />
              </View>
            </View>
          )}

          {phase === 'handoff' && writer && (
            <PassPhone
              name={writer.name}
              color={writer.color}
              subtitle={`Écris la suite en secret · phrase ${lines.length + 1} / ${total}`}
              cta="À moi d’écrire"
              accent={accent}
              onReady={() => {
                tap('light');
                setPhase('writing');
              }}
            />
          )}

          {phase === 'writing' && writer && (
            <ScrollView contentContainerStyle={styles.writeScroll} keyboardShouldPersistTaps="handled">
              <Txt variant="label" color={palette.textMuted} style={{ textAlign: 'center' }}>
                {lines.length === 0 ? 'L’HISTOIRE COMMENCE PAR' : 'LA PHRASE PRÉCÉDENTE'}
              </Txt>
              <View style={[styles.prevCard, { borderColor: accent }]}>
                <Txt variant="heading" style={styles.prevText}>
                  {prevLine}
                </Txt>
              </View>
              <Txt variant="muted" style={{ textAlign: 'center' }}>
                À toi, <Txt variant="heading" color={writer.color}>{writer.name}</Txt> — ajoute UNE phrase.
              </Txt>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="… et soudain,"
                placeholderTextColor={palette.textFaint}
                style={styles.input}
                multiline
                autoFocus
                maxLength={140}
                returnKeyType="done"
                onSubmitEditing={validate}
              />
              <View style={styles.actions}>
                <Button label={lines.length + 1 >= total ? 'Révéler l’histoire →' : 'Valider →'} accent={accent} disabled={!text.trim()} onPress={validate} />
              </View>
            </ScrollView>
          )}

          {phase === 'reveal' && (
            <ScrollView contentContainerStyle={styles.revealScroll} showsVerticalScrollIndicator={false}>
              <Txt style={styles.emoji}>📜</Txt>
              <Txt variant="title" style={{ textAlign: 'center' }}>
                Votre chef-d’œuvre
              </Txt>
              <View style={[styles.storyCard, { borderColor: accent }]}>
                <Txt variant="body" style={styles.storyText}>
                  {[seed, ...lines].join(' ')}
                </Txt>
              </View>
              <View style={styles.actions}>
                <Button label="Nouvelle histoire" accent={accent} onPress={begin} />
              </View>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: spacing.lg, maxWidth: 560, width: '100%', alignSelf: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emoji: { fontSize: 56 },
  modes: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  actions: { alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.md },

  writeScroll: { flexGrow: 1, justifyContent: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  prevCard: {
    alignSelf: 'stretch',
    borderRadius: radius.xl,
    borderWidth: 1.5,
    backgroundColor: palette.surface,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevText: { textAlign: 'center', fontSize: 20, lineHeight: 28 },
  input: {
    alignSelf: 'stretch',
    minHeight: 90,
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: palette.text,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlignVertical: 'top',
  },

  revealScroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  storyCard: {
    alignSelf: 'stretch',
    borderRadius: radius.xl,
    borderWidth: 1.5,
    backgroundColor: palette.surface,
    padding: spacing.xl,
  },
  storyText: { fontSize: 18, lineHeight: 28 },
});

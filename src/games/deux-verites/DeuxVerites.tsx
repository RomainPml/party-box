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
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Gate } from '@/components/game/Gate';
import { PassPhone } from '@/components/game/PassPhone';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import type { GameMeta } from '@/data/games';
import { shuffle } from '@/games/_engine/deck';
import { notify, tap } from '@/lib/haptics';
import { useGameStore } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

type Phase = 'intro' | 'pass-in' | 'input' | 'pass-out' | 'guess' | 'result';
type Card = { text: string; lie: boolean };

export function DeuxVerites({ game }: { game: GameMeta }) {
  const players = useGameStore((s) => s.players);
  const accent = palette[game.accent];

  const [phase, setPhase] = useState<Phase>('intro');
  const [roundIndex, setRoundIndex] = useState(0);
  const [texts, setTexts] = useState(['', '', '']);
  const [lieIndex, setLieIndex] = useState<number | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [guess, setGuess] = useState<number | null>(null);

  if (players.length < game.minPlayers) {
    return (
      <Screen title={game.title} showBack glowColor={accent}>
        <Gate emoji={game.emoji} minPlayers={game.minPlayers} current={players.length} accent={accent} />
      </Screen>
    );
  }

  const current = players[roundIndex % players.length];
  const canSubmit = texts.every((t) => t.trim().length > 0) && lieIndex !== null;

  const beginRound = () => {
    setTexts(['', '', '']);
    setLieIndex(null);
    setCards([]);
    setGuess(null);
    setPhase('pass-in');
  };

  const submitStatements = () => {
    const built = shuffle(texts.map((t, i) => ({ text: t.trim(), lie: i === lieIndex })));
    setCards(built);
    setPhase('pass-out');
  };

  const lieCardIndex = cards.findIndex((c) => c.lie);
  const groupWon = guess === lieCardIndex;

  return (
    <Screen title={game.title} showBack glowColor={accent}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {phase === 'intro' && (
            <View style={styles.center}>
              <Txt style={styles.emoji}>{game.emoji}</Txt>
              <Txt variant="title" style={{ textAlign: 'center' }}>
                2 vérités, 1 mensonge
              </Txt>
              <Txt variant="muted" style={{ textAlign: 'center' }}>
                Chacun son tour, écris 2 vérités et 1 mensonge sur toi.{'\n'}
                Le groupe doit repérer l’intox !
              </Txt>
              <View style={styles.actions}>
                <Button label="Commencer" accent={accent} onPress={beginRound} />
              </View>
            </View>
          )}

          {phase === 'pass-in' && current && (
            <PassPhone
              name={current.name}
              color={current.color}
              subtitle="Écris tes affirmations sans les montrer aux autres."
              cta="Écrire mes affirmations"
              accent={accent}
              onReady={() => {
                tap('light');
                setPhase('input');
              }}
            />
          )}

          {phase === 'input' && current && (
            <ScrollView contentContainerStyle={styles.formScroll} showsVerticalScrollIndicator={false}>
              <Txt variant="heading" style={{ textAlign: 'center' }}>
                À toi, {current.name}
              </Txt>
              <Txt variant="muted" style={{ textAlign: 'center', marginBottom: spacing.sm }}>
                Écris 3 affirmations, puis marque ton mensonge 🤥
              </Txt>

              {[0, 1, 2].map((i) => {
                const isLie = lieIndex === i;
                return (
                  <View key={i} style={styles.inputRow}>
                    <TextInput
                      value={texts[i]}
                      onChangeText={(v) => setTexts((prev) => prev.map((t, j) => (j === i ? v : t)))}
                      placeholder={`Affirmation ${i + 1}`}
                      placeholderTextColor={palette.textFaint}
                      style={styles.input}
                      multiline
                    />
                    <Pressable
                      onPress={() => {
                        tap('light');
                        setLieIndex(i);
                      }}
                      style={[
                        styles.lieMark,
                        { borderColor: isLie ? palette.red : palette.border },
                        isLie && { backgroundColor: palette.red + '22' },
                      ]}
                    >
                      <Txt style={{ fontSize: 18, opacity: isLie ? 1 : 0.35 }}>🤥</Txt>
                    </Pressable>
                  </View>
                );
              })}

              <View style={styles.actions}>
                <Button label="C’est prêt" accent={accent} disabled={!canSubmit} onPress={submitStatements} />
              </View>
            </ScrollView>
          )}

          {phase === 'pass-out' && current && (
            <View style={styles.center}>
              <Txt style={styles.emoji}>📲</Txt>
              <Txt variant="label" color={palette.textMuted}>
                RENDEZ LE TÉLÉPHONE AU GROUPE
              </Txt>
              <Txt variant="title" style={{ textAlign: 'center' }}>
                Trouvez l’intox de{' '}
                <Txt variant="title" color={current.color}>
                  {current.name}
                </Txt>
              </Txt>
              <View style={styles.actions}>
                <Button label="Voir les affirmations" accent={accent} onPress={() => setPhase('guess')} />
              </View>
            </View>
          )}

          {phase === 'guess' && current && (
            <View style={styles.playWrap}>
              <Txt variant="heading" style={{ textAlign: 'center' }}>
                Quelle est l’intox de {current.name} ?
              </Txt>
              <View style={{ gap: spacing.sm }}>
                {cards.map((c, i) => (
                  <Pressable
                    key={i}
                    onPress={() => {
                      notify(guess === null ? 'warning' : 'success');
                      setGuess(i);
                      setPhase('result');
                    }}
                    style={({ pressed }) => [
                      styles.statement,
                      { borderColor: pressed ? accent : palette.border },
                    ]}
                  >
                    <Txt variant="body" style={{ fontSize: 17 }}>
                      {c.text}
                    </Txt>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {phase === 'result' && current && (
            <View style={styles.playWrap}>
              <View style={styles.center}>
                <Animated.Text entering={ZoomIn.springify().damping(11)} style={styles.emoji}>
                  {groupWon ? '🎯' : '🤡'}
                </Animated.Text>
                <Txt
                  variant="title"
                  style={{ textAlign: 'center' }}
                  color={groupWon ? palette.success : palette.red}
                >
                  {groupWon ? 'Bien vu !' : `${current.name} vous a bernés !`}
                </Txt>
              </View>
              <View style={{ gap: spacing.sm }}>
                {cards.map((c, i) => (
                  <View
                    key={i}
                    style={[
                      styles.statement,
                      c.lie && { borderColor: palette.red, backgroundColor: palette.red + '18' },
                      !c.lie && i === guess && { borderColor: palette.success },
                    ]}
                  >
                    <Txt variant="body" style={{ fontSize: 17, flex: 1 }}>
                      {c.text}
                    </Txt>
                    {c.lie && (
                      <Txt style={{ fontSize: 18 }}>🤥</Txt>
                    )}
                  </View>
                ))}
              </View>
              <View style={styles.actions}>
                <Button
                  label="Joueur suivant →"
                  accent={accent}
                  onPress={() => {
                    setRoundIndex((r) => r + 1);
                    beginRound();
                  }}
                />
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emoji: { fontSize: 56 },
  actions: { alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.md },

  formScroll: { flexGrow: 1, justifyContent: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  inputRow: { flexDirection: 'row', alignItems: 'stretch', gap: spacing.sm },
  input: {
    flex: 1,
    minHeight: 56,
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: palette.text,
    fontSize: 16,
  },
  lieMark: {
    width: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  playWrap: { flex: 1, justifyContent: 'center', gap: spacing.lg },
  statement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: spacing.lg,
    minHeight: 64,
  },
});

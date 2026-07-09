import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Gate } from '@/components/game/Gate';
import { PassPhone } from '@/components/game/PassPhone';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import { CATEGORIES } from '@/data/words';
import type { GameMeta } from '@/data/games';
import { shuffle } from '@/games/_engine/deck';
import { notify, tap } from '@/lib/haptics';
import { useGameStore } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

type Phase =
  | 'setup'
  | 'entry-pass'
  | 'entry'
  | 'turn-intro'
  | 'play'
  | 'turn-end'
  | 'round-end'
  | 'result';

const WORDS_PER_PLAYER = [3, 5, 8];
const DURATIONS = [30, 45, 60];
const PRESET_COUNT = 30;

const ROUND_RULES = [
  { title: 'Décris librement', hint: 'Tous les mots sauf le mot lui-même.' },
  { title: 'Un seul mot', hint: 'Un seul mot d’indice par carte.' },
  { title: 'Mime', hint: 'Gestes uniquement, aucun son.' },
];

const TEAM_LABELS = ['Équipe A', 'Équipe B'] as const;
const TEAM_COLORS = [palette.cyan, palette.magenta] as const;

export function TimesUp({ game }: { game: GameMeta }) {
  const players = useGameStore((s) => s.players);
  const accent = palette[game.accent];

  // Teams: auto-split the roster (evens vs odds).
  const teams: [typeof players, typeof players] = [
    players.filter((_, i) => i % 2 === 0),
    players.filter((_, i) => i % 2 === 1),
  ];

  const [phase, setPhase] = useState<Phase>('setup');
  const [source, setSource] = useState<'bowl' | 'theme'>('bowl');
  const [themeId, setThemeId] = useState(CATEGORIES[0].id);
  const [perPlayer, setPerPlayer] = useState(5);
  const [duration, setDuration] = useState(45);

  const [bowl, setBowl] = useState<string[]>([]);
  const [entryIndex, setEntryIndex] = useState(0);
  const [entryTexts, setEntryTexts] = useState<string[]>([]);

  const [round, setRound] = useState(0); // 0-based (0..2)
  const [deck, setDeck] = useState<string[]>([]);
  const [card, setCard] = useState<string | null>(null);
  const [teamTurn, setTeamTurn] = useState(0);
  const [describer, setDescriber] = useState<[number, number]>([0, 0]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [turnGuessed, setTurnGuessed] = useState(0);
  const [flash, setFlash] = useState(false);

  if (players.length < game.minPlayers) {
    return (
      <Screen title={game.title} showBack glowColor={accent}>
        <Gate emoji={game.emoji} minPlayers={game.minPlayers} current={players.length} accent={accent} />
      </Screen>
    );
  }

  const currentDescriber = teams[teamTurn][describer[teamTurn] % Math.max(1, teams[teamTurn].length)];

  const beginGame = (cards: string[]) => {
    setScores([0, 0]);
    setRound(0);
    setTeamTurn(0);
    setDescriber([0, 0]);
    setDeck(shuffle(cards));
    setPhase('turn-intro');
  };

  const startFromTheme = () => {
    const cat = CATEGORIES.find((c) => c.id === themeId) ?? CATEGORIES[0];
    beginGame(shuffle(cat.words).slice(0, PRESET_COUNT));
  };

  const startBowl = () => {
    setBowl([]);
    setEntryIndex(0);
    setEntryTexts(Array(perPlayer).fill(''));
    setPhase('entry-pass');
  };

  const submitEntry = () => {
    const added = entryTexts.map((t) => t.trim()).filter(Boolean);
    const nextBowl = [...bowl, ...added];
    if (entryIndex + 1 < players.length) {
      setBowl(nextBowl);
      setEntryIndex((i) => i + 1);
      setEntryTexts(Array(perPlayer).fill(''));
      setPhase('entry-pass');
    } else {
      beginGame(nextBowl);
    }
  };

  const startTurn = () => {
    const [head, ...rest] = deck;
    setCard(head ?? null);
    setDeck(rest);
    setTimeLeft(duration);
    setTurnGuessed(0);
    setPhase('play');
  };

  const found = () => {
    setFlash(true);
    notify('success');
    setScores((s) => {
      const n: [number, number] = [...s];
      n[teamTurn] += 1;
      return n;
    });
    setTurnGuessed((g) => g + 1);
    if (deck.length === 0) {
      setCard(null);
      setPhase('round-end');
      return;
    }
    const [head, ...rest] = deck;
    setCard(head);
    setDeck(rest);
  };

  const pass = () => {
    tap('light');
    if (!card || deck.length === 0) return; // nothing to swap to
    const [head, ...rest] = deck;
    setCard(head);
    setDeck([...rest, card]);
  };

  const endTurn = () => {
    // Un-guessed current card goes back to the front of the deck.
    if (card) setDeck((d) => [card, ...d]);
    setCard(null);
    setDescriber((d) => {
      const n: [number, number] = [...d];
      n[teamTurn] += 1;
      return n;
    });
    setTeamTurn((t) => (t === 0 ? 1 : 0));
    setPhase('turn-end');
  };

  const nextRound = () => {
    const cat = CATEGORIES.find((c) => c.id === themeId) ?? CATEGORIES[0];
    const fullDeck = source === 'theme' ? shuffle(cat.words).slice(0, PRESET_COUNT) : shuffle(bowl);
    setDeck(fullDeck);
    setRound((r) => r + 1);
    setTeamTurn((t) => (t === 0 ? 1 : 0)); // the other team opens the next round
    setPhase('turn-intro');
  };

  // Round timer
  useEffect(() => {
    if (phase !== 'play') return;
    if (timeLeft <= 0) {
      endTurn();
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  // Flash reset
  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(false), 180);
    return () => clearTimeout(id);
  }, [flash]);

  // ---------- Immersive play phase ----------
  if (phase === 'play') {
    return (
      <View style={[styles.full, { backgroundColor: flash ? palette.success : palette.bgElevated }]}>
        <View style={styles.playTop}>
          <Txt variant="label" color={TEAM_COLORS[teamTurn]}>
            {TEAM_LABELS[teamTurn]}
          </Txt>
          <Txt variant="title" color={palette.text}>
            {timeLeft}s
          </Txt>
          <Txt variant="label" color={palette.textMuted}>
            {turnGuessed} ✓
          </Txt>
        </View>

        <View style={styles.playCard}>
          <Txt variant="caption" color={palette.textMuted}>
            {ROUND_RULES[round].title.toUpperCase()}
          </Txt>
          <Txt variant="display" style={styles.cardWord} color={palette.white}>
            {card}
          </Txt>
        </View>

        <View style={styles.playButtons}>
          <Pressable style={[styles.bigBtn, styles.passBtn]} onPress={pass}>
            <Txt variant="heading" color={palette.text}>
              Passer
            </Txt>
          </Pressable>
          <Pressable style={[styles.bigBtn, { backgroundColor: palette.success }]} onPress={found}>
            <Txt variant="heading" color={palette.black}>
              Trouvé ✓
            </Txt>
          </Pressable>
        </View>
      </View>
    );
  }

  // ---------- Framed phases ----------
  return (
    <Screen title={game.title} showBack glowColor={accent}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          {phase === 'setup' && (
            <ScrollView contentContainerStyle={styles.setupScroll} showsVerticalScrollIndicator={false}>
              <Txt style={styles.emoji}>{game.emoji}</Txt>
              <Txt variant="title" style={{ textAlign: 'center' }}>
                Time&apos;s Up
              </Txt>
              <Txt variant="muted" style={{ textAlign: 'center' }}>
                2 équipes, 3 manches, même deck : décris → un mot → mime.
              </Txt>

              <View style={styles.teamsRow}>
                {teams.map((t, i) => (
                  <View key={i} style={[styles.teamBox, { borderColor: TEAM_COLORS[i] }]}>
                    <Txt variant="label" color={TEAM_COLORS[i]}>
                      {TEAM_LABELS[i]}
                    </Txt>
                    <Txt variant="muted" style={{ textAlign: 'center' }} numberOfLines={2}>
                      {t.map((p) => p.name).join(', ') || '—'}
                    </Txt>
                  </View>
                ))}
              </View>

              <Txt variant="label" style={styles.section}>
                CARTES
              </Txt>
              <View style={styles.grid}>
                <Chip label="Bol perso" emoji="🎁" selected={source === 'bowl'} accent={accent} onPress={() => setSource('bowl')} />
                <Chip label="Thème" emoji="📚" selected={source === 'theme'} accent={accent} onPress={() => setSource('theme')} />
              </View>

              {source === 'theme' ? (
                <View style={styles.grid}>
                  {CATEGORIES.map((c) => (
                    <Chip
                      key={c.id}
                      label={c.name}
                      emoji={c.emoji}
                      selected={themeId === c.id}
                      accent={accent}
                      onPress={() => setThemeId(c.id)}
                    />
                  ))}
                </View>
              ) : (
                <>
                  <Txt variant="label" style={styles.section}>
                    MOTS PAR JOUEUR
                  </Txt>
                  <View style={styles.grid}>
                    {WORDS_PER_PLAYER.map((n) => (
                      <Chip key={n} label={`${n}`} selected={perPlayer === n} accent={accent} onPress={() => setPerPlayer(n)} />
                    ))}
                  </View>
                </>
              )}

              <Txt variant="label" style={styles.section}>
                TEMPS PAR TOUR
              </Txt>
              <View style={styles.grid}>
                {DURATIONS.map((d) => (
                  <Chip key={d} label={`${d}s`} emoji="⏱️" selected={duration === d} accent={accent} onPress={() => setDuration(d)} />
                ))}
              </View>

              <View style={styles.actions}>
                <Button
                  label={source === 'bowl' ? 'Remplir le bol →' : 'Commencer'}
                  accent={accent}
                  onPress={source === 'bowl' ? startBowl : startFromTheme}
                />
              </View>
            </ScrollView>
          )}

          {phase === 'entry-pass' && (
            <PassPhone
              name={players[entryIndex].name}
              color={players[entryIndex].color}
              subtitle={`Ajoute ${perPlayer} mots au bol, en secret.`}
              cta="Ajouter mes mots"
              accent={accent}
              onReady={() => {
                tap('light');
                setPhase('entry');
              }}
            />
          )}

          {phase === 'entry' && (
            <ScrollView contentContainerStyle={styles.setupScroll} showsVerticalScrollIndicator={false}>
              <Txt variant="heading" style={{ textAlign: 'center' }}>
                {players[entryIndex].name}, tes {perPlayer} mots
              </Txt>
              <Txt variant="muted" style={{ textAlign: 'center', marginBottom: spacing.sm }}>
                Noms, persos, objets… ce que tu veux faire deviner.
              </Txt>
              {entryTexts.map((t, i) => (
                <TextInput
                  key={i}
                  value={t}
                  onChangeText={(v) => setEntryTexts((prev) => prev.map((x, j) => (j === i ? v : x)))}
                  placeholder={`Mot ${i + 1}`}
                  placeholderTextColor={palette.textFaint}
                  style={styles.input}
                />
              ))}
              <View style={styles.actions}>
                <Button
                  label={entryIndex + 1 < players.length ? 'Joueur suivant →' : 'Lancer la partie'}
                  accent={accent}
                  disabled={entryTexts.every((t) => !t.trim())}
                  onPress={submitEntry}
                />
              </View>
            </ScrollView>
          )}

          {phase === 'turn-intro' && (
            <View style={styles.center}>
              <Txt variant="label" color={palette.textMuted}>
                MANCHE {round + 1}/3 · {ROUND_RULES[round].title.toUpperCase()}
              </Txt>
              <Txt variant="muted" style={{ textAlign: 'center' }}>
                {ROUND_RULES[round].hint}
              </Txt>
              <View style={[styles.turnBadge, { borderColor: TEAM_COLORS[teamTurn] }]}>
                <Txt variant="heading" color={TEAM_COLORS[teamTurn]}>
                  {TEAM_LABELS[teamTurn]}
                </Txt>
              </View>
              {currentDescriber && (
                <Txt variant="title" style={{ textAlign: 'center' }}>
                  {currentDescriber.name} décrit
                </Txt>
              )}
              <Txt variant="muted" style={{ textAlign: 'center' }}>
                Passe le tél à {currentDescriber?.name}. Prêt ?
              </Txt>
              <View style={styles.actions}>
                <Button label="Go ! ⏱️" accent={accent} onPress={startTurn} />
              </View>
            </View>
          )}

          {phase === 'turn-end' && (
            <View style={styles.center}>
              <Txt style={styles.emoji}>⏰</Txt>
              <Txt variant="title" style={{ textAlign: 'center' }}>
                Temps écoulé !
              </Txt>
              <ScoreBoard scores={scores} />
              <View style={styles.actions}>
                <Button label={`Au tour de ${TEAM_LABELS[teamTurn]} →`} accent={accent} onPress={() => setPhase('turn-intro')} />
              </View>
            </View>
          )}

          {phase === 'round-end' && (
            <View style={styles.center}>
              <Txt style={styles.emoji}>🎉</Txt>
              <Txt variant="title" style={{ textAlign: 'center' }}>
                Fin de la manche {round + 1}
              </Txt>
              <ScoreBoard scores={scores} />
              <View style={styles.actions}>
                {round + 1 < 3 ? (
                  <Button label={`Manche ${round + 2} : ${ROUND_RULES[round + 1].title} →`} accent={accent} onPress={nextRound} />
                ) : (
                  <Button label="Voir le résultat 🏆" accent={accent} onPress={() => setPhase('result')} />
                )}
              </View>
            </View>
          )}

          {phase === 'result' && (
            <View style={styles.center}>
              <Txt style={styles.emoji}>🏆</Txt>
              <Txt variant="title" style={{ textAlign: 'center' }} color={accent}>
                {scores[0] === scores[1]
                  ? 'Égalité !'
                  : `${TEAM_LABELS[scores[0] > scores[1] ? 0 : 1]} gagne !`}
              </Txt>
              <ScoreBoard scores={scores} big />
              <View style={styles.actions}>
                <Button label="Rejouer" accent={accent} onPress={() => setPhase('setup')} />
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function ScoreBoard({ scores, big }: { scores: [number, number]; big?: boolean }) {
  return (
    <View style={styles.scoreRow}>
      {[0, 1].map((i) => (
        <View key={i} style={[styles.scoreBox, { borderColor: TEAM_COLORS[i] }]}>
          <Txt variant="label" color={TEAM_COLORS[i]}>
            {TEAM_LABELS[i]}
          </Txt>
          <Txt variant="display" color={palette.text} style={{ fontSize: big ? 52 : 40 }}>
            {scores[i]}
          </Txt>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: spacing.lg, maxWidth: 560, width: '100%', alignSelf: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emoji: { fontSize: 56 },
  actions: { alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.md },

  setupScroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  section: { marginTop: spacing.md, letterSpacing: 1.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },

  teamsRow: { flexDirection: 'row', gap: spacing.md, alignSelf: 'stretch', marginTop: spacing.sm },
  teamBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    padding: spacing.md,
  },

  input: {
    alignSelf: 'stretch',
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: palette.text,
    fontSize: 16,
  },

  turnBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    backgroundColor: palette.surface,
  },

  scoreRow: { flexDirection: 'row', gap: spacing.md, alignSelf: 'stretch' },
  scoreBox: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    paddingVertical: spacing.lg,
  },

  // Immersive play
  full: { flex: 1, paddingTop: 64, paddingBottom: spacing.xl, paddingHorizontal: spacing.lg },
  playTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  playCard: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  cardWord: { fontSize: 40, textAlign: 'center', lineHeight: 46 },
  playButtons: { flexDirection: 'row', gap: spacing.md },
  bigBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl, borderRadius: radius.lg },
  passBtn: { backgroundColor: palette.surfaceHi, borderWidth: 1, borderColor: palette.borderHi },
});

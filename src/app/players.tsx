import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Txt } from '@/components/ui/Txt';
import { tap } from '@/lib/haptics';
import { useGameStore } from '@/store/useGameStore';
import { palette, radius, spacing } from '@/theme';

export default function PlayersScreen() {
  const players = useGameStore((s) => s.players);
  const addPlayer = useGameStore((s) => s.addPlayer);
  const removePlayer = useGameStore((s) => s.removePlayer);
  const clearPlayers = useGameStore((s) => s.clearPlayers);
  const [name, setName] = useState('');

  const submit = () => {
    if (!name.trim()) return;
    addPlayer(name);
    setName('');
  };

  return (
    <Screen title="Joueurs" showBack glowColor={palette.cyan}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.body}>
          <View style={styles.inputRow}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Prénom du joueur"
              placeholderTextColor={palette.textFaint}
              style={styles.input}
              onSubmitEditing={submit}
              returnKeyType="done"
              autoCapitalize="words"
              maxLength={16}
            />
            <Pressable
              onPress={submit}
              disabled={!name.trim()}
              style={({ pressed }) => [
                styles.addBtn,
                { opacity: !name.trim() ? 0.4 : pressed ? 0.8 : 1 },
              ]}
            >
              <Txt variant="title" color={palette.black} style={{ fontSize: 26 }}>
                +
              </Txt>
            </Pressable>
          </View>

          {players.length === 0 ? (
            <View style={styles.empty}>
              <Txt style={styles.emptyEmoji}>🎉</Txt>
              <Txt variant="muted" style={{ textAlign: 'center' }}>
                Ajoute au moins 2 joueurs pour commencer une partie.
              </Txt>
            </View>
          ) : (
            <FlatList
              data={players}
              keyExtractor={(p) => p.id}
              contentContainerStyle={{ paddingVertical: spacing.md, gap: spacing.sm }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.playerRow}>
                  <View style={[styles.avatar, { backgroundColor: item.color }]}>
                    <Txt variant="heading" color={palette.black}>
                      {item.name.charAt(0).toUpperCase()}
                    </Txt>
                  </View>
                  <Txt variant="heading" style={{ flex: 1, fontSize: 16 }} numberOfLines={1}>
                    {item.name}
                  </Txt>
                  <Pressable
                    onPress={() => {
                      tap('light');
                      removePlayer(item.id);
                    }}
                    hitSlop={10}
                    style={({ pressed }) => [styles.removeBtn, pressed && { opacity: 0.6 }]}
                  >
                    <Txt variant="heading" color={palette.textMuted}>
                      ✕
                    </Txt>
                  </Pressable>
                </View>
              )}
            />
          )}
        </View>

        {players.length > 0 && (
          <View style={styles.footer}>
            <Button
              label="Tout effacer"
              variant="ghost"
              onPress={() => {
                tap('medium');
                clearPlayers();
              }}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { flex: 1, paddingHorizontal: spacing.lg, maxWidth: 640, width: '100%', alignSelf: 'center' },
  inputRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: palette.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  emptyEmoji: { fontSize: 48 },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  removeBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  footer: { padding: spacing.lg, maxWidth: 640, width: '100%', alignSelf: 'center' },
});

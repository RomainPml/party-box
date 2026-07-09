import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { palette } from '@/theme';

export type Player = {
  id: string;
  name: string;
  /** Accent color assigned round-robin for chips/avatars. */
  color: string;
};

const PLAYER_COLORS = [
  palette.violet,
  palette.cyan,
  palette.magenta,
  palette.lime,
  palette.amber,
  palette.blue,
  palette.teal,
  palette.red,
];

let idCounter = 0;
const makeId = () => `p_${Date.now().toString(36)}_${(idCounter++).toString(36)}`;

export type Intensity = 'soft' | 'hardcore';

type Settings = {
  haptics: boolean;
  intensity: Intensity;
};

type GameState = {
  players: Player[];
  settings: Settings;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  renamePlayer: (id: string, name: string) => void;
  clearPlayers: () => void;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      players: [],
      settings: { haptics: true, intensity: 'soft' },

      addPlayer: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const players = get().players;
        // Skip duplicates (case-insensitive)
        if (players.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) return;
        const color = PLAYER_COLORS[players.length % PLAYER_COLORS.length];
        set({ players: [...players, { id: makeId(), name: trimmed, color }] });
      },

      removePlayer: (id) =>
        set((s) => ({ players: s.players.filter((p) => p.id !== id) })),

      renamePlayer: (id, name) =>
        set((s) => ({
          players: s.players.map((p) =>
            p.id === id ? { ...p, name: name.trim() || p.name } : p,
          ),
        })),

      clearPlayers: () => set({ players: [] }),

      setSetting: (key, value) =>
        set((s) => ({ settings: { ...s.settings, [key]: value } })),
    }),
    {
      name: 'partybox-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ players: s.players, settings: s.settings }),
    },
  ),
);

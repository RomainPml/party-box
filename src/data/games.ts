import type { AccentColor } from '@/theme';

/** Interaction families — each maps to a reusable engine/brick. */
export type GameFamily = 'deck' | 'vote' | 'secret' | 'sensor' | 'team' | 'rules';

export type GameStatus = 'ready' | 'soon';

/** Menu sections. `undefined` category is treated as 'party'. */
export type GameCategory = 'party' | 'alcool';

export const GAME_CATEGORIES: { id: GameCategory; label: string; emoji: string }[] = [
  { id: 'party', label: 'Jeux d’ambiance', emoji: '🎉' },
  { id: 'alcool', label: 'Jeux d’alcool', emoji: '🍻' },
];

export type GameMeta = {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  accent: AccentColor;
  family: GameFamily;
  minPlayers: number;
  status: GameStatus;
  /** Menu section. Omitted = 'party'. */
  category?: GameCategory;
  /** 'rules' games just display prerequisites + rules (no interactive engine). */
  type?: 'rules';
};

/**
 * V1 catalogue — 9 "light" games (karaoké & blind test are phase 2).
 * `status: 'ready'` flips on as each game gets built.
 */
export const GAMES: GameMeta[] = [
  {
    id: 'picolo',
    title: 'Picolo',
    tagline: 'Le jeu à boire déjanté.',
    emoji: '🍻',
    accent: 'amber',
    family: 'deck',
    minPlayers: 2,
    status: 'ready',
    category: 'alcool',
  },
  {
    id: 'action-verite',
    title: 'Action ou Vérité',
    tagline: 'Ose ou avoue.',
    emoji: '🔥',
    accent: 'magenta',
    family: 'deck',
    minPlayers: 2,
    status: 'ready',
  },
  {
    id: 'tu-preferes',
    title: 'Tu préfères',
    tagline: 'Deux choix, aucun bon.',
    emoji: '🤔',
    accent: 'cyan',
    family: 'deck',
    minPlayers: 2,
    status: 'ready',
  },
  {
    id: 'je-nai-jamais',
    title: "Je n'ai jamais",
    tagline: 'Qui a déjà… ?',
    emoji: '🙈',
    accent: 'violet',
    family: 'deck',
    minPlayers: 2,
    status: 'ready',
  },
  {
    id: 'qui-pourrait',
    title: 'Qui pourrait',
    tagline: 'Désigne le plus susceptible.',
    emoji: '👉',
    accent: 'amber',
    family: 'vote',
    minPlayers: 3,
    status: 'ready',
  },
  {
    id: 'qui-parmi-nous',
    title: 'Qui parmi nous',
    tagline: 'Le sondage de la soirée.',
    emoji: '🕵️',
    accent: 'blue',
    family: 'vote',
    minPlayers: 3,
    status: 'ready',
  },
  {
    id: 'deux-verites',
    title: '2 vérités, 1 mensonge',
    tagline: 'Repère l’intox.',
    emoji: '🤥',
    accent: 'teal',
    family: 'vote',
    minPlayers: 3,
    status: 'ready',
  },
  {
    id: 'imposteur',
    title: 'Imposteur',
    tagline: 'Un mot secret, un menteur.',
    emoji: '🎭',
    accent: 'red',
    family: 'secret',
    minPlayers: 4,
    status: 'ready',
  },
  {
    id: 'undercover',
    title: 'Undercover',
    tagline: 'Un mot voisin, un infiltré qui s’ignore.',
    emoji: '🥸',
    accent: 'teal',
    family: 'secret',
    minPlayers: 4,
    status: 'ready',
  },
  {
    id: 'devine-tete',
    title: 'Devine-tête',
    tagline: 'Le mot sur ton front.',
    emoji: '🧠',
    accent: 'lime',
    family: 'sensor',
    minPlayers: 2,
    status: 'ready',
  },
  {
    id: 'cherche',
    title: 'Cherche',
    tagline: '20 questions, oui ou non.',
    emoji: '❓',
    accent: 'cyan',
    family: 'secret',
    minPlayers: 2,
    status: 'ready',
  },
  {
    id: 'times-up',
    title: "Time's Up",
    tagline: '2 équipes, 3 manches, le chrono.',
    emoji: '⏱️',
    accent: 'blue',
    family: 'team',
    minPlayers: 4,
    status: 'ready',
  },
  {
    id: 'tier-list',
    title: 'Tier List',
    tagline: 'Classez tout, ensemble.',
    emoji: '📊',
    accent: 'violet',
    family: 'vote',
    minPlayers: 2,
    status: 'ready',
  },

  // ---- Jeux d'alcool "règles" (fiches : prérequis + règles, jeu avec vraies cartes) ----
  {
    id: 'ring-of-fire',
    title: 'Ring of Fire',
    tagline: 'Le Roi — cercle de cartes.',
    emoji: '👑',
    accent: 'red',
    family: 'rules',
    minPlayers: 1,
    status: 'ready',
    category: 'alcool',
    type: 'rules',
  },
  {
    id: 'pyramide',
    title: 'La Pyramide',
    tagline: 'Distribue… ou bluffe.',
    emoji: '🔺',
    accent: 'cyan',
    family: 'rules',
    minPlayers: 1,
    status: 'ready',
    category: 'alcool',
    type: 'rules',
  },
  {
    id: 'menteur',
    title: 'Le Menteur',
    tagline: 'Bluff : pose et mens.',
    emoji: '🃏',
    accent: 'magenta',
    family: 'rules',
    minPlayers: 1,
    status: 'ready',
    category: 'alcool',
    type: 'rules',
  },
  {
    id: 'fuck-the-dealer',
    title: 'Fuck the Dealer',
    tagline: 'Devine la valeur cachée.',
    emoji: '🂠',
    accent: 'teal',
    family: 'rules',
    minPlayers: 1,
    status: 'ready',
    category: 'alcool',
    type: 'rules',
  },
  {
    id: 'purple',
    title: 'Purple',
    tagline: 'Prédis, monte ta série… ou tombe.',
    emoji: '🟣',
    accent: 'violet',
    family: 'rules',
    minPlayers: 1,
    status: 'ready',
    category: 'alcool',
    type: 'rules',
  },
  {
    id: 'camino-de-la-muerte',
    title: 'Camino de la muerte',
    tagline: 'Traverse sans croiser de tête.',
    emoji: '💀',
    accent: 'lime',
    family: 'rules',
    minPlayers: 1,
    status: 'ready',
    category: 'alcool',
    type: 'rules',
  },
];

export const getGame = (id: string): GameMeta | undefined =>
  GAMES.find((g) => g.id === id);

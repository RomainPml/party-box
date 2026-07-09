/**
 * La Bombe — thèmes imposés. À son tour, chaque joueur cite un mot qui colle
 * au thème puis passe vite le téléphone : celui qui l'a en main quand la
 * bombe explose a perdu. Pure data — ajoute des thèmes librement.
 */

export type BombeTheme = { emoji: string; label: string };

export const BOMBE_THEMES: BombeTheme[] = [
  { emoji: '🍓', label: 'Un fruit' },
  { emoji: '🥕', label: 'Un légume' },
  { emoji: '🚗', label: 'Une marque de voiture' },
  { emoji: '🐾', label: 'Un animal' },
  { emoji: '🌍', label: 'Un pays' },
  { emoji: '🏙️', label: 'Une ville' },
  { emoji: '👶', label: 'Un prénom' },
  { emoji: '🎬', label: 'Un film' },
  { emoji: '📺', label: 'Une série' },
  { emoji: '🎤', label: 'Un chanteur ou un groupe' },
  { emoji: '⚽', label: 'Un sport' },
  { emoji: '🎨', label: 'Une couleur' },
  { emoji: '🍕', label: 'Un plat' },
  { emoji: '🍹', label: 'Une boisson' },
  { emoji: '🧀', label: 'Un fromage' },
  { emoji: '👕', label: 'Un vêtement' },
  { emoji: '💼', label: 'Un métier' },
  { emoji: '🎸', label: 'Un instrument de musique' },
  { emoji: '🏷️', label: 'Une marque' },
  { emoji: '📱', label: 'Une application' },
  { emoji: '🦸', label: 'Un super-héros' },
  { emoji: '🍫', label: 'Une sucrerie' },
  { emoji: '🌸', label: 'Une fleur' },
  { emoji: '🪑', label: 'Un objet de la maison' },
  { emoji: '🧠', label: 'Une matière scolaire' },
  { emoji: '🎮', label: 'Un jeu vidéo' },
  { emoji: '🐟', label: 'Un poisson' },
  { emoji: '🌳', label: 'Un arbre' },
  { emoji: '🚀', label: 'Quelque chose dans l’espace' },
  { emoji: '🏰', label: 'Un monument' },
  { emoji: '💃', label: 'Une danse' },
  { emoji: '🥶', label: 'Quelque chose de froid' },
  { emoji: '🔥', label: 'Quelque chose de chaud' },
  { emoji: '🟡', label: 'Quelque chose de jaune' },
  { emoji: '🟢', label: 'Quelque chose de rond' },
  { emoji: '😱', label: 'Une peur ou une phobie' },
  { emoji: '🎁', label: 'Une idée de cadeau' },
  { emoji: '🏖️', label: 'Un truc de vacances' },
  { emoji: '🎃', label: 'Un déguisement' },
  { emoji: '💥', label: 'Un mot qui fait peur' },
];

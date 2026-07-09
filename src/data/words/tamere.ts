/**
 * "Ta mère en slip" — a Devine-tête theme where the prompt is a
 * personnage + a situation, combined absurdly. Reuse for other silly rounds.
 */

export const PERSONNAGES: string[] = [
  'Ta mère en slip',
  'Le président',
  'Un bébé',
  'Ton prof de sport',
  'Dark Vador',
  'Une mamie',
  'Un influenceur',
  'Le pape',
  'Ton ex',
  'Un ninja',
  'Un pirate',
  'Une licorne',
  'Le facteur',
  'Un zombie',
  'James Bond',
  'Un poussin',
  'Ton patron',
  'Une diva',
  'Un cowboy',
  'Un robot',
  'Un vampire',
  'Un super-héros',
  'Ta prof de maths',
  'Un politicien',
  'Un chef étoilé',
  'Un troll',
];

export const SITUATIONS: string[] = [
  'en plein marathon',
  'qui fait la vaisselle',
  'en plein karaoké',
  'qui accouche',
  'en train de draguer',
  'qui répare une fuite',
  'qui fait du twerk',
  'en réunion Zoom',
  'qui vole un cookie',
  'en train de méditer',
  'qui passe le permis',
  'qui fait un régime',
  'perdu au supermarché',
  'qui monte un meuble Ikea',
  'en train de bâiller',
  'qui fait la sieste',
  'en pleine dispute',
  'qui apprend à nager',
  'coincé dans l’ascenseur',
  'qui fête son anniversaire',
  'qui rate son bus',
  'en plein footing',
  'qui fait un discours',
  'coincé sous la pluie',
  'qui essaie de séduire',
  'en pleine crise de rire',
];

/** Combines a random personnage with a random situation. */
export function pickSilly(): string {
  const p = PERSONNAGES[Math.floor(Math.random() * PERSONNAGES.length)];
  const s = SITUATIONS[Math.floor(Math.random() * SITUATIONS.length)];
  return `${p} ${s}`;
}

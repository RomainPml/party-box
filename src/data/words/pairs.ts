/**
 * Word pairs for Undercover — two close-but-different words.
 * Majority gets one, the undercover gets the other (and doesn't know it).
 */

export type WordPair = { a: string; b: string };

export const PAIRS: WordPair[] = [
  { a: 'Chien', b: 'Chat' },
  { a: 'Café', b: 'Thé' },
  { a: 'Été', b: 'Printemps' },
  { a: 'Pizza', b: 'Quiche' },
  { a: 'Vin', b: 'Bière' },
  { a: 'Roi', b: 'Reine' },
  { a: 'Lune', b: 'Étoile' },
  { a: 'Voiture', b: 'Moto' },
  { a: 'Guitare', b: 'Piano' },
  { a: 'Mer', b: 'Lac' },
  { a: 'Chocolat', b: 'Caramel' },
  { a: 'Docteur', b: 'Infirmier' },
  { a: 'Avion', b: 'Hélicoptère' },
  { a: 'Football', b: 'Rugby' },
  { a: 'Pomme', b: 'Poire' },
  { a: 'Roman', b: 'BD' },
  { a: 'Sorcier', b: 'Fée' },
  { a: 'Château', b: 'Cabane' },
  { a: 'Loup', b: 'Renard' },
  { a: 'Neige', b: 'Pluie' },
  { a: 'Boulanger', b: 'Pâtissier' },
  { a: 'Vélo', b: 'Trottinette' },
  { a: 'Citron', b: 'Orange' },
  { a: 'Fantôme', b: 'Zombie' },
  { a: 'Prince', b: 'Chevalier' },
  { a: 'Tigre', b: 'Lion' },
  { a: 'Professeur', b: 'Directeur' },
  { a: 'Voleur', b: 'Espion' },
  { a: 'Plage', b: 'Piscine' },
  { a: 'Burger', b: 'Sandwich' },
  { a: 'Thé', b: 'Tisane' },
  { a: 'Docteur', b: 'Dentiste' },
  { a: 'Montagne', b: 'Colline' },
  { a: 'Sorcière', b: 'Vampire' },
  { a: 'Train', b: 'Métro' },
  { a: 'Cinéma', b: 'Théâtre' },
  { a: 'Fraise', b: 'Framboise' },
  { a: 'Roi', b: 'Empereur' },
  { a: 'Papillon', b: 'Libellule' },
  { a: 'Soleil', b: 'Bougie' },
  { a: 'Docteur', b: 'Pharmacien' },
  { a: 'Guitare', b: 'Ukulélé' },
  { a: 'Requin', b: 'Dauphin' },
  { a: 'Cadeau', b: 'Surprise' },
  { a: 'Voiture', b: 'Camion' },
  { a: 'Chocolat chaud', b: 'Café' },
  { a: 'Livre', b: 'Magazine' },
  { a: 'Batterie', b: 'Trompette' },
  { a: 'Cerise', b: 'Raisin' },
  { a: 'Chevalier', b: 'Samouraï' },
  { a: 'Rivière', b: 'Cascade' },
  { a: 'Magicien', b: 'Clown' },
  { a: 'Fusée', b: 'Satellite' },
  { a: 'Serveur', b: 'Cuisinier' },
];

/** Picks a pair and randomises which word is the majority vs the undercover. */
export function pickPair(): { major: string; minor: string } {
  const p = PAIRS[Math.floor(Math.random() * PAIRS.length)];
  return Math.random() < 0.5 ? { major: p.a, minor: p.b } : { major: p.b, minor: p.a };
}

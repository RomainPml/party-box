/**
 * Word banks by category — shared by Imposteur and Cherche.
 * FR, grand public. Add categories/words freely (pure data).
 */

export type WordCategory = {
  id: string;
  name: string;
  emoji: string;
  words: string[];
};

export const CATEGORIES: WordCategory[] = [
  {
    id: 'animaux',
    name: 'Animaux',
    emoji: '🐾',
    words: [
      'Éléphant', 'Pingouin', 'Kangourou', 'Dauphin', 'Hérisson', 'Girafe',
      'Crocodile', 'Chauve-souris', 'Panda', 'Poulpe', 'Loup', 'Écureuil',
      'Flamant rose', 'Tortue', 'Renard', 'Koala',
      'Otarie', 'Léopard', 'Hibou', 'Caméléon', 'Raton laveur', 'Lama',
    ],
  },
  {
    id: 'nourriture',
    name: 'Nourriture',
    emoji: '🍕',
    words: [
      'Pizza', 'Sushi', 'Raclette', 'Croissant', 'Kebab', 'Tiramisu',
      'Burger', 'Crêpe', 'Camembert', 'Guacamole', 'Ramen', 'Tacos',
      'Macaron', 'Fondue', 'Paella', 'Nutella',
      'Lasagnes', 'Falafel', 'Churros', 'Ravioli', 'Bretzel', 'Gaufre',
    ],
  },
  {
    id: 'lieux',
    name: 'Lieux',
    emoji: '🌍',
    words: [
      'Aéroport', 'Plage', 'Hôpital', 'Supermarché', 'Piscine', 'Cinéma',
      'Château', 'Prison', 'Casino', 'Bibliothèque', 'Zoo', 'Camping',
      'Boîte de nuit', 'Musée', 'Station de ski', 'Cimetière',
      'Théâtre', 'Marché', 'Gare', 'Grotte', 'Phare', 'Stade',
    ],
  },
  {
    id: 'objets',
    name: 'Objets',
    emoji: '🪑',
    words: [
      'Parapluie', 'Aspirateur', 'Télécommande', 'Brosse à dents', 'Tire-bouchon',
      'Réveil', 'Cintre', 'Extincteur', 'Ventilateur', 'Cadenas', 'Boussole',
      'Micro-ondes', 'Trampoline', 'Loupe', 'Échelle', 'Bougie',
      'Sèche-cheveux', 'Agrafeuse', 'Balançoire', 'Trombone', 'Thermomètre', 'Toboggan',
    ],
  },
  {
    id: 'metiers',
    name: 'Métiers',
    emoji: '👷',
    words: [
      'Pompier', 'Chirurgien', 'Boulanger', 'Astronaute', 'Plombier', 'Avocat',
      'Coiffeur', 'Vétérinaire', 'Pilote', 'Journaliste', 'Jardinier', 'Magicien',
      'Détective', 'Professeur', 'Serveur', 'Photographe',
      'Architecte', 'Cuisinier', 'Bibliothécaire', 'Dentiste', 'Fleuriste', 'Mécanicien',
    ],
  },
  {
    id: 'films',
    name: 'Films & Séries',
    emoji: '🎬',
    words: [
      'Titanic', 'Harry Potter', 'Le Roi Lion', 'Star Wars', 'La Casa de Papel',
      'Intouchables', 'Game of Thrones', 'Avatar', 'Breaking Bad', 'Shrek',
      'Spider-Man', 'Friends', 'Jurassic Park', 'Squid Game', 'Batman', 'Frozen',
      'Matrix', 'Le Parrain', 'Forrest Gump', 'Retour vers le futur', 'Le Seigneur des Anneaux', 'Interstellar',
    ],
  },
  {
    id: 'celebrites',
    name: 'Célébrités',
    emoji: '⭐',
    words: [
      'Beyoncé', 'Kylian Mbappé', 'Angela Merkel', 'Zinedine Zidane', 'Rihanna',
      'Barack Obama', 'Céline Dion', 'Cristiano Ronaldo', 'Lady Gaga', 'Einstein',
      'Michael Jackson', 'Emma Watson', 'Elon Musk', 'Adele', 'Jul', 'Omar Sy',
      'Taylor Swift', 'Zlatan Ibrahimović', 'Brad Pitt', 'Shakira', 'Keanu Reeves', 'Dua Lipa',
    ],
  },
  {
    id: 'pays',
    name: 'Pays',
    emoji: '🌎',
    words: [
      'Japon', 'Brésil', 'Canada', 'Égypte', 'Australie', 'Italie',
      'Maroc', 'Inde', 'Mexique', 'Norvège', 'Grèce', 'Chine',
      'Espagne', 'Portugal', 'Sénégal', 'Islande',
      'Argentine', 'Thaïlande', 'Kenya', 'Suède', 'Turquie', 'Pérou',
    ],
  },
  {
    id: 'groupes',
    name: 'Groupes',
    emoji: '🎸',
    words: [
      'Daft Punk', 'Coldplay', 'BTS', 'Queen', 'Téléphone', 'The Beatles',
      'Maroon 5', 'Nirvana', 'ABBA', 'AC/DC', 'Imagine Dragons', 'Gorillaz',
      'Indochine', 'Måneskin', 'Metallica', 'PNL',
      'Oasis', 'U2', 'Red Hot Chili Peppers', 'Green Day', 'Muse', 'Rolling Stones',
    ],
  },
  {
    id: 'marques',
    name: 'Marques',
    emoji: '🏷️',
    words: [
      'Apple', 'Nike', 'Coca-Cola', 'Netflix', 'McDonald’s', 'Google',
      'Adidas', 'Amazon', 'Ikea', 'Chanel', 'Red Bull', 'Lego',
      'Samsung', 'Spotify', 'Decathlon', 'Tesla',
      'Zara', 'H&M', 'Sony', 'Puma', 'Gucci', 'Lidl',
    ],
  },
];

/**
 * Picks a random word. If `categoryId` is given (and exists), stays within
 * that theme; otherwise draws from all categories.
 */
export function pickWord(categoryId?: string): { category: WordCategory; word: string } {
  const scoped = categoryId ? CATEGORIES.filter((c) => c.id === categoryId) : CATEGORIES;
  const pool = scoped.length ? scoped : CATEGORIES;
  const category = pool[Math.floor(Math.random() * pool.length)];
  const word = category.words[Math.floor(Math.random() * category.words.length)];
  return { category, word };
}

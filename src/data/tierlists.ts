/** Themes for the collaborative Tier List game. Each = a debatable set of items. */

export type TierTheme = {
  id: string;
  name: string;
  emoji: string;
  items: string[];
};

export const TIER_THEMES: TierTheme[] = [
  {
    id: 'fastfood',
    name: 'Fast-foods',
    emoji: '🍔',
    items: [
      'McDonald’s', 'KFC', 'Burger King', 'Subway', 'O’Tacos',
      'Domino’s', 'Quick', 'Five Guys', 'Pizza Hut', 'Tacos Avenue',
      'Big Fernand', 'Sushi Shop', 'Pitaya', 'Bagelstein', 'Nando’s',
    ],
  },
  {
    id: 'reseaux',
    name: 'Réseaux sociaux',
    emoji: '📱',
    items: [
      'Instagram', 'TikTok', 'Snapchat', 'X (Twitter)', 'Facebook',
      'BeReal', 'YouTube', 'WhatsApp', 'LinkedIn', 'Reddit',
      'Discord', 'Pinterest', 'Twitch', 'Telegram', 'Threads',
    ],
  },
  {
    id: 'animation',
    name: 'Films d’animation',
    emoji: '🎬',
    items: [
      'Le Roi Lion', 'Toy Story', 'La Reine des Neiges', 'Le Monde de Nemo',
      'Vice-Versa', 'Coco', 'Là-haut', 'Shrek', 'Raiponce', 'Zootopie',
      'Ratatouille', 'Les Indestructibles', 'Aladdin', 'Vaiana', 'Encanto',
    ],
  },
  {
    id: 'boissons',
    name: 'Boissons',
    emoji: '🥤',
    items: [
      'Coca-Cola', 'Fanta', 'Oasis', 'Ice Tea', 'Red Bull',
      'Orangina', 'Sprite', 'Capri-Sun', 'Perrier', 'Limonade',
      'Pepsi', 'Schweppes', 'Monster', 'Tropico', 'San Pellegrino',
    ],
  },
  {
    id: 'matieres',
    name: 'Matières scolaires',
    emoji: '📚',
    items: [
      'Maths', 'Français', 'Histoire-Géo', 'EPS', 'Anglais',
      'SVT', 'Physique-Chimie', 'Arts plastiques', 'Musique', 'Philo',
      'Espagnol', 'Allemand', 'Techno', 'Économie', 'Latin',
    ],
  },
  {
    id: 'heros',
    name: 'Super-héros',
    emoji: '🦸',
    items: [
      'Batman', 'Spider-Man', 'Iron Man', 'Superman', 'Hulk',
      'Thor', 'Captain America', 'Deadpool', 'Wonder Woman', 'Black Panther',
      'Flash', 'Aquaman', 'Doctor Strange', 'Wolverine', 'Ant-Man',
    ],
  },
  {
    id: 'pizza',
    name: 'Garnitures de pizza',
    emoji: '🍕',
    items: [
      'Ananas', 'Champignons', 'Chorizo', '4 fromages', 'Roquette',
      'Œuf', 'Merguez', 'Anchois', 'Olives', 'Chèvre-miel',
      'Jambon', 'Pepperoni', 'Poivrons', 'Oignons', 'Thon',
    ],
  },
  {
    id: 'streaming',
    name: 'Plateformes de streaming',
    emoji: '📺',
    items: [
      'Netflix', 'Prime Video', 'Disney+', 'YouTube', 'Twitch',
      'Canal+', 'Spotify', 'Deezer', 'Apple TV+', 'Crunchyroll',
      'Max (HBO)', 'Paramount+', 'Molotov', 'MyCanal', 'ADN',
    ],
  },
  {
    id: 'vacances',
    name: 'Types de vacances',
    emoji: '🏖️',
    items: [
      'Plage', 'Montagne', 'City-trip', 'Camping', 'Croisière',
      'Road trip', 'Chez mamie', 'Club all-inclusive', 'Randonnée', 'Festival',
      'Safari', 'Thalasso', 'Van life', 'Colo', 'Chez les potes',
    ],
  },
  {
    id: 'petitdej',
    name: 'Petit-déjeuner',
    emoji: '🥐',
    items: [
      'Croissant', 'Pain au chocolat', 'Céréales', 'Œufs-bacon', 'Tartines',
      'Pancakes', 'Fruits', 'Nutella', 'Café seul', 'Sauter le repas',
      'Yaourt', 'Smoothie', 'Brioche', 'Granola', 'Jus d’orange',
    ],
  },
  {
    id: 'youtubers',
    name: 'YouTubers',
    emoji: '🎥',
    items: [
      'Squeezie', 'Cyprien', 'Norman', 'McFly et Carlito', 'Michou',
      'Inoxtag', 'Tibo InShape', 'Léna Situations', 'MrBeast', 'Amixem',
      'Domingo', 'Mister V', 'HugoDécrypte', 'Le Rire Jaune', 'Joyca',
    ],
  },
  {
    id: 'acteurs',
    name: 'Acteurs',
    emoji: '🎞️',
    items: [
      'Leonardo DiCaprio', 'Brad Pitt', 'Omar Sy', 'Marion Cotillard', 'Tom Cruise',
      'Jean Dujardin', 'Ryan Gosling', 'Margot Robbie', 'Denzel Washington', 'Timothée Chalamet',
      'Scarlett Johansson', 'Will Smith', 'Vincent Cassel', 'Audrey Tautou', 'Robert De Niro',
    ],
  },
  {
    id: 'manga',
    name: 'Mangas & animés',
    emoji: '📖',
    items: [
      'One Piece', 'Naruto', 'Dragon Ball', 'L’Attaque des Titans', 'Death Note',
      'My Hero Academia', 'Demon Slayer', 'Jujutsu Kaisen', 'Fullmetal Alchemist', 'Bleach',
      'Hunter x Hunter', 'Berserk', 'Tokyo Revengers', 'Vinland Saga', 'Chainsaw Man',
    ],
  },
  {
    id: 'jeuxvideo',
    name: 'Jeux vidéo',
    emoji: '🎮',
    items: [
      'Minecraft', 'Fortnite', 'GTA V', 'Zelda', 'Mario Kart',
      'Call of Duty', 'League of Legends', 'EA FC (FIFA)', 'Elden Ring', 'The Sims',
      'Rocket League', 'Among Us', 'Valorant', 'Animal Crossing', 'Red Dead 2',
    ],
  },
  {
    id: 'sports',
    name: 'Sports',
    emoji: '🏅',
    items: [
      'Football', 'Basket', 'Tennis', 'Rugby', 'Natation',
      'Handball', 'Formule 1', 'Boxe', 'Ski', 'Escalade',
      'Volley', 'Badminton', 'Golf', 'Cyclisme', 'MMA',
    ],
  },
  {
    id: 'rappeurs',
    name: 'Rappeurs FR',
    emoji: '🎤',
    items: [
      'Jul', 'PNL', 'Ninho', 'Damso', 'Orelsan',
      'SCH', 'Booba', 'Nekfeu', 'Aya Nakamura', 'Gazo',
      'Niska', 'Vald', 'Lomepal', 'Bigflo & Oli', 'Freeze Corleone',
    ],
  },
  {
    id: 'series',
    name: 'Séries',
    emoji: '🍿',
    items: [
      'Breaking Bad', 'Game of Thrones', 'Friends', 'La Casa de Papel', 'Stranger Things',
      'The Office', 'Peaky Blinders', 'Squid Game', 'Lupin', 'The Last of Us',
      'The Witcher', 'Dark', 'Sherlock', 'Prison Break', 'Vikings',
    ],
  },
  {
    id: 'musiques',
    name: 'Genres de musique',
    emoji: '🎶',
    items: [
      'Rap', 'Rock', 'Pop', 'Électro', 'Jazz',
      'Reggae', 'Classique', 'Metal', 'Variété française', 'K-pop',
      'R&B', 'Country', 'Funk', 'Techno', 'Afrobeats',
    ],
  },
  {
    id: 'plats-fr',
    name: 'Plats français',
    emoji: '🥖',
    items: [
      'Blanquette', 'Bœuf bourguignon', 'Raclette', 'Croque-monsieur', 'Ratatouille',
      'Cassoulet', 'Quiche lorraine', 'Steak-frites', 'Tartiflette', 'Pot-au-feu',
      'Gratin dauphinois', 'Hachis parmentier', 'Moules-frites', 'Bœuf carottes', 'Fondue savoyarde',
    ],
  },
  {
    id: 'plats-monde',
    name: 'Plats du monde',
    emoji: '🌍',
    items: [
      'Sushi', 'Pizza', 'Tacos', 'Curry', 'Couscous',
      'Pad thaï', 'Paella', 'Burger', 'Kebab', 'Ramen',
      'Falafel', 'Ceviche', 'Bibimbap', 'Poutine', 'Dim sum',
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    emoji: '🍰',
    items: [
      'Tiramisu', 'Fondant au chocolat', 'Crème brûlée', 'Tarte aux pommes', 'Cheesecake',
      'Macaron', 'Éclair', 'Mousse au chocolat', 'Profiteroles', 'Crêpe',
      'Fraisier', 'Paris-Brest', 'Cookie', 'Panna cotta', 'Banana split',
    ],
  },
];

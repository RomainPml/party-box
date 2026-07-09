/**
 * Rules sheets for physical card / social drinking games.
 * The app only shows prerequisites + how to play (no interactive engine).
 * Tokens resolved by RulesScreen depending on the alcohol / no-alcohol mode:
 *   {P}       → "une gorgée" | "un gage"   (a single penalty — use "prend {P}")
 *   {gorgées} → "gorgées"    | "défis"
 * Rules are original summaries of traditional (public-domain) games.
 */

export type RulesSection = { heading: string; lines: string[] };
export type RulesGame = {
  players: string;
  material: string[];
  sections: RulesSection[];
  table?: { title: string; rows: { card: string; effect: string }[] };
};

export const RULES: Record<string, RulesGame> = {
  'ring-of-fire': {
    players: 'Idéalement 8 joueurs ou plus (plus on est, mieux c’est)',
    material: [
      'Un jeu de 52 cartes (sans les jokers)',
      'Un verre par joueur + une grande coupe pour le centre',
      'De quoi boire (ou une liste de gages)',
    ],
    sections: [
      {
        heading: 'Préparation',
        lines: [
          'Asseyez-vous autour de la table, un verre devant chacun.',
          'Un joueur étale tout le jeu en cercle au milieu de la table, et place la coupe centrale au milieu du cercle.',
          'Chacun remplit son verre de l’alcool de son choix.',
          'Un seul joueur doit connaître les règles : il peut les rappeler pendant la partie.',
        ],
      },
      {
        heading: 'Déroulement',
        lines: [
          'Chacun son tour, pioche une carte du cercle et applique son effet (voir le tableau).',
          'Certains effets (maître du pouce, fantôme, nouvelle règle) durent jusqu’à ce qu’une carte de même valeur soit repiochée.',
        ],
      },
    ],
    table: {
      title: 'Effet des cartes',
      rows: [
        { card: 'As', effect: 'Cascade : tu bois, chacun enchaîne ; personne ne s’arrête tant que la personne avant lui n’a pas fini (variante : tout le monde boit ensemble)' },
        { card: '2', effect: 'Choisir : désigne un joueur qui prend {P} avec toi' },
        { card: '3', effect: 'Moi : tu prends {P}' },
        { card: '4', effect: 'Filles : toutes les filles prennent {P}' },
        { card: '5', effect: 'Maître du pouce : jusqu’au prochain 5, pose ton pouce sur la table quand tu veux — le dernier à t’imiter prend {P}' },
        { card: '6', effect: 'Hommes : tous les gars prennent {P}' },
        { card: '7', effect: 'Ciel : pointe le ciel du doigt — le dernier à t’imiter prend {P}' },
        { card: '8', effect: 'Camarade : choisis un binôme qui prend {P} à chaque fois que tu bois' },
        { card: '9', effect: 'Rime : donne un mot, chacun rime à tour de rôle ; le premier qui bloque, répète ou traîne prend {P}' },
        { card: '10', effect: 'La liste : donne une catégorie (ex. marques de voitures) ; chacun cite un mot, le premier qui sèche ou se répète prend {P}' },
        { card: 'Valet', effect: 'Les règles : invente une règle ; quiconque l’oublie prend {P} (valable jusqu’à la fin)' },
        { card: 'Dame', effect: 'Le fantôme : jusqu’à la prochaine Dame, interdit de te parler ou de te répondre — celui qui craque prend {P}' },
        { card: 'Roi', effect: 'Verse un peu de ton verre dans la coupe centrale ; celui qui pioche le 4e Roi la boit en entier (ou relève un gros défi)' },
      ],
    },
  },

  pyramide: {
    players: '3 à 10 joueurs (idéal 4-6)',
    material: [
      'Un jeu de 52 cartes',
      'De quoi boire (ou des gages)',
      'Une table avec de l’espace au centre',
      'Une bonne mémoire… ou pas !',
    ],
    sections: [
      {
        heading: 'Phase 1 — Tes 4 cartes',
        lines: [
          'Chaque joueur reçoit 4 cartes face visible, les mémorise, puis les retourne face cachée devant lui.',
          'Interdit de les regarder à nouveau de toute la partie : tout repose sur la mémoire !',
          'Variante « Rouge ou Noir » : distribue les 4 cartes via 4 questions (Rouge/Noir · Plus/Moins · Intérieur/Extérieur · l’enseigne). Bonne réponse = tu distribues, mauvaise = tu prends.',
        ],
      },
      {
        heading: 'Phase 2 — La pyramide',
        lines: [
          'Avec le reste du paquet, montez une pyramide face cachée au centre : 5 cartes en bas, puis 4, 3, 2 et 1 au sommet (15 cartes).',
        ],
      },
      {
        heading: 'Déroulement',
        lines: [
          'Retournez les cartes de la pyramide une par une, de la base vers le sommet.',
          'Tu peux prétendre avoir la valeur révélée (« j’ai un 8 ! », la couleur n’importe pas) et distribuer les {gorgées} de l’étage à un ou plusieurs joueurs.',
          'Seule la valeur compte, et plusieurs joueurs peuvent réclamer la même carte révélée.',
        ],
      },
      {
        heading: 'Bluff & accusation',
        lines: [
          'L’accusé accepte les pénalités… ou crie « menteur ! ».',
          'Accusation juste (le distributeur bluffait) : il prend le DOUBLE. Accusation fausse (il avait bien la carte) : l’accusateur prend le DOUBLE.',
          'Pour prouver, le distributeur retourne UNE de ses 4 cartes — elle reste visible ensuite (moins à mémoriser… mais moins de bluff possible).',
        ],
      },
    ],
    table: {
      title: 'Pénalités par étage (en {gorgées})',
      rows: [
        { card: 'Base', effect: '1 — faible risque, tente le bluff' },
        { card: 'Ét. 2', effect: '2 — ça commence à compter' },
        { card: 'Ét. 3', effect: '3 — zone de danger' },
        { card: 'Ét. 4', effect: '4 — attention aux bluffs' },
        { card: 'Sommet', effect: '5 (ou cul sec) — ⚠️ ne bluffe que si tu es sûr. Accusation = le double !' },
      ],
    },
  },

  menteur: {
    players: '3 à 8 joueurs',
    material: ['Un jeu de 52 cartes'],
    sections: [
      {
        heading: 'Mise en place',
        lines: [
          'On tire au sort qui commence.',
          'Ce joueur distribue toutes les cartes entre les joueurs.',
          'Il pose une carte face visible au milieu et annonce sa famille (trèfle, pique, cœur ou carreau).',
        ],
      },
      {
        heading: 'Déroulement',
        lines: [
          'À tour de rôle, chacun pose une carte de la MÊME famille par-dessus, face cachée, en annonçant la famille.',
          'Mais tu peux mentir : annoncer « carreau » et poser un trèfle, par exemple.',
        ],
      },
      {
        heading: '« Menteur ! »',
        lines: [
          'Le joueur suivant peut crier « menteur ! » et retourner la carte du dessus.',
          'La carte est bien de la famille annoncée → l’accusateur ramasse tout le tas.',
          'La carte n’est PAS de la famille → c’est le menteur qui ramasse tout le tas.',
        ],
      },
      {
        heading: 'On repart',
        lines: [
          'Celui qui a ramassé relance : il pose une carte face visible de la famille de son choix, et ainsi de suite.',
          'Le but : se débarrasser de toutes ses cartes. En version alcool, celui qui ramasse prend aussi {P}.',
        ],
      },
    ],
  },

  'fuck-the-dealer': {
    players: '3 à 8 joueurs (idéal 4-6)',
    material: ['Un jeu de 52 cartes (sans les jokers)', 'De quoi boire (ou des gages)'],
    sections: [
      {
        heading: 'Les valeurs',
        lines: [
          'As = 1, les cartes 2 à 10 valent leur chiffre, Valet = 11, Dame = 12, Roi = 13. On devine des chiffres, pas des figures.',
        ],
      },
      {
        heading: 'Mise en place',
        lines: [
          'Chacun tire une carte : la plus petite devient le premier Dealer.',
          'Mélangez et posez le paquet face cachée au centre. Le Dealer joue contre tous les autres.',
        ],
      },
      {
        heading: 'Le tour d’un joueur',
        lines: [
          'Le Dealer demande au joueur à sa gauche de deviner la VALEUR de la carte du dessus (la couleur n’importe pas).',
          'Juste du premier coup → c’est le Dealer qui prend 4 {gorgées}.',
          'Sinon, le Dealer indique « plus » ou « moins », puis le joueur retente.',
          '2e tentative juste → le Dealer prend 2 {gorgées}.',
          '2e tentative fausse → le joueur prend l’écart entre sa réponse et la vraie valeur (il dit 6, c’était 10 → 4 {gorgées}).',
        ],
      },
      {
        heading: 'Révéler & tourner',
        lines: [
          'Retournez la carte face visible et rangez-la par valeur avec les autres : tout le monde voit ce qui est déjà sorti (la mémoire, c’est la clé !).',
          'Le Dealer passe ensuite au joueur suivant, à sa gauche.',
        ],
      },
      {
        heading: 'Changer de donneur',
        lines: [
          'Dès que 3 joueurs consécutifs ratent leur carte, le paquet passe au suivant (sens horaire) : nouveau Dealer.',
        ],
      },
      {
        heading: 'La règle du débile',
        lines: [
          'Si tu annonces une valeur dont les 4 cartes sont déjà face visible sur la table, tu proposes un impossible : 5 {gorgées} de pénalité !',
        ],
      },
    ],
  },

  purple: {
    players: '2 joueurs et plus',
    material: [
      'Un jeu de 52 cartes',
      'Des pénalités à définir avant de jouer (gorgées, gages ou points)',
    ],
    sections: [
      {
        heading: 'But',
        lines: [
          'Deviner correctement la carte suivante pour construire la plus longue série possible. Mais plus ta pile est longue, plus la chute fait mal…',
        ],
      },
      {
        heading: 'Mise en place',
        lines: [
          'Mélangez le jeu et posez-le face cachée au centre de la table.',
          'Fixez les pénalités avant de commencer.',
          'Désignez le premier joueur (au hasard ou par âge).',
        ],
      },
      {
        heading: 'Les prédictions',
        lines: [
          'Rouge ou Noir (toujours dispo) : la prochaine carte sera rouge (♥ ♦) ou noire (♠ ♣). 50/50, l’option la plus sûre.',
          'Purple (le coup risqué) : les 2 prochaines cartes seront de couleurs différentes (une rouge ET une noire, peu importe l’ordre). Réussi → +2 cartes d’un coup ; une seule qui ne colle pas → perdu.',
          'Plus ou Moins (dès la 2e carte) : la prochaine sera plus haute ou plus basse que la dernière de ta pile. As = 1, Valet = 11, Dame = 12, Roi = 13. Égalité = erreur.',
        ],
      },
      {
        heading: 'Déroulement d’un tour',
        lines: [
          'Annonce ta prédiction à voix haute, puis retourne la carte (ou les deux si Purple).',
          'Correct : pose la carte devant toi (ta pile grandit). Tu continues… ou tu t’arrêtes (après 3 bonnes prédictions minimum).',
          'Faux : tu prends autant de {gorgées} que de cartes dans ta pile, tu la défausses, et c’est au suivant.',
        ],
      },
      {
        heading: 'S’arrêter à temps',
        lines: [
          'Après au moins 3 bonnes prédictions, tu peux t’arrêter volontairement.',
          'Tu distribues alors autant de {gorgées} que de cartes dans ta pile (ou tu marques les points), puis tu défausses et passes ton tour.',
        ],
      },
    ],
  },

  'camino-de-la-muerte': {
    players: '2 joueurs et plus (dont un maître du jeu)',
    material: ['Un jeu de 52 cartes (sans les jokers)'],
    sections: [
      {
        heading: 'Mise en place (le maître du jeu)',
        lines: [
          'Dispose les cartes face cachée sur au moins 3 niveaux de 3 colonnes.',
          'Ajoute une carte tout au début et une tout à la fin du chemin.',
        ],
      },
      {
        heading: 'But',
        lines: [
          'Chacun son tour, traverser le chemin sans jamais retourner une tête (Valet, Dame ou Roi).',
        ],
      },
      {
        heading: 'Déroulement',
        lines: [
          'On retourne d’abord la carte de départ.',
          'Puis le joueur choisit son chemin : il retourne une carte par niveau, en avançant vers la fin.',
          'S’il tombe sur une tête, il prend autant de {gorgées} que le niveau atteint (départ = 1, niveau 2 = 2, niveau 3 = 3…).',
          'Après une tête, il recommence du début — il continue jusqu’à traverser tout le chemin sans tête.',
          'Chemin réussi jusqu’à la carte de fin : au joueur suivant !',
        ],
      },
    ],
  },
};

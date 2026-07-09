import type { ComponentType } from 'react';

import type { GameMeta } from '@/data/games';
import { ActionVerite } from '@/games/action-verite/ActionVerite';
import { Bombe } from '@/games/bombe/Bombe';
import { CadavreExquis } from '@/games/cadavre-exquis/CadavreExquis';
import { Cherche } from '@/games/cherche/Cherche';
import { Designation } from '@/games/designation/Designation';
import { DeuxVerites } from '@/games/deux-verites/DeuxVerites';
import { DevineTete } from '@/games/devine-tete/DevineTete';
import { Imposteur } from '@/games/imposteur/Imposteur';
import { JeNaiJamais } from '@/games/je-nai-jamais/JeNaiJamais';
import { Paranoia } from '@/games/paranoia/Paranoia';
import { Picolo } from '@/games/picolo/Picolo';
import { TierList } from '@/games/tier-list/TierList';
import { TimesUp } from '@/games/times-up/TimesUp';
import { TuPreferes } from '@/games/tu-preferes/TuPreferes';
import { Undercover } from '@/games/undercover/Undercover';

export type GameComponent = ComponentType<{ game: GameMeta }>;

/** Maps a game id to its playable component. Missing ids fall back to placeholder. */
export const GAME_COMPONENTS: Record<string, GameComponent> = {
  'action-verite': ActionVerite,
  'tu-preferes': TuPreferes,
  'je-nai-jamais': JeNaiJamais,
  'qui-pourrait': Designation,
  'qui-parmi-nous': Designation,
  'deux-verites': DeuxVerites,
  'imposteur': Imposteur,
  'undercover': Undercover,
  'cherche': Cherche,
  'devine-tete': DevineTete,
  'times-up': TimesUp,
  'tier-list': TierList,
  'picolo': Picolo,
  'la-bombe': Bombe,
  'paranoia': Paranoia,
  'cadavre-exquis': CadavreExquis,
};

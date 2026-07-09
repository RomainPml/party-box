import { useCallback, useMemo, useState } from 'react';

import type { Player } from '@/store/useGameStore';

/** Round-robin turn rotation over the player list. */
export function usePlayerTurn(players: Player[]) {
  const [index, setIndex] = useState(0);

  const current = players.length ? players[index % players.length] : undefined;

  const others = useMemo(
    () => players.filter((p) => p.id !== current?.id).map((p) => p.name),
    [players, current?.id],
  );

  const advance = useCallback(() => {
    setIndex((i) => (players.length ? (i + 1) % players.length : 0));
  }, [players.length]);

  return { current, others, advance, index };
}

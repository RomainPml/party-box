import { useCallback, useEffect, useRef, useState } from 'react';

/** Fisher–Yates shuffle (pure, returns a new array). */
export function shuffle<T>(input: T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type DeckState<T> = { pool: T[]; current: T | null; drawn: number };

/**
 * Draws cards without repetition; reshuffles the full set when exhausted,
 * avoiding an immediate repeat of the last card shown.
 * `items` must be a stable reference (module-level constant).
 */
export function useDeck<T>(items: T[]) {
  const [state, setState] = useState<DeckState<T>>(() => {
    const s = shuffle(items);
    return { pool: s.slice(1), current: s[0] ?? null, drawn: s.length ? 1 : 0 };
  });

  const next = useCallback(() => {
    setState((prev) => {
      let pool = prev.pool;
      if (pool.length === 0) {
        let refill = shuffle(items);
        if (refill.length > 1 && refill[0] === prev.current) {
          refill = [...refill.slice(1), refill[0]];
        }
        pool = refill;
      }
      const [head, ...rest] = pool;
      return { pool: rest, current: head ?? prev.current, drawn: prev.drawn + 1 };
    });
  }, [items]);

  // Re-seed when the source deck changes (e.g. switching Soft ↔ Hardcore).
  // `items` must be a stable per-variant reference (module-level constants).
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const s = shuffle(items);
    setState({ pool: s.slice(1), current: s[0] ?? null, drawn: s.length ? 1 : 0 });
  }, [items]);

  return { current: state.current, next, drawn: state.drawn, total: items.length };
}

/**
 * Replaces {moi} with the current player and {autre} with a random other player.
 */
export function fillTemplate(text: string, me?: string, others: string[] = []): string {
  let out = text;
  if (me) out = out.replace(/\{moi\}/g, me);
  if (out.includes('{autre}')) {
    const pick = others.length ? others[Math.floor(Math.random() * others.length)] : 'quelqu’un';
    out = out.replace(/\{autre\}/g, pick);
  }
  return out;
}

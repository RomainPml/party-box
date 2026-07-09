import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

/**
 * Heads-up style tilt detection for Devine-tête.
 * Tilt the phone screen-down → "found"; screen-up → "pass".
 * Re-arms once the phone returns near vertical (|z| small), so one tilt = one action.
 * No-ops on web (sensor unreliable / permission-gated) — tap zones are the fallback.
 */
export function useTilt(
  active: boolean,
  onFound: () => void,
  onPass: () => void,
) {
  const armed = useRef(true);
  const cbFound = useRef(onFound);
  const cbPass = useRef(onPass);
  cbFound.current = onFound;
  cbPass.current = onPass;

  useEffect(() => {
    if (!active || Platform.OS === 'web') return;
    let sub: { remove: () => void } | undefined;
    let cancelled = false;

    (async () => {
      try {
        const available = await Accelerometer.isAvailableAsync();
        if (!available || cancelled) return;
        Accelerometer.setUpdateInterval(120);
        sub = Accelerometer.addListener(({ z }) => {
          if (armed.current) {
            if (z < -0.6) {
              armed.current = false;
              cbFound.current();
            } else if (z > 0.6) {
              armed.current = false;
              cbPass.current();
            }
          } else if (Math.abs(z) < 0.25) {
            armed.current = true;
          }
        });
      } catch {
        // sensor unavailable — silently rely on tap fallback
      }
    })();

    return () => {
      cancelled = true;
      try {
        sub?.remove();
      } catch {}
    };
  }, [active]);
}

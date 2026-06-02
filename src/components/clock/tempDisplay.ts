// Shared rule for showing temperature on the clock page. Feels-like is the
// decision-relevant number (it drives how you dress), so it becomes the hero
// value. The air temperature is only surfaced as a secondary when the two
// diverge enough to matter — on a calm day where they match, a single number
// keeps the kiosk glanceable.

// Minimum gap (°C, rounded) before the air temperature is shown alongside
// feels-like.
const DIVERGENCE_THRESHOLD = 3;

export interface TempDisplay {
  /** Rounded value to show as the large primary number. */
  hero: number;
  /** True when `hero` is feels-like (label it); false when it's air temp. */
  isFeelsLike: boolean;
  /** Rounded air temperature, shown as a secondary when `showActual`. */
  actual: number;
  /** Whether to surface the air temperature next to the hero. */
  showActual: boolean;
}

export function getTempDisplay(temp: number, feelsLike?: number): TempDisplay {
  const actual = Math.round(temp);

  if (feelsLike === undefined) {
    return { hero: actual, isFeelsLike: false, actual, showActual: false };
  }

  const hero = Math.round(feelsLike);
  return {
    hero,
    isFeelsLike: true,
    actual,
    showActual: Math.abs(hero - actual) >= DIVERGENCE_THRESHOLD,
  };
}

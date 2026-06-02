import type { WeatherData } from '@/types/weather';

/**
 * The mascot fox's outfit/pose, chosen to reflect the current weather and time
 * of day. Each value maps to one or more sprites. A single mood wins per the
 * precedence in getFoxMood.
 */
export type FoxMood =
  | 'snowy'
  | 'stormy'
  | 'rainy'
  | 'cold'
  | 'hot'
  | 'sunny'
  | 'windy'
  | 'foggy'
  | 'sleepy'
  | 'morning'
  | 'cloudy'
  | 'mild';

/**
 * Pick the fox's mood from current conditions and the time of day.
 *
 * Precedence (first match wins): notable weather comes first so the fox always
 * reflects anything worth dressing for — snow/deep-cold, thunderstorm, rain,
 * cold, heat, strong sun, wind, fog. Only when the weather is unremarkable does
 * the time of day take over (sleepy at night, stretching in the morning),
 * falling back to an overcast or plain-mild fox.
 *
 * Driven by feels-like (falling back to air temp) plus the nearest hour's UV
 * and wind, mirroring the same signals the cards use.
 */
export function getFoxMood(weather: WeatherData, now: Date = new Date()): FoxMood {
  const { condition, temp, feelsLike } = weather.current;
  const effectiveTemp = feelsLike ?? temp;
  const uvIndex = weather.hourly[0]?.uvIndex ?? 0;
  const windSpeed = weather.hourly[0]?.windSpeed ?? 0;
  const hour = now.getHours();

  // Notable weather — always takes priority over time of day.
  if (condition === 'snow' || effectiveTemp <= -5) return 'snowy';
  if (condition === 'thunderstorm') return 'stormy';
  if (condition === 'rain' || condition === 'heavy-rain') return 'rainy';
  if (effectiveTemp < 8) return 'cold';
  if (effectiveTemp >= 30) return 'hot';
  if (uvIndex >= 6) return 'sunny';
  if (windSpeed >= 30) return 'windy';
  if (condition === 'fog') return 'foggy';

  // Calm weather — let the time of day give the fox some personality.
  if (hour >= 21 || hour < 6) return 'sleepy';
  if (hour < 9) return 'morning';
  if (condition === 'cloudy') return 'cloudy';
  return 'mild';
}

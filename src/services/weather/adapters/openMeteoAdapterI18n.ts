import type { Translations } from '@/types/i18n';

/**
 * Get translated description for weather code
 */
export function getWeatherDescription(code: number, t: Translations): string {
  const descriptions: Record<number, keyof Translations['weather']> = {
    0: 'clearSky',
    1: 'mostlyClear',
    2: 'partlyCloudy',
    3: 'overcast',
    45: 'fog',
    48: 'freezingFog',
    51: 'lightDrizzle',
    53: 'moderateDrizzle',
    55: 'heavyDrizzle',
    61: 'lightRain',
    63: 'moderateRain',
    65: 'heavyRain',
    71: 'lightSnow',
    73: 'moderateSnow',
    75: 'heavySnow',
    77: 'snowGrains',
    80: 'lightShowers',
    81: 'moderateShowers',
    82: 'heavyShowers',
    85: 'lightSnowShowers',
    86: 'heavySnowShowers',
    95: 'thunderstorm',
    96: 'thunderstormLightHail',
    99: 'thunderstormHeavyHail',
  };

  const key = descriptions[code];
  return key ? t.weather[key] : t.weather.variableConditions;
}

/**
 * Get translated day label (Mon, Tue, etc.) from date
 */
export function getDayLabel(dateString: string, t: Translations): string {
  // Parse as UTC noon to avoid timezone shift issues
  const date = new Date(dateString + 'T12:00:00Z');
  const dayKeys: Array<keyof Translations['days']> = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const dayKey = dayKeys[date.getDay()];
  return t.days[dayKey];
}

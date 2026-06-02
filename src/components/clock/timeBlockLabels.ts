import type { Translations } from '@/types/i18n';
import type { WeatherCondition } from '@/types/weather';
import type { ClothingItem } from '@/services/clothing/types';
import { TimeBlockPeriod } from '@/services/timeBlock/types';

/**
 * Translated, human-readable name for a clothing item. Falls back to the item's
 * English name (never the raw id) if no translation key is registered.
 */
export function translateClothingItem(t: Translations, item: ClothingItem): string {
  const idToKeyMap: Record<string, keyof typeof t.clothing> = {
    'winter-hat': 'winterHat',
    'neck-warmer': 'neckWarmer',
    'mittens-gloves': 'mittensGloves',
    'winter-coat': 'winterCoat',
    'snow-pants': 'snowPants',
    'winter-boots': 'winterBoots',
    'thin-hat': 'lightHat',
    'thin-gloves': 'lightGloves',
    'mid-season-coat': 'midSeasonJacket',
    'mid-season-pants': 'regularPants',
    'rain-winter-boots': 'winterRainBoots',
    'light-coat-vest': 'lightJacketVest',
    'casual-pants': 'casualPants',
    'outdoor-shoes': 'outdoorShoes',
    'light-long-sleeve': 'lightLongSleeve',
    'light-pants': 'lightPants',
    'cap-hat': 'capHat',
    'short-sleeve': 'shortSleeve',
    'shorts-skirt': 'shortsSkirt',
    sunscreen: 'sunscreen',
    umbrella: 'umbrella',
  };

  const translationKey = idToKeyMap[item.id];
  return translationKey ? t.clothing[translationKey] : item.name;
}

/**
 * Short period label (e.g. "Morning"), prefixed with "Tomorrow" when the block
 * is for the next day.
 */
export function getTimeBlockLabel(
  t: Translations,
  period: TimeBlockPeriod,
  isNextDay: boolean
): string {
  let periodName = '';
  switch (period) {
    case TimeBlockPeriod.MORNING:
      periodName = t.timeBlocks.morning.split(' ')[0];
      break;
    case TimeBlockPeriod.AFTERNOON:
      periodName = t.timeBlocks.afternoon.split(' ')[0];
      break;
    case TimeBlockPeriod.EVENING:
      periodName = t.timeBlocks.evening.split(' ')[0];
      break;
    default:
      return '';
  }

  if (isNextDay) {
    return `${t.timeBlocks.tomorrow} ${periodName.toLowerCase()}`;
  }

  return periodName;
}

/**
 * Localized label for a 3-day outlook card: "Tomorrow" for the first day, then
 * the weekday name (Mon, Tue, ...) for the rest. The date is parsed at UTC noon
 * to avoid a timezone shift flipping the weekday.
 */
export function getDayCardLabel(t: Translations, date: string, isTomorrow: boolean): string {
  if (isTomorrow) {
    return t.timeBlocks.tomorrow;
  }
  const weekdayKeys: (keyof typeof t.days)[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const dayIndex = new Date(date + 'T12:00:00Z').getUTCDay();
  return t.days[weekdayKeys[dayIndex]];
}

/**
 * Translated WHO exposure level for a UV index value (Low / Moderate / High /
 * Very high / Extreme).
 */
export function translateUvLevel(t: Translations, uvIndex: number): string {
  if (uvIndex < 3) return t.uvLevels.low;
  if (uvIndex < 6) return t.uvLevels.moderate;
  if (uvIndex < 8) return t.uvLevels.high;
  if (uvIndex < 11) return t.uvLevels.veryHigh;
  return t.uvLevels.extreme;
}

/**
 * Translated label for one of the 8 normalized weather conditions.
 */
export function translateCondition(t: Translations, condition: WeatherCondition): string {
  const map: Record<WeatherCondition, keyof typeof t.conditions> = {
    clear: 'clear',
    'partly-cloudy': 'partlyCloudy',
    cloudy: 'cloudy',
    rain: 'rain',
    'heavy-rain': 'heavyRain',
    thunderstorm: 'thunderstorm',
    snow: 'snow',
    fog: 'fog',
  };
  return t.conditions[map[condition]];
}

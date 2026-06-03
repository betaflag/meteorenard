import type { Language, Translations } from '@/types/i18n';
import type { WeatherCondition, HourlyWeather } from '@/types/weather';
import type { ClothingItem } from '@/services/clothing/types';
import type { TimeBlockData, DayForecastData, DayDetailExtra } from '@/services/timeBlock/types';
import { getTimeBlockLabel, getDayCardLabel } from './timeBlockLabels';

/**
 * Normalized weather detail shown by the detail dialog. Built from either a time
 * block or a forecast day, so the dialog stays agnostic to the source. `title`
 * and `subtitle` are pre-localized; `condition`, `uvIndex`, and `clothingItems`
 * stay raw so the dialog can translate them reactively.
 */
export interface WeatherDetail {
  title: string;
  subtitle: string;
  condition: WeatherCondition;
  temperature: number;
  feelsLike?: number;
  tempHigh?: number;
  tempLow?: number;
  snowAccumulation?: number;
  precipitationProbability?: number;
  windSpeed?: number;
  humidity?: number;
  uvIndex?: number;
  hours: HourlyWeather[];
  clothingItems: ClothingItem[];
}

/** Format a 24-hour value as a compact 12-hour label (e.g. 17 -> "5 pm"). */
export function formatHour(hour: number): string {
  const suffix = hour >= 12 ? 'pm' : 'am';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display} ${suffix}`;
}

/** Build the detail view-model for a time block. */
export function timeBlockToDetail(t: Translations, block: TimeBlockData): WeatherDetail {
  return {
    title: getTimeBlockLabel(t, block.period, block.isNextDay),
    subtitle: `${formatHour(block.startHour)} – ${formatHour(block.endHour)}`,
    condition: block.condition,
    temperature: block.temperature,
    feelsLike: block.feelsLike,
    tempHigh: block.tempHigh,
    tempLow: block.tempLow,
    snowAccumulation: block.snowAccumulation,
    precipitationProbability: block.precipitationProbability,
    windSpeed: block.windSpeed,
    humidity: block.humidity,
    uvIndex: block.uvIndex,
    hours: block.hours,
    clothingItems: block.clothingItems,
  };
}

/**
 * Build the detail view-model for a forecast day. Daily values (high/low,
 * condition, precip, clothing) come from the card data; the hourly-derived
 * extras (feels-like, wind, humidity, UV, hourly strip) come from `extra`, which
 * is empty for days beyond the hourly forecast window.
 */
export function dayToDetail(
  t: Translations,
  language: Language,
  day: DayForecastData,
  extra: DayDetailExtra
): WeatherDetail {
  const locale = language === 'fr' ? 'fr-CA' : 'en-CA';
  const subtitle = new Date(day.date + 'T12:00:00').toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return {
    title: getDayCardLabel(t, day.date, day.isTomorrow),
    subtitle,
    condition: day.condition,
    temperature: day.tempHigh,
    feelsLike: extra.feelsLike,
    tempHigh: day.tempHigh,
    tempLow: day.tempLow,
    precipitationProbability: day.precipitationProbability,
    windSpeed: extra.windSpeed,
    humidity: extra.humidity,
    uvIndex: extra.uvIndex,
    hours: extra.hours,
    clothingItems: day.clothingItems,
  };
}

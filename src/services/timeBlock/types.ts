import type { WeatherCondition, HourlyWeather } from '@/types/weather';
import type { ClothingItem } from '@/services/clothing/types';

/**
 * Time block periods of the day
 */
export const TimeBlockPeriod = {
  MORNING: 'MORNING',
  AFTERNOON: 'AFTERNOON',
  EVENING: 'EVENING',
} as const;

export type TimeBlockPeriod = typeof TimeBlockPeriod[keyof typeof TimeBlockPeriod];

/**
 * Configuration for a time block
 */
export interface TimeBlockConfig {
  period: TimeBlockPeriod;
  label: string; // French label
  startHour: number; // 24-hour format (0-23)
  endHour: number; // 24-hour format (0-23)
}

/**
 * Weather and clothing data for a specific time block
 */
export interface TimeBlockData {
  period: TimeBlockPeriod;
  label: string; // e.g., "8h-12h"
  startHour: number;
  endHour: number;
  temperature: number; // Average temperature across the block
  condition: WeatherCondition;
  precipitationProbability?: number;
  snowAccumulation?: number; // Snow accumulation in cm
  clothingItems: ClothingItem[]; // Recommended clothing
  isNextDay: boolean; // Whether this block is for tomorrow
  // Detail fields derived from the block's hourly data (absent on daily-estimate fallback)
  feelsLike?: number;
  windSpeed?: number;
  humidity?: number;
  tempHigh?: number;
  tempLow?: number;
  uvIndex?: number; // Peak UV index across the block
  hours: HourlyWeather[]; // Hourly forecasts within the block ([] when none matched)
}

/**
 * Weather and clothing data for a single upcoming day, used by the 3-day
 * outlook tiles. Derived from the daily forecast, which has no hourly series
 * (so no UV/feels-like/wind), unlike {@link TimeBlockData}.
 */
export interface DayForecastData {
  date: string; // ISO date from DailyWeather
  isTomorrow: boolean; // True for the first day (the daily forecast starts tomorrow)
  tempHigh: number;
  tempLow: number;
  condition: WeatherCondition;
  precipitationProbability?: number;
  clothingItems: ClothingItem[]; // Recommended for the day's low temperature
}

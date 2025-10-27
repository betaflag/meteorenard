import type { WeatherCondition } from '@/types/weather';
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
  temperature: number; // Temperature at start of block
  condition: WeatherCondition;
  precipitationProbability?: number;
  clothingItems: ClothingItem[]; // Recommended clothing
  isNextDay: boolean; // Whether this block is for tomorrow
}

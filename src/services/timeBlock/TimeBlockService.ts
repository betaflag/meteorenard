import type { WeatherData, HourlyWeather } from '@/types/weather';
import type { TimeBlockConfig, TimeBlockData } from './types';
import { TimeBlockPeriod as Period } from './types';
import { ClothingRecommendationService } from '../clothing/ClothingRecommendationService';

/**
 * Time block configurations
 */
const TIME_BLOCKS: TimeBlockConfig[] = [
  {
    period: Period.MORNING,
    label: '8h-12h',
    startHour: 8,
    endHour: 12,
  },
  {
    period: Period.AFTERNOON,
    label: '12h-17h',
    startHour: 12,
    endHour: 17,
  },
  {
    period: Period.EVENING,
    label: '18h-22h',
    startHour: 18,
    endHour: 22,
  },
];

/**
 * Service for managing time blocks and weather-based clothing recommendations
 */
export class TimeBlockService {
  /**
   * Get the current time block based on current hour
   * @param currentHour - Current hour in 24-hour format (0-23)
   * @returns Index of current time block, or 0 if outside blocks
   */
  static getCurrentTimeBlockIndex(currentHour: number): number {
    for (let i = 0; i < TIME_BLOCKS.length; i++) {
      const block = TIME_BLOCKS[i];
      if (currentHour >= block.startHour && currentHour < block.endHour) {
        return i;
      }
    }
    // Outside all blocks (22:00-8:00), return first block for next day
    return 0;
  }

  /**
   * Get the next N time blocks starting from current time
   * @param count - Number of blocks to return
   * @param currentHour - Current hour (defaults to now)
   * @returns Array of time block configurations
   */
  static getNextTimeBlocks(
    count: number = 3,
    currentHour?: number
  ): Array<{ config: TimeBlockConfig; isNextDay: boolean }> {
    const now = currentHour ?? new Date().getHours();
    const currentIndex = this.getCurrentTimeBlockIndex(now);
    const result: Array<{ config: TimeBlockConfig; isNextDay: boolean }> = [];

    for (let i = 0; i < count; i++) {
      const blockIndex = (currentIndex + i) % TIME_BLOCKS.length;
      const isNextDay = currentIndex + i >= TIME_BLOCKS.length;

      result.push({
        config: TIME_BLOCKS[blockIndex],
        isNextDay,
      });
    }

    return result;
  }

  /**
   * Parse time string (e.g., "10PM", "8AM") to 24-hour format
   * @param timeString - Time in format like "10PM", "8AM"
   * @returns Hour in 24-hour format (0-23)
   */
  private static parseTimeString(timeString: string): number {
    const match = timeString.match(/(\d+)(AM|PM)/i);
    if (!match) return -1;

    let hour = parseInt(match[1], 10);
    const period = match[2].toUpperCase();

    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    return hour;
  }

  /**
   * Find hourly weather data for a specific hour
   * @param hourlyData - Array of hourly weather forecasts
   * @param targetHour - Target hour in 24-hour format
   * @returns Hourly weather data or null if not found
   */
  private static findHourlyDataForHour(
    hourlyData: HourlyWeather[],
    targetHour: number
  ): HourlyWeather | null {
    for (const hourly of hourlyData) {
      const hour = this.parseTimeString(hourly.time);
      if (hour === targetHour) {
        return hourly;
      }
    }
    return null;
  }

  /**
   * Map weather data to a time block
   * @param config - Time block configuration
   * @param hourlyData - Hourly weather forecast data
   * @param isNextDay - Whether this block is for tomorrow
   * @returns TimeBlockData with weather and clothing recommendations
   */
  private static mapWeatherToTimeBlock(
    config: TimeBlockConfig,
    hourlyData: HourlyWeather[],
    isNextDay: boolean
  ): TimeBlockData {
    // Find weather data for the start hour of this block
    const weatherAtStart = this.findHourlyDataForHour(hourlyData, config.startHour);

    // If no data found, use first available or defaults
    const temperature = weatherAtStart?.temp ?? 15;
    const condition = weatherAtStart?.condition ?? 'cloudy';
    const precipitationProbability = weatherAtStart?.precipitationProbability;

    // Get clothing recommendations based on temperature
    const clothingItems = ClothingRecommendationService.getRecommendations(temperature);

    return {
      period: config.period,
      label: config.label,
      startHour: config.startHour,
      endHour: config.endHour,
      temperature,
      condition,
      precipitationProbability,
      clothingItems,
      isNextDay,
    };
  }

  /**
   * Get time blocks with weather data and clothing recommendations
   * @param weatherData - Weather data from API
   * @param currentHour - Current hour (defaults to now)
   * @returns Array of 3 TimeBlockData objects
   */
  static getTimeBlocksWithWeather(
    weatherData: WeatherData | null,
    currentHour?: number
  ): TimeBlockData[] {
    if (!weatherData || !weatherData.hourly || weatherData.hourly.length === 0) {
      // Return empty blocks with default data
      return this.getNextTimeBlocks(3, currentHour).map(({ config, isNextDay }) =>
        this.mapWeatherToTimeBlock(config, [], isNextDay)
      );
    }

    const nextBlocks = this.getNextTimeBlocks(3, currentHour);

    return nextBlocks.map(({ config, isNextDay }) =>
      this.mapWeatherToTimeBlock(config, weatherData.hourly, isNextDay)
    );
  }
}

import type { WeatherData, HourlyWeather, WeatherCondition } from '@/types/weather';
import type { TimeBlockConfig, TimeBlockData } from './types';
import { TimeBlockPeriod as Period } from './types';
import { ClothingRecommendationService } from '../clothing/ClothingRecommendationService';

/**
 * Time block configurations
 */
const TIME_BLOCKS: TimeBlockConfig[] = [
  {
    period: Period.MORNING,
    label: 'Morning (8am-12pm)',
    startHour: 8,
    endHour: 12,
  },
  {
    period: Period.AFTERNOON,
    label: 'Afternoon (12pm-5pm)',
    startHour: 12,
    endHour: 17,
  },
  {
    period: Period.EVENING,
    label: 'Evening (6pm-10pm)',
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
   * Get average weather data for a time block range
   * @param hourlyData - Array of hourly weather forecasts
   * @param startHour - Start hour in 24-hour format
   * @param endHour - End hour in 24-hour format
   * @returns Average weather data for the block or null if no data found
   */
  private static getAverageWeatherForBlock(
    hourlyData: HourlyWeather[],
    startHour: number,
    endHour: number
  ): { temp: number; condition: WeatherCondition; precipitationProbability?: number } | null {
    const relevantData: HourlyWeather[] = [];

    for (const hourly of hourlyData) {
      const hour = this.parseTimeString(hourly.time);
      if (hour >= startHour && hour < endHour) {
        relevantData.push(hourly);
      }
    }

    if (relevantData.length === 0) {
      return null;
    }

    // Calculate average temperature
    const avgTemp = relevantData.reduce((sum, h) => sum + h.temp, 0) / relevantData.length;

    // Use the most common condition, or the first one
    const condition = relevantData[0].condition;

    // Average precipitation probability if available
    const precipVals = relevantData
      .map(h => h.precipitationProbability)
      .filter((p): p is number => p !== undefined);
    const precipitationProbability = precipVals.length > 0
      ? precipVals.reduce((sum, p) => sum + p, 0) / precipVals.length
      : undefined;

    return {
      temp: avgTemp,
      condition,
      precipitationProbability,
    };
  }

  /**
   * Map weather data to a time block
   * @param config - Time block configuration
   * @param hourlyData - Hourly weather forecast data
   * @param isNextDay - Whether this block is for tomorrow
   * @param weatherData - Full weather data including current and daily
   * @param preschoolMode - If true, adjusts clothing recommendations for children aged 2-5 years
   * @returns TimeBlockData with weather and clothing recommendations
   */
  private static mapWeatherToTimeBlock(
    config: TimeBlockConfig,
    hourlyData: HourlyWeather[],
    isNextDay: boolean,
    weatherData: WeatherData | null,
    preschoolMode: boolean = false
  ): TimeBlockData {
    // Get average weather data for this time block range
    const avgWeather = this.getAverageWeatherForBlock(
      hourlyData,
      config.startHour,
      config.endHour
    );

    // If no data found in range, try to find data for the start hour
    let temperature: number;
    let condition: WeatherCondition;
    let precipitationProbability: number | undefined;

    if (avgWeather) {
      temperature = avgWeather.temp;
      condition = avgWeather.condition;
      precipitationProbability = avgWeather.precipitationProbability;
    } else {
      // Fallback to looking for start hour specifically
      const weatherAtStart = this.findHourlyDataForHour(hourlyData, config.startHour);

      if (weatherAtStart) {
        temperature = weatherAtStart.temp;
        condition = weatherAtStart.condition;
        precipitationProbability = weatherAtStart.precipitationProbability;
      } else {
        // Ultimate fallback: use current temperature or daily forecast
        if (weatherData?.current && !isNextDay) {
          temperature = weatherData.current.temp;
          condition = weatherData.current.condition;
        } else if (weatherData?.daily && weatherData.daily.length > 0) {
          const dayIndex = isNextDay ? 1 : 0;
          const dayData = weatherData.daily[dayIndex];
          // Estimate based on time of day
          if (config.startHour >= 12 && config.startHour < 17) {
            // Afternoon: use high temp
            temperature = dayData.tempHigh;
          } else if (config.startHour >= 8 && config.startHour < 12) {
            // Morning: use average of low and high
            temperature = (dayData.tempLow + dayData.tempHigh) / 2;
          } else {
            // Evening: use between average and low
            temperature = dayData.tempLow + (dayData.tempHigh - dayData.tempLow) * 0.3;
          }
          condition = dayData.condition;
          precipitationProbability = dayData.precipitationProbability;
        } else {
          temperature = 15;
          condition = 'cloudy';
        }
      }
    }

    // Get clothing recommendations based on temperature
    const clothingItems = ClothingRecommendationService.getRecommendations(temperature, preschoolMode);

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
   * @param preschoolMode - If true, adjusts clothing recommendations for children aged 2-5 years
   * @returns Array of 3 TimeBlockData objects
   */
  static getTimeBlocksWithWeather(
    weatherData: WeatherData | null,
    currentHour?: number,
    preschoolMode: boolean = false
  ): TimeBlockData[] {
    if (!weatherData || !weatherData.hourly || weatherData.hourly.length === 0) {
      // Return empty blocks with default data
      return this.getNextTimeBlocks(3, currentHour).map(({ config, isNextDay }) =>
        this.mapWeatherToTimeBlock(config, [], isNextDay, weatherData, preschoolMode)
      );
    }

    const nextBlocks = this.getNextTimeBlocks(3, currentHour);

    return nextBlocks.map(({ config, isNextDay }) =>
      this.mapWeatherToTimeBlock(config, weatherData.hourly, isNextDay, weatherData, preschoolMode)
    );
  }
}

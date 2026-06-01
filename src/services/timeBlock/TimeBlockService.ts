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
 * A time block anchored to a concrete calendar date.
 */
interface TimeBlockInstance {
  config: TimeBlockConfig;
  start: Date;
  end: Date;
  isNextDay: boolean;
}

/**
 * Service for managing time blocks and weather-based clothing recommendations
 */
export class TimeBlockService {
  /**
   * Build the next `count` time blocks as concrete date ranges starting from `now`.
   *
   * A block is included if it has not fully ended yet, so the block currently in
   * progress is kept. Blocks are generated chronologically across today and the
   * following days, which avoids the gaps that a fixed-index approach has at
   * 17:00 and overnight (22:00-08:00).
   *
   * @param now - Reference time
   * @param count - Number of blocks to return
   * @returns Concrete, chronologically ordered block instances
   */
  private static getUpcomingBlockInstances(now: Date, count: number): TimeBlockInstance[] {
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();

    const instances: TimeBlockInstance[] = [];

    for (let dayOffset = 0; instances.length < count && dayOffset < 4; dayOffset++) {
      for (const config of TIME_BLOCKS) {
        const start = new Date(today);
        start.setDate(today.getDate() + dayOffset);
        start.setHours(config.startHour, 0, 0, 0);

        const end = new Date(start);
        end.setHours(config.endHour, 0, 0, 0);

        if (end.getTime() <= now.getTime()) {
          continue; // Block already over
        }

        const blockDay = new Date(start);
        blockDay.setHours(0, 0, 0, 0);

        instances.push({
          config,
          start,
          end,
          isNextDay: blockDay.getTime() !== todayMs,
        });

        if (instances.length >= count) break;
      }
    }

    return instances;
  }

  /**
   * Average the hourly forecasts that fall within a concrete datetime range.
   *
   * Matching on absolute timestamps (not clock hour) is what keeps today's and
   * tomorrow's hours from being mixed together when the rolling forecast window
   * spans the same clock hours across midnight.
   *
   * @param hourlyData - Array of hourly weather forecasts
   * @param start - Block start (inclusive)
   * @param end - Block end (exclusive)
   * @returns Averaged weather data for the range, or null if no hours match
   */
  private static getAverageWeatherForRange(
    hourlyData: HourlyWeather[],
    start: Date,
    end: Date
  ): { temp: number; condition: WeatherCondition; precipitationProbability?: number; snowAccumulation?: number } | null {
    const startMs = start.getTime();
    const endMs = end.getTime();

    const relevantData = hourlyData.filter((hourly) => {
      if (!hourly.isoTime) return false;
      const t = new Date(hourly.isoTime).getTime();
      return t >= startMs && t < endMs;
    });

    if (relevantData.length === 0) {
      return null;
    }

    const avgTemp = relevantData.reduce((sum, h) => sum + h.temp, 0) / relevantData.length;

    // Use the first hour's condition as representative of the block
    const condition = relevantData[0].condition;

    const precipVals = relevantData
      .map((h) => h.precipitationProbability)
      .filter((p): p is number => p !== undefined);
    const precipitationProbability = precipVals.length > 0
      ? precipVals.reduce((sum, p) => sum + p, 0) / precipVals.length
      : undefined;

    let snowAccumulation: number | undefined;
    if (condition === 'snow') {
      const snowVals = relevantData
        .map((h) => h.precipitation)
        .filter((p): p is number => p !== undefined && p > 0);
      if (snowVals.length > 0) {
        // Sum precipitation (in mm) and convert to cm
        const totalSnowMm = snowVals.reduce((sum, p) => sum + p, 0);
        snowAccumulation = totalSnowMm / 10;
      }
    }

    return {
      temp: avgTemp,
      condition,
      precipitationProbability,
      snowAccumulation,
    };
  }

  /**
   * Estimate a block's weather from the daily forecast when no hourly data is
   * available (e.g., a block beyond the hourly forecast window).
   */
  private static estimateFromDaily(
    instance: TimeBlockInstance,
    weatherData: WeatherData | null
  ): { temp: number; condition: WeatherCondition; precipitationProbability?: number } {
    const { config, isNextDay } = instance;

    if (weatherData?.daily && weatherData.daily.length > 0) {
      const dayIndex = isNextDay ? 1 : 0;
      const dayData = weatherData.daily[Math.min(dayIndex, weatherData.daily.length - 1)];

      let temperature: number;
      if (config.startHour >= 12 && config.startHour < 17) {
        temperature = dayData.tempHigh; // Afternoon: daily high
      } else if (config.startHour >= 8 && config.startHour < 12) {
        temperature = (dayData.tempLow + dayData.tempHigh) / 2; // Morning: mid
      } else {
        temperature = dayData.tempLow + (dayData.tempHigh - dayData.tempLow) * 0.3; // Evening: cooler
      }

      return {
        temp: temperature,
        condition: dayData.condition,
        precipitationProbability: dayData.precipitationProbability,
      };
    }

    return { temp: 15, condition: 'cloudy' };
  }

  /**
   * Map a concrete time block instance to its weather and clothing data.
   */
  private static mapWeatherToTimeBlock(
    instance: TimeBlockInstance,
    weatherData: WeatherData | null,
    preschoolMode: boolean
  ): TimeBlockData {
    const { config, isNextDay } = instance;
    const hourlyData = weatherData?.hourly ?? [];

    const avgWeather = this.getAverageWeatherForRange(hourlyData, instance.start, instance.end);

    let temperature: number;
    let condition: WeatherCondition;
    let precipitationProbability: number | undefined;
    let snowAccumulation: number | undefined;

    if (avgWeather) {
      temperature = avgWeather.temp;
      condition = avgWeather.condition;
      precipitationProbability = avgWeather.precipitationProbability;
      snowAccumulation = avgWeather.snowAccumulation;
    } else {
      const estimate = this.estimateFromDaily(instance, weatherData);
      temperature = estimate.temp;
      condition = estimate.condition;
      precipitationProbability = estimate.precipitationProbability;
    }

    const clothingItems = ClothingRecommendationService.getRecommendations(temperature, preschoolMode);

    return {
      period: config.period,
      label: config.label,
      startHour: config.startHour,
      endHour: config.endHour,
      temperature,
      condition,
      precipitationProbability,
      snowAccumulation,
      clothingItems,
      isNextDay,
    };
  }

  /**
   * Get the next 3 time blocks with weather data and clothing recommendations.
   *
   * @param weatherData - Weather data from API
   * @param now - Reference time (defaults to current time)
   * @param preschoolMode - If true, adjusts clothing recommendations for children aged 2-5 years
   * @returns Array of 3 TimeBlockData objects
   */
  static getTimeBlocksWithWeather(
    weatherData: WeatherData | null,
    now: Date = new Date(),
    preschoolMode: boolean = false
  ): TimeBlockData[] {
    return this.getUpcomingBlockInstances(now, 3).map((instance) =>
      this.mapWeatherToTimeBlock(instance, weatherData, preschoolMode)
    );
  }
}

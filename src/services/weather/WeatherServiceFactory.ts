import type { IWeatherService } from './IWeatherService';
import { OpenMeteoService } from './OpenMeteoService';
import { MSCGeoMetService } from './MSCGeoMetService';
import { weatherConfig } from '@/config/weather.config';

/**
 * Factory for creating weather service instances
 *
 * This factory uses the strategy pattern to allow easy switching
 * between different weather API providers.
 *
 * To switch providers, simply update the `activeProvider` setting
 * in `src/config/weather.config.ts`.
 */
export class WeatherServiceFactory {
  /**
   * Create a weather service instance based on the active provider configuration
   */
  static create(): IWeatherService {
    switch (weatherConfig.activeProvider) {
      case 'open-meteo':
        return new OpenMeteoService();

      case 'msc-geomet':
        return new MSCGeoMetService();

      default:
        throw new Error(
          `Unknown weather provider: ${weatherConfig.activeProvider}`
        );
    }
  }

  /**
   * Get the name of the currently active provider
   */
  static getActiveProviderName(): string {
    return WeatherServiceFactory.create().getProviderName();
  }
}

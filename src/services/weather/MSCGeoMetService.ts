import type { IWeatherService } from './IWeatherService';
import type { WeatherData } from '@/types/weather';
import type { MSCGeoMetResponse } from './adapters/mscGeoMetTypes';
import { adaptMSCGeoMetResponse } from './adapters/mscGeoMetAdapter';
import { weatherConfig } from '@/config/weather.config';

/**
 * Environment Canada Weather Service
 * Uses api.weather.gc.ca OGC API for weather data
 */
export class MSCGeoMetService implements IWeatherService {
  private readonly location: typeof weatherConfig.location;
  private readonly cityCode: string;
  private readonly baseUrl: string;

  constructor() {
    this.location = weatherConfig.location;
    // Montreal's city code for Environment Canada API
    this.cityCode = 'qc-147';
    this.baseUrl = 'https://api.weather.gc.ca';
  }

  async fetchWeather(): Promise<WeatherData> {
    try {
      // Use Environment Canada's OGC API - no CORS proxy needed!
      const url = `${this.baseUrl}/collections/citypageweather-realtime/items/${this.cityCode}?f=json&lang=en-CA`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Environment Canada API error: ${response.status} ${response.statusText}`
        );
      }

      const data: MSCGeoMetResponse = await response.json();

      return adaptMSCGeoMetResponse(data, this.location.name);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to fetch weather from Environment Canada: ${error.message}`
        );
      }
      throw new Error('Failed to fetch weather from Environment Canada: Unknown error');
    }
  }

  getProviderName(): string {
    return 'Environnement Canada';
  }
}

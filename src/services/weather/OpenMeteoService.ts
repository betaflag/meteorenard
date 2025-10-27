import type { IWeatherService } from './IWeatherService';
import type { WeatherData } from '@/types/weather';
import type { OpenMeteoResponse } from './adapters/openMeteoTypes';
import { adaptOpenMeteoResponse } from './adapters/openMeteoAdapter';
import { weatherConfig } from '@/config/weather.config';

export class OpenMeteoService implements IWeatherService {
  private readonly baseUrl: string;
  private readonly location: typeof weatherConfig.location;

  constructor() {
    this.baseUrl = weatherConfig.apis.openMeteo.baseUrl;
    this.location = weatherConfig.location;
  }

  async fetchWeather(): Promise<WeatherData> {
    try {
      const params = new URLSearchParams({
        latitude: this.location.latitude.toString(),
        longitude: this.location.longitude.toString(),
        current_weather: 'true',
        hourly: 'temperature_2m,weathercode,apparent_temperature,relativehumidity_2m,windspeed_10m,precipitation_probability',
        daily: 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max',
        timezone: 'America/Montreal',
        forecast_days: '10',
      });

      const url = `${this.baseUrl}${weatherConfig.apis.openMeteo.forecast}?${params}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Open-Meteo API error: ${response.status} ${response.statusText}`
        );
      }

      const data: OpenMeteoResponse = await response.json();

      return adaptOpenMeteoResponse(data, this.location.name);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch weather from Open-Meteo: ${error.message}`);
      }
      throw new Error('Failed to fetch weather from Open-Meteo: Unknown error');
    }
  }

  getProviderName(): string {
    return 'Open-Meteo';
  }
}

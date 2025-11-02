import type { IWeatherService } from './IWeatherService';
import type { WeatherData } from '@/types/weather';
import type { Location } from '@/types/location';
import type { OpenMeteoResponse } from './adapters/openMeteoTypes';
import { adaptOpenMeteoResponse } from './adapters/openMeteoAdapter';
import { weatherConfig } from '@/config/weather.config';

export class OpenMeteoService implements IWeatherService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = weatherConfig.apis.openMeteo.baseUrl;
  }

  async fetchWeather(location: Location): Promise<WeatherData> {
    try {
      const params = new URLSearchParams({
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        current_weather: 'true',
        hourly: 'temperature_2m,weathercode,apparent_temperature,relativehumidity_2m,windspeed_10m,precipitation_probability,precipitation',
        daily: 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max',
        timezone: 'auto',
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

      return adaptOpenMeteoResponse(data, location.name);
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

import type { WeatherData } from '@/types/weather';

export interface IWeatherService {
  /**
   * Fetch current weather and hourly forecast for the configured location
   * @returns Promise resolving to WeatherData
   * @throws Error if the API request fails
   */
  fetchWeather(): Promise<WeatherData>;

  /**
   * Get the name of this weather service provider
   */
  getProviderName(): string;
}

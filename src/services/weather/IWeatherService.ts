import type { WeatherData } from '@/types/weather';
import type { Location } from '@/types/location';

export interface IWeatherService {
  /**
   * Fetch current weather and hourly forecast for a location
   * @param location - Location to fetch weather for
   * @returns Promise resolving to WeatherData
   * @throws Error if the API request fails
   */
  fetchWeather(location: Location): Promise<WeatherData>;

  /**
   * Get the name of this weather service provider
   */
  getProviderName(): string;
}

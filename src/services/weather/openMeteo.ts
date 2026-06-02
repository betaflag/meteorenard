import type { WeatherData } from '@/types/weather';
import type { Location } from '@/types/location';
import type { OpenMeteoResponse } from './adapters/openMeteoTypes';
import { adaptOpenMeteoResponse } from './adapters/openMeteoAdapter';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

/** Fetch and normalize the Open-Meteo forecast for a location. */
export async function fetchWeather(location: Location): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current_weather: 'true',
    hourly:
      'temperature_2m,weathercode,apparent_temperature,relativehumidity_2m,windspeed_10m,precipitation_probability,precipitation,uv_index',
    daily: 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,sunrise,sunset',
    timezone: 'auto',
    forecast_days: '10',
  });

  let response: Response;
  try {
    response = await fetch(`${FORECAST_URL}?${params}`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'network error';
    throw new Error(`Failed to fetch weather from Open-Meteo: ${reason}`);
  }

  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status} ${response.statusText}`);
  }

  const data: OpenMeteoResponse = await response.json();
  return adaptOpenMeteoResponse(data, location.name);
}

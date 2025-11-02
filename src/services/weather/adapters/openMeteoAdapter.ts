import type { WeatherData, WeatherCondition } from '@/types/weather';
import type { OpenMeteoResponse } from './openMeteoTypes';

/**
 * Map WMO weather codes to our WeatherCondition types
 */
function mapWeatherCode(code: number): WeatherCondition {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'rain';
  if (code >= 61 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 84) return 'heavy-rain';
  if (code >= 85 && code <= 86) return 'snow';
  if (code >= 95 && code <= 99) return 'thunderstorm';
  return 'cloudy'; // default fallback
}

/**
 * Get English description for weather code
 */
function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mostly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Freezing fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Heavy drizzle',
    61: 'Light rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Light snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Light showers',
    81: 'Moderate showers',
    82: 'Heavy showers',
    85: 'Light snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with light hail',
    99: 'Thunderstorm with heavy hail',
  };

  return descriptions[code] || 'Variable conditions';
}

/**
 * Format time from ISO string to 12-hour format (e.g., 10PM, 1AM)
 */
function formatTime(isoString: string): string {
  const date = new Date(isoString);
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}${ampm}`;
}

/**
 * Get day label (Mon, Tue, etc.) from date
 */
function getDayLabel(dateString: string): string {
  // Parse as UTC noon to avoid timezone shift issues
  const date = new Date(dateString + 'T12:00:00Z');
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayNames[date.getDay()];
}

/**
 * Convert Open-Meteo API response to our WeatherData format
 */
export function adaptOpenMeteoResponse(
  response: OpenMeteoResponse,
  locationName: string
): WeatherData {
  const currentWeatherCode = response.current_weather.weathercode;
  const currentTemp = Math.round(response.current_weather.temperature);

  // Get next 24 hours of forecast for chart, and 8 hours for widget
  const now = new Date();
  const hourlyDataFull = response.hourly.time
    .map((time, index) => ({
      time,
      temp: Math.round(response.hourly.temperature_2m[index]),
      weathercode: response.hourly.weathercode[index],
      feelsLike: Math.round(response.hourly.apparent_temperature[index]),
      humidity: response.hourly.relativehumidity_2m[index],
      windSpeed: Math.round(response.hourly.windspeed_10m[index]),
      precipitationProbability: response.hourly.precipitation_probability[index],
      precipitation: response.hourly.precipitation[index],
    }))
    .filter((hour) => new Date(hour.time) >= now);

  // Take first 24 hours for the hourly forecast widget
  const hourlyData = hourlyDataFull.slice(0, 24).map((hour) => ({
    time: formatTime(hour.time),
    temp: hour.temp,
    condition: mapWeatherCode(hour.weathercode),
    feelsLike: hour.feelsLike,
    humidity: hour.humidity,
    windSpeed: hour.windSpeed,
    precipitationProbability: hour.precipitationProbability,
    precipitation: hour.precipitation,
  }));

  // Get 10-day daily forecast (skip today, start from tomorrow)
  const dailyData = response.daily.time
    .map((date, index) => ({
      date,
      dayLabel: getDayLabel(date),
      tempLow: Math.round(response.daily.temperature_2m_min[index]),
      tempHigh: Math.round(response.daily.temperature_2m_max[index]),
      condition: mapWeatherCode(response.daily.weathercode[index]),
      precipitationProbability: response.daily.precipitation_probability_max[index],
    }))
    .slice(1, 11); // Skip index 0 (today), take days 1-10

  return {
    current: {
      location: locationName,
      temp: currentTemp,
      condition: mapWeatherCode(currentWeatherCode),
      description: getWeatherDescription(currentWeatherCode),
    },
    hourly: hourlyData,
    daily: dailyData,
  };
}

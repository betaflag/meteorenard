export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rain'
  | 'heavy-rain'
  | 'thunderstorm'
  | 'snow'
  | 'fog';

export interface HourlyWeather {
  time: string; // Display label in 12-hour format (e.g., "10PM")
  isoTime: string; // Absolute timestamp for date-aware matching
  temp: number;
  condition: WeatherCondition;
  feelsLike?: number;
  humidity?: number;
  windSpeed?: number;
  precipitationProbability?: number;
  precipitation?: number; // in mm
}

export interface CurrentWeather {
  location: string;
  temp: number;
  condition: WeatherCondition;
  description: string;
}

export interface DailyWeather {
  date: string;
  dayLabel: string;
  tempLow: number;
  tempHigh: number;
  condition: WeatherCondition;
  precipitationProbability?: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
}

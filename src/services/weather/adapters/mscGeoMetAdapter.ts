import type { WeatherData, WeatherCondition, DailyWeather } from '@/types/weather';
import type { MSCGeoMetResponse, MSCForecastPeriod } from './mscGeoMetTypes';

/**
 * Map Environment Canada condition descriptions to our WeatherCondition types
 */
function mapConditionToWeatherCondition(condition: string): WeatherCondition {
  const lowerCondition = condition.toLowerCase();

  if (
    lowerCondition.includes('clear') ||
    lowerCondition.includes('sunny') ||
    lowerCondition.includes('dégagé') ||
    lowerCondition.includes('ensoleillé')
  ) {
    return 'clear';
  }

  if (
    lowerCondition.includes('partly cloudy') ||
    lowerCondition.includes('partly sunny') ||
    lowerCondition.includes('mix of sun and cloud') ||
    lowerCondition.includes('mainly') ||
    lowerCondition.includes('partiellement nuageux') ||
    lowerCondition.includes('plutôt')
  ) {
    return 'partly-cloudy';
  }

  if (
    lowerCondition.includes('cloudy') ||
    lowerCondition.includes('overcast') ||
    lowerCondition.includes('nuageux') ||
    lowerCondition.includes('couvert')
  ) {
    return 'cloudy';
  }

  if (
    lowerCondition.includes('thunderstorm') ||
    lowerCondition.includes('thunder') ||
    lowerCondition.includes('orage')
  ) {
    return 'thunderstorm';
  }

  if (
    lowerCondition.includes('heavy rain') ||
    lowerCondition.includes('forte pluie') ||
    lowerCondition.includes('showers')
  ) {
    return 'heavy-rain';
  }

  if (lowerCondition.includes('rain') || lowerCondition.includes('pluie')) {
    return 'rain';
  }

  if (lowerCondition.includes('snow') || lowerCondition.includes('neige')) {
    return 'snow';
  }

  if (
    lowerCondition.includes('fog') ||
    lowerCondition.includes('mist') ||
    lowerCondition.includes('brouillard') ||
    lowerCondition.includes('brume')
  ) {
    return 'fog';
  }

  return 'cloudy';
}

/**
 * Keep English condition text as-is (no translation needed)
 */
function translateCondition(condition: string): string {
  // Return condition as-is for English UI
  return condition;
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
 * Get abbreviated day label from forecast period name
 */
function getDayLabel(periodName: string): string {
  const dayMap: Record<string, string> = {
    Sunday: 'Sun',
    Monday: 'Mon',
    Tuesday: 'Tue',
    Wednesday: 'Wed',
    Thursday: 'Thu',
    Friday: 'Fri',
    Saturday: 'Sat',
    Tonight: "Tonight",
  };

  // Check if the period name starts with any of the English day names
  for (const [english, abbreviated] of Object.entries(dayMap)) {
    if (periodName.includes(english)) {
      return abbreviated;
    }
  }

  return periodName;
}

/**
 * Convert Environment Canada API response to our WeatherData format
 */
export function adaptMSCGeoMetResponse(
  response: MSCGeoMetResponse,
  locationName: string
): WeatherData {
  const props = response.properties;
  const current = props.currentConditions;

  // Current weather - condition is an object with en/fr properties
  const currentCondition = mapConditionToWeatherCondition(current.condition.en);

  // Hourly forecast (take up to 24 hours)
  const hourly = props.hourlyForecastGroup.hourlyForecasts
    .slice(0, 24)
    .map((hour) => ({
      time: formatTime(hour.timestamp),
      temp: Math.round(hour.temperature.value.en),
      condition: mapConditionToWeatherCondition(hour.condition.en),
      feelsLike: undefined, // Not available in EC API
      humidity: undefined, // Not available in EC hourly forecast
      windSpeed: undefined, // Not available in EC hourly forecast
      precipitationProbability: hour.lop?.value.en, // Likelihood of precipitation
    }));

  // Daily forecast - group by day (skip night periods for daily view)
  const daily: DailyWeather[] = [];
  const processedDays = new Set<string>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  props.forecastGroup.forecasts.forEach((period: MSCForecastPeriod, index: number) => {
    // Skip tonight and night periods
    const periodName = period.period.textForecastName.en;
    if (periodName.toLowerCase().includes('night')) {
      return;
    }

    const dayLabel = getDayLabel(periodName);

    // Avoid duplicates
    if (processedDays.has(dayLabel) || daily.length >= 10) {
      return;
    }

    // Find high and low temperatures
    const temps = period.temperatures?.temperature || [];
    const high = temps.find((t) => t.class.en === 'high');
    const low = temps.find((t) => t.class.en === 'low');

    // Also check the next period (night) for the low temperature
    const nextPeriod = props.forecastGroup.forecasts[index + 1];
    const nextTemps = nextPeriod?.temperatures?.temperature || [];
    const nextLow = nextTemps.find((t) => t.class.en === 'low');

    const tempHigh = high?.value.en ?? current.temperature.value.en;
    const tempLow = low?.value.en ?? nextLow?.value.en ?? current.temperature.value.en;

    // Get condition from cloudPrecip or abbreviatedForecast
    const conditionText =
      period.cloudPrecip?.en ||
      period.abbreviatedForecast?.textSummary.en ||
      period.textSummary?.en ||
      current.condition.en;

    // Calculate date
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + daily.length + 1);

    daily.push({
      date: forecastDate.toISOString().split('T')[0],
      dayLabel,
      tempLow: Math.round(tempLow),
      tempHigh: Math.round(tempHigh),
      condition: mapConditionToWeatherCondition(conditionText),
      precipitationProbability: undefined, // EC API doesn't provide this in a simple format
    });

    processedDays.add(dayLabel);
  });

  return {
    current: {
      location: locationName,
      temp: Math.round(current.temperature.value.en),
      condition: currentCondition,
      description: translateCondition(current.condition.en),
    },
    hourly,
    daily,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { WeatherWidget } from './components/weather/WeatherWidget';
import { HourlyChartWidget } from './components/weather/HourlyChartWidget';
import { DailyForecastWidget } from './components/weather/DailyForecastWidget';
import { ProviderToggle } from './components/weather/ProviderToggle';
import { WeatherServiceFactory } from './services/weather/WeatherServiceFactory';
import { weatherConfig, type WeatherProvider } from './config/weather.config';
import type { WeatherData } from './types/weather';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<WeatherProvider>(
    weatherConfig.activeProvider
  );

  const fetchWeatherData = useCallback(
    async (provider: WeatherProvider) => {
      try {
        setIsLoading(true);
        setError(null);

        // Temporarily update the config to use the selected provider
        const originalProvider = weatherConfig.activeProvider;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (weatherConfig as any).activeProvider = provider;

        const weatherService = WeatherServiceFactory.create();
        const data = await weatherService.fetchWeather();

        setWeatherData(data);

        // Restore original if needed
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (weatherConfig as any).activeProvider = originalProvider;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch weather data';
        setError(errorMessage);
        console.error('Weather fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleProviderChange = useCallback(
    (provider: WeatherProvider) => {
      setActiveProvider(provider);
      fetchWeatherData(provider);
    },
    [fetchWeatherData]
  );

  useEffect(() => {
    // Fetch weather data on mount
    fetchWeatherData(activeProvider);

    // Set up periodic refresh
    const intervalId = setInterval(
      () => fetchWeatherData(activeProvider),
      weatherConfig.refreshInterval
    );

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [activeProvider, fetchWeatherData]);

  return (
    <div className="min-h-screen p-0 md:p-8">
      {/* Provider Toggle at top */}
      <div className="flex justify-end px-4 py-4 md:px-0 md:py-0 md:pb-4 max-w-[1400px] mx-auto">
        <ProviderToggle
          activeProvider={activeProvider}
          onProviderChange={handleProviderChange}
        />
      </div>

      {/* Widgets Container */}
      <div className="flex flex-col gap-6 items-start justify-center">
        {/* Current Weather Widget */}
        <WeatherWidget
          data={weatherData}
          isLoading={isLoading}
          error={error}
          onRetry={() => fetchWeatherData(activeProvider)}
        />

        {/* Hourly Chart Widget */}
        <HourlyChartWidget data={weatherData} />

        {/* 10-Day Forecast Widget */}
        <DailyForecastWidget data={weatherData} />
      </div>
    </div>
  );
}

export default App;

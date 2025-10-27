import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { WeatherWidget } from './components/weather/WeatherWidget';
import { HourlyChartWidget } from './components/weather/HourlyChartWidget';
import { DailyForecastWidget } from './components/weather/DailyForecastWidget';
import { ClothingForecastWidget } from './components/weather/ClothingForecastWidget';
import { LocationPermissionDialog } from './components/location/LocationPermissionDialog';
import { CitySearchDialog } from './components/location/CitySearchDialog';
import { WeatherServiceFactory } from './services/weather/WeatherServiceFactory';
import { LocationStorageService } from './services/location/LocationStorageService';
import { weatherConfig, type WeatherProvider } from './config/weather.config';
import type { WeatherData } from './types/weather';
import type { Location } from './types/location';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<WeatherProvider>(
    weatherConfig.activeProvider
  );

  // Location state
  const [currentLocation, setCurrentLocation] = useState<Location>(() =>
    LocationStorageService.getCurrentLocation()
  );
  const [savedLocations, setSavedLocations] = useState<Location[]>(() =>
    LocationStorageService.getSavedLocations()
  );
  const [showLocationPermissionDialog, setShowLocationPermissionDialog] = useState(false);
  const [showCitySearchDialog, setShowCitySearchDialog] = useState(false);

  // Check if we should show location permission dialog on first visit
  useEffect(() => {
    const hasRequested = LocationStorageService.hasRequestedPermission();
    if (!hasRequested) {
      setShowLocationPermissionDialog(true);
    }
  }, []);

  const fetchWeatherData = useCallback(
    async (provider: WeatherProvider, location: Location) => {
      try {
        setIsLoading(true);
        setError(null);

        // Temporarily update the config to use the selected provider
        const originalProvider = weatherConfig.activeProvider;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (weatherConfig as any).activeProvider = provider;

        const weatherService = WeatherServiceFactory.create();
        const data = await weatherService.fetchWeather(location);

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

  // Handle location changes
  const handleLocationChange = useCallback(
    (location: Location) => {
      setCurrentLocation(location);
      LocationStorageService.setCurrentLocation(location);
      fetchWeatherData(activeProvider, location);
    },
    [activeProvider, fetchWeatherData]
  );

  // Handle adding a location
  const handleLocationAdd = useCallback((location: Location) => {
    const updated = LocationStorageService.addLocation(location);
    setSavedLocations(updated);
  }, []);

  // Handle removing a location
  const handleLocationRemove = useCallback((locationName: string) => {
    const updated = LocationStorageService.removeLocation(locationName);
    setSavedLocations(updated);
  }, []);

  // Handle geolocation success from permission dialog
  const handleGeolocationSuccess = useCallback(
    (location: Location) => {
      LocationStorageService.setPermissionRequested();
      setShowLocationPermissionDialog(false);
      handleLocationChange(location);
      handleLocationAdd(location);
    },
    [handleLocationChange, handleLocationAdd]
  );

  // Handle manual city selection from permission dialog
  const handleManualSelection = useCallback(() => {
    LocationStorageService.setPermissionRequested();
    setShowLocationPermissionDialog(false);
    setShowCitySearchDialog(true);
  }, []);

  // Handle city selection from search dialog
  const handleCitySelection = useCallback(
    (location: Location) => {
      handleLocationChange(location);
      handleLocationAdd(location);
    },
    [handleLocationChange, handleLocationAdd]
  );

  const handleProviderChange = useCallback(
    (provider: WeatherProvider) => {
      setActiveProvider(provider);
      fetchWeatherData(provider, currentLocation);
    },
    [fetchWeatherData, currentLocation]
  );

  useEffect(() => {
    // Fetch weather data on mount and when location or provider changes
    fetchWeatherData(activeProvider, currentLocation);

    // Set up periodic refresh
    const intervalId = setInterval(
      () => fetchWeatherData(activeProvider, currentLocation),
      weatherConfig.refreshInterval
    );

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [activeProvider, currentLocation, fetchWeatherData]);

  return (
    <>
      {/* Header */}
      <Header
        activeProvider={activeProvider}
        onProviderChange={handleProviderChange}
        currentLocation={currentLocation}
        savedLocations={savedLocations}
        onLocationChange={handleLocationChange}
        onLocationAdd={handleLocationAdd}
        onLocationRemove={handleLocationRemove}
      />

      {/* Main Content */}
      <div className="min-h-screen pt-[76px] sm:pt-[84px] p-0 md:px-8 md:pb-8">
        {/* Widgets Container */}
        <div className="flex flex-col gap-6 items-start justify-center px-1 md:px-0">
        {/* Current Weather Widget */}
        <WeatherWidget
          data={weatherData}
          isLoading={isLoading}
          error={error}
          onRetry={() => fetchWeatherData(activeProvider, currentLocation)}
        />

        {/* Clothing Forecast Widget */}
        <ClothingForecastWidget data={weatherData} />

        {/* Hourly Chart Widget */}
        <HourlyChartWidget data={weatherData} />

        {/* 10-Day Forecast Widget */}
        <DailyForecastWidget data={weatherData} />
        </div>
      </div>

      {/* Location Permission Dialog (First Visit) */}
      <LocationPermissionDialog
        open={showLocationPermissionDialog}
        onLocationSelected={handleGeolocationSuccess}
        onManualSelection={handleManualSelection}
      />

      {/* City Search Dialog */}
      <CitySearchDialog
        open={showCitySearchDialog}
        onOpenChange={setShowCitySearchDialog}
        onCitySelected={handleCitySelection}
      />
    </>
  );
}

export default App;

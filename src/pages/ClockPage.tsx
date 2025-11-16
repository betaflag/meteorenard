import { useState, useEffect, useCallback } from 'react';
import { ClockDisplay } from '@/components/clock/ClockDisplay';
import { ClockTimeBlockCard } from '@/components/clock/ClockTimeBlockCard';
import { LocationPermissionDialog } from '@/components/location/LocationPermissionDialog';
import { CitySearchDialog } from '@/components/location/CitySearchDialog';
import { TimeBlockService } from '@/services/timeBlock/TimeBlockService';
import { WeatherServiceFactory } from '@/services/weather/WeatherServiceFactory';
import { LocationStorageService } from '@/services/location/LocationStorageService';
import { weatherConfig } from '@/config/weather.config';
import type { WeatherData } from '@/types/weather';
import type { Location } from '@/types/location';

// Array of available steampunk backgrounds
const BACKGROUNDS = [
  '/backgrounds/steampunk-clock-bg.png',
  '/backgrounds/steampunk-clock-bg-1.png',
  '/backgrounds/steampunk-clock-bg-2.png',
  '/backgrounds/steampunk-clock-bg-3.png',
  '/backgrounds/steampunk-clock-bg-4.png',
  '/backgrounds/steampunk-clock-bg-5.png',
  '/backgrounds/steampunk-clock-bg-winter-1.png',
  '/backgrounds/steampunk-clock-bg-winter-2.png',
  '/backgrounds/steampunk-clock-bg-winter-3.png',
  '/backgrounds/steampunk-clock-bg-winter-4.png',
  '/backgrounds/steampunk-clock-bg-winter-5.png',
  '/backgrounds/steampunk-winter-cinematic-1.png',
  '/backgrounds/steampunk-winter-cinematic-2.png',
  '/backgrounds/steampunk-winter-cinematic-3.png',
  '/backgrounds/steampunk-winter-cinematic-4.png',
  '/backgrounds/steampunk-winter-cinematic-5.png',
];

// Select a random background, optionally excluding the current one
const getRandomBackground = (excludeCurrent?: string) => {
  if (excludeCurrent && BACKGROUNDS.length > 1) {
    const availableBackgrounds = BACKGROUNDS.filter(bg => bg !== excludeCurrent);
    const randomIndex = Math.floor(Math.random() * availableBackgrounds.length);
    return availableBackgrounds[randomIndex];
  }
  const randomIndex = Math.floor(Math.random() * BACKGROUNDS.length);
  return BACKGROUNDS[randomIndex];
};

export function ClockPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(() =>
    LocationStorageService.getCurrentLocation()
  );
  const [backgroundImage, setBackgroundImage] = useState<string>(() => getRandomBackground());
  const [showLocationPermissionDialog, setShowLocationPermissionDialog] = useState(false);
  const [showCitySearchDialog, setShowCitySearchDialog] = useState(false);

  const fetchWeatherData = useCallback(async (location: Location) => {
    try {
      const weatherService = WeatherServiceFactory.create();
      const data = await weatherService.fetchWeather(location);
      setWeatherData(data);
    } catch (err) {
      console.error('Weather fetch error:', err);
    }
  }, []);

  // Check if we should show location permission dialog
  useEffect(() => {
    const hasRequested = LocationStorageService.hasRequestedPermission();
    if (!currentLocation || !hasRequested) {
      setShowLocationPermissionDialog(true);
    }
  }, [currentLocation]);

  // Handle geolocation success from permission dialog
  const handleGeolocationSuccess = useCallback((location: Location) => {
    LocationStorageService.setPermissionRequested();
    setShowLocationPermissionDialog(false);
    setCurrentLocation(location);
    LocationStorageService.setCurrentLocation(location);
    LocationStorageService.addLocation(location);
  }, []);

  // Handle manual city selection from permission dialog
  const handleManualSelection = useCallback(() => {
    LocationStorageService.setPermissionRequested();
    setShowLocationPermissionDialog(false);
    setShowCitySearchDialog(true);
  }, []);

  // Handle city selection from search dialog
  const handleCitySelection = useCallback((location: Location) => {
    setCurrentLocation(location);
    LocationStorageService.setCurrentLocation(location);
    LocationStorageService.addLocation(location);
  }, []);

  useEffect(() => {
    // Only fetch weather data if we have a location
    if (!currentLocation) {
      return;
    }

    // Fetch weather data on mount
    fetchWeatherData(currentLocation);

    // Set up periodic refresh every 10 minutes
    const intervalId = setInterval(
      () => fetchWeatherData(currentLocation),
      weatherConfig.refreshInterval
    );

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [currentLocation, fetchWeatherData]);

  // Auto-rotate background every 5 minutes
  useEffect(() => {
    const backgroundIntervalId = setInterval(() => {
      setBackgroundImage(prevBackground => getRandomBackground(prevBackground));
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    // Cleanup on unmount
    return () => clearInterval(backgroundIntervalId);
  }, []);

  // Get time blocks with weather data
  const timeBlocks = weatherData
    ? TimeBlockService.getTimeBlocksWithWeather(weatherData, undefined, false)
    : [];

  // Handle tap/click to change background
  const handleBackgroundChange = () => {
    setBackgroundImage(prevBackground => getRandomBackground(prevBackground));
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden cursor-pointer"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      onClick={handleBackgroundChange}
    >
      {/* Dark overlay for better text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%)',
        }}
      />

      {/* Main Layout Container - Optimized for 1920x1200 */}
      <div
        className="relative w-full h-full flex flex-col"
        style={{
          maxWidth: '1920px',
          maxHeight: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Main Content Area - Clock and Date */}
        <div
          className="flex-1 flex flex-col items-center justify-center"
          style={{
            paddingTop: '60px',
            paddingBottom: '40px',
          }}
        >
          {/* Clock Display - Centered and Prominent */}
          <div className="text-center">
            <ClockDisplay />
          </div>
        </div>

        {/* Bottom Weather Cards Container */}
        {currentLocation && timeBlocks.length > 0 && (
          <div
            className="flex-shrink-0"
            style={{
              padding: '0 40px 40px 40px',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, transparent 100%)',
            }}
          >
            {/* Weather Cards Grid - Responsive with 3 columns on large screens */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              style={{
                gap: '24px',
                maxWidth: '1400px',
                margin: '0 auto',
              }}
            >
              {timeBlocks.slice(0, 3).map((block, index) => (
                <div
                  key={`${block.period}-${index}`}
                  style={{
                    height: '280px', // Fixed height for consistency
                  }}
                >
                  <ClockTimeBlockCard data={block} />
                </div>
              ))}
            </div>
          </div>
        )}
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
    </div>
  );
}

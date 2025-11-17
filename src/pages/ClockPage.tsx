import { useState, useEffect, useCallback } from 'react';
import { ClockDisplay } from '@/components/clock/ClockDisplay';
import { ClockTimeBlockCard } from '@/components/clock/ClockTimeBlockCard';
import { WeatherEffects } from '@/components/clock/WeatherEffects';
import { LocationPermissionDialog } from '@/components/location/LocationPermissionDialog';
import { CitySearchDialog } from '@/components/location/CitySearchDialog';
import { TimeBlockService } from '@/services/timeBlock/TimeBlockService';
import { WeatherServiceFactory } from '@/services/weather/WeatherServiceFactory';
import { LocationStorageService } from '@/services/location/LocationStorageService';
import type { WeatherData } from '@/types/weather';
import type { Location } from '@/types/location';

// Time-based background arrays
const BACKGROUNDS = {
  morning: [
    '/backgrounds/time-based/morning/morning-1.jpg',
    '/backgrounds/time-based/morning/morning-2.jpg',
    '/backgrounds/time-based/morning/morning-3.jpg',
    '/backgrounds/time-based/morning/morning-4.jpg',
    '/backgrounds/time-based/morning/morning-5.jpg',
  ],
  afternoon: [
    '/backgrounds/time-based/afternoon/afternoon-1.jpg',
    '/backgrounds/time-based/afternoon/afternoon-2.jpg',
    '/backgrounds/time-based/afternoon/afternoon-3.jpg',
    '/backgrounds/time-based/afternoon/afternoon-4.jpg',
    '/backgrounds/time-based/afternoon/afternoon-5.jpg',
  ],
  evening: [
    '/backgrounds/time-based/evening/evening-1.jpg',
    '/backgrounds/time-based/evening/evening-2.jpg',
    '/backgrounds/time-based/evening/evening-3.jpg',
    '/backgrounds/time-based/evening/evening-4.jpg',
    '/backgrounds/time-based/evening/evening-5.jpg',
  ],
  night: [
    '/backgrounds/time-based/night/night-1.jpg',
    '/backgrounds/time-based/night/night-2.jpg',
    '/backgrounds/time-based/night/night-3.jpg',
    '/backgrounds/time-based/night/night-4.jpg',
    '/backgrounds/time-based/night/night-5.jpg',
  ],
};

type TimePeriod = keyof typeof BACKGROUNDS;

// Get current time period based on hour
const getCurrentTimePeriod = (): TimePeriod => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night'; // 21-5
};

// Select a random background for current time period, optionally excluding the current one
const getRandomBackground = (excludeCurrent?: string) => {
  const period = getCurrentTimePeriod();
  const periodBackgrounds = BACKGROUNDS[period];

  if (excludeCurrent && periodBackgrounds.length > 1) {
    const availableBackgrounds = periodBackgrounds.filter(bg => bg !== excludeCurrent);
    const randomIndex = Math.floor(Math.random() * availableBackgrounds.length);
    return availableBackgrounds[randomIndex];
  }

  const randomIndex = Math.floor(Math.random() * periodBackgrounds.length);
  return periodBackgrounds[randomIndex];
};

export function ClockPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(() =>
    LocationStorageService.getCurrentLocation()
  );
  const [backgroundImage, setBackgroundImage] = useState<string>(() => getRandomBackground());
  const [showLocationPermissionDialog, setShowLocationPermissionDialog] = useState(false);
  const [showCitySearchDialog, setShowCitySearchDialog] = useState(false);
  const [forcedWeatherEffect, setForcedWeatherEffect] = useState<'rain' | 'snow' | null>(null);

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

    // Unified refresh: both background and weather every 5 minutes
    const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
    const intervalId = setInterval(() => {
      // Refresh weather data
      fetchWeatherData(currentLocation);
      // Rotate background
      setBackgroundImage(prevBackground => getRandomBackground(prevBackground));
    }, REFRESH_INTERVAL);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [currentLocation, fetchWeatherData]);

  // Get time blocks with weather data
  const timeBlocks = weatherData
    ? TimeBlockService.getTimeBlocksWithWeather(weatherData, undefined, false)
    : [];

  // Get the next time block's weather condition for effects
  const nextBlockCondition = timeBlocks.length > 0 ? timeBlocks[0].condition : null;

  // Handle clicking a time block to test weather effects
  const handleTimeBlockClick = useCallback((block: typeof timeBlocks[0]) => {
    // If block has snow accumulation, show snow effect
    if (block.snowAccumulation && block.snowAccumulation > 0) {
      setForcedWeatherEffect(prev => prev === 'snow' ? null : 'snow');
    }
    // If block has precipitation probability, show rain effect
    else if (block.precipitationProbability && block.precipitationProbability > 0) {
      setForcedWeatherEffect(prev => prev === 'rain' ? null : 'rain');
    }
  }, []);

  // Handle tap/click to change background
  const handleBackgroundChange = (e: React.MouseEvent) => {
    // Don't change background if clicking on a time block card
    const target = e.target as HTMLElement;
    if (target.closest('[data-timeblock-card]')) {
      return;
    }
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

      {/* Weather effects (rain/snow) */}
      {(forcedWeatherEffect || nextBlockCondition) && (
        <WeatherEffects condition={(forcedWeatherEffect || nextBlockCondition)!} />
      )}

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
                  data-timeblock-card
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTimeBlockClick(block);
                  }}
                  style={{
                    height: '280px', // Fixed height for consistency
                    cursor: (block.snowAccumulation && block.snowAccumulation > 0) ||
                            (block.precipitationProbability && block.precipitationProbability > 0)
                      ? 'pointer'
                      : 'default',
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

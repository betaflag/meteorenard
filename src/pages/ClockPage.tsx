import { useState, useEffect, useCallback, useRef } from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import { ClockDisplay } from '@/components/clock/ClockDisplay';
import { ClockTimeBlockCard } from '@/components/clock/ClockTimeBlockCard';
import { ClockDayCard } from '@/components/clock/ClockDayCard';
import { WeatherEffects } from '@/components/clock/WeatherEffects';
import { WeatherDetailDialog } from '@/components/clock/WeatherDetailDialog';
import { CurrentWeatherWidget } from '@/components/clock/CurrentWeatherWidget';
import { HourlyTimeline } from '@/components/clock/HourlyTimeline';
import { LocationPermissionDialog } from '@/components/location/LocationPermissionDialog';
import { CitySearchDialog } from '@/components/location/CitySearchDialog';
import { GlobePickerDialog } from '@/components/location/GlobePickerDialog';
import { TimeBlockService } from '@/services/timeBlock/TimeBlockService';
import { fetchWeather } from '@/services/weather/openMeteo';
import { LocationStorageService } from '@/services/location/LocationStorageService';
import { useLanguage } from '@/contexts/language';
import { getZonedNow } from '@/lib/time';
import {
  timeBlockToDetail,
  dayToDetail,
  type WeatherDetail,
} from '@/components/clock/weatherDetail';
import type { WeatherData } from '@/types/weather';
import type { TimeBlockData, DayForecastData } from '@/services/timeBlock/types';
import type { Location } from '@/types/location';

// Background images are organised by season and time of day. Each season/period
// folder holds 5 variants (e.g. summer/morning/morning-1.jpg).
const PERIODS = ['morning', 'afternoon', 'evening', 'night'] as const;

type Season = 'winter' | 'summer';
type TimePeriod = typeof PERIODS[number];

const buildPeriodBackgrounds = (season: Season): Record<TimePeriod, string[]> =>
  Object.fromEntries(
    PERIODS.map((period) => [
      period,
      Array.from(
        { length: 5 },
        (_, i) => `/backgrounds/time-based/${season}/${period}/${period}-${i + 1}.jpg`
      ),
    ])
  ) as Record<TimePeriod, string[]>;

const BACKGROUNDS: Record<Season, Record<TimePeriod, string[]>> = {
  winter: buildPeriodBackgrounds('winter'),
  summer: buildPeriodBackgrounds('summer'),
};

// Snow-season months (Nov–Mar) use the winter set, the rest use summer. `now` is
// the selected location's wall clock, so the season matches that location.
const getCurrentSeason = (now: Date): Season => {
  const month = now.getMonth(); // 0 = January
  return month >= 3 && month <= 9 ? 'summer' : 'winter';
};

// Get the location's time period based on its current hour
const getCurrentTimePeriod = (now: Date): TimePeriod => {
  const hour = now.getHours();
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night'; // 21-5
};

// Select a random background for the location's current season and time period,
// optionally excluding the current one
const getRandomBackground = (now: Date, excludeCurrent?: string) => {
  const periodBackgrounds = BACKGROUNDS[getCurrentSeason(now)][getCurrentTimePeriod(now)];

  if (excludeCurrent && periodBackgrounds.length > 1) {
    const availableBackgrounds = periodBackgrounds.filter(bg => bg !== excludeCurrent);
    const randomIndex = Math.floor(Math.random() * availableBackgrounds.length);
    return availableBackgrounds[randomIndex];
  }

  const randomIndex = Math.floor(Math.random() * periodBackgrounds.length);
  return periodBackgrounds[randomIndex];
};

// Frosted pill matching the top-bar buttons, used for the forecast swap control.
const swapButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  borderRadius: '9999px',
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: '#ffffff',
  cursor: 'pointer',
  appearance: 'none',
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 16px rgba(0, 0, 0, 0.35)',
};

export function ClockPage() {
  const { t, language } = useLanguage();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(() =>
    LocationStorageService.getCurrentLocation()
  );
  const [backgroundImage, setBackgroundImage] = useState<string>(() =>
    getRandomBackground(getZonedNow())
  );
  const [showLocationPermissionDialog, setShowLocationPermissionDialog] = useState(false);
  const [showCitySearchDialog, setShowCitySearchDialog] = useState(false);
  const [showGlobePicker, setShowGlobePicker] = useState(false);
  const [forecastView, setForecastView] = useState<'blocks' | 'days'>('blocks');
  const [selectedDetail, setSelectedDetail] = useState<WeatherDetail | null>(null);

  // Latest location timezone, read by the background interval/handler so their
  // closures aren't stale when the location (and its zone) changes.
  const timezoneRef = useRef<string | undefined>(undefined);
  timezoneRef.current = weatherData?.timezone;

  // Monotonic fetch counter: only the latest request may set state, so a slow
  // response for a previous location can't overwrite the current one.
  const fetchSeq = useRef(0);

  const fetchWeatherData = useCallback(async (location: Location) => {
    const seq = ++fetchSeq.current;
    try {
      const data = await fetchWeather(location);
      if (fetchSeq.current === seq) {
        setWeatherData(data);
      }
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
      // Rotate background using the location's current time
      setBackgroundImage(prevBackground =>
        getRandomBackground(getZonedNow(timezoneRef.current), prevBackground)
      );
    }, REFRESH_INTERVAL);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [currentLocation, fetchWeatherData]);

  // Get time blocks with weather data, anchored to the location's current time
  const timeBlocks = weatherData
    ? TimeBlockService.getTimeBlocksWithWeather(weatherData, getZonedNow(weatherData.timezone))
    : [];

  // Get the next 3 days for the alternate outlook view
  const dayCards = weatherData ? TimeBlockService.getDailyForecastCards(weatherData) : [];

  // Get the next time block's weather condition for effects
  const nextBlockCondition = timeBlocks.length > 0 ? timeBlocks[0].condition : null;

  // Open the detail modal for a time block or a forecast day
  const openBlockDetail = (block: TimeBlockData) => {
    setSelectedDetail(timeBlockToDetail(t, block));
  };
  const openDayDetail = (day: DayForecastData) => {
    setSelectedDetail(dayToDetail(t, language, day, TimeBlockService.getDayDetail(weatherData, day.date)));
  };

  // Handle tap/click to change background
  const handleBackgroundChange = (e: React.MouseEvent) => {
    // Don't change background if clicking on a time block card
    const target = e.target as HTMLElement;
    if (target.closest('[data-timeblock-card]')) {
      return;
    }
    setBackgroundImage(prevBackground =>
      getRandomBackground(getZonedNow(timezoneRef.current), prevBackground)
    );
  };

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col" style={{ background: '#0e111c' }}>
      {/* Photo scene region — everything except the solid bottom timeline bar */}
      <div
        className="relative flex-1 overflow-hidden cursor-pointer"
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

      {/* Ambient weather effects (rain/snow) for the upcoming block */}
      {nextBlockCondition && <WeatherEffects condition={nextBlockCondition} />}

      {/* Main Layout Container - Optimized for 1920x1200 */}
      <div
        className="relative w-full h-full flex flex-col"
        style={{
          maxWidth: '1920px',
          maxHeight: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Top Bar - Location pill, and the fox speech bubble + fox (overhangs below) */}
        {currentLocation && (
          <div className="flex-shrink-0" style={{ position: 'relative', zIndex: 20, padding: '32px 40px 0 40px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <CurrentWeatherWidget
                location={currentLocation}
                weather={weatherData}
                onLocationClick={() => setShowCitySearchDialog(true)}
                onPlanetClick={() => setShowGlobePicker(true)}
              />
            </div>
          </div>
        )}

        {/* Main Content Area - Clock and Date */}
        <div
          className="flex-1 flex flex-col items-center justify-center"
          style={{
            paddingTop: '40px',
            paddingBottom: '40px',
          }}
        >
          {/* Clock Display - Centered and Prominent */}
          <div className="text-center">
            <ClockDisplay
              timeZone={weatherData?.timezone}
              timeZoneAbbreviation={weatherData?.timezoneAbbreviation}
            />
          </div>
        </div>

        {/* Bottom Weather Cards Container */}
        {currentLocation && (timeBlocks.length > 0 || dayCards.length > 0) && (
          <div
            className="flex-shrink-0"
            style={{
              padding: '0 40px 16px 40px',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, transparent 100%)',
            }}
          >
            {/* Swap button: flips the tiles between today's time blocks and the 3-day outlook */}
            <div style={{ maxWidth: '1400px', margin: '0 auto 16px auto', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setForecastView((view) => (view === 'blocks' ? 'days' : 'blocks'));
                }}
                aria-label={
                  forecastView === 'blocks'
                    ? 'Show the 3-day forecast'
                    : "Show today's time blocks"
                }
                className="font-raleway transition-transform hover:scale-[1.03] active:scale-95"
                style={swapButtonStyle}
              >
                {forecastView === 'blocks' ? (
                  <>
                    <CalendarDays size={18} style={{ color: '#8fd0ff' }} />
                    {t.forecastToggle.threeDay}
                  </>
                ) : (
                  <>
                    <Clock size={18} style={{ color: '#8fd0ff' }} />
                    {t.forecastToggle.today}
                  </>
                )}
              </button>
            </div>

            {/* Weather Cards Grid - Responsive with 3 columns on large screens */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              style={{
                gap: '24px',
                maxWidth: '1400px',
                margin: '0 auto',
              }}
            >
              {forecastView === 'blocks'
                ? timeBlocks.slice(0, 3).map((block, index) => (
                    <div
                      key={`${block.period}-${index}`}
                      data-timeblock-card
                      onClick={(e) => {
                        e.stopPropagation();
                        openBlockDetail(block);
                      }}
                      style={{
                        height: '280px', // Fixed height for consistency
                        cursor: 'pointer',
                      }}
                    >
                      <ClockTimeBlockCard data={block} />
                    </div>
                  ))
                : dayCards.slice(0, 3).map((day) => (
                    <div
                      key={day.date}
                      data-timeblock-card
                      onClick={(e) => {
                        e.stopPropagation();
                        openDayDetail(day);
                      }}
                      style={{
                        height: '280px',
                        cursor: 'pointer',
                      }}
                    >
                      <ClockDayCard data={day} />
                    </div>
                  ))}
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Solid full-width bottom bar with the next-24h timeline (no photo behind) */}
      {currentLocation && weatherData && (
        <div
          className="flex-shrink-0"
          style={{
            background: '#0e111c',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <HourlyTimeline weather={weatherData} />
        </div>
      )}

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

      {/* 3D Planet location picker */}
      <GlobePickerDialog
        open={showGlobePicker}
        onOpenChange={setShowGlobePicker}
        onLocationSelected={handleCitySelection}
      />

      {/* Weather detail modal (time block or forecast day) */}
      <WeatherDetailDialog detail={selectedDetail} onClose={() => setSelectedDetail(null)} />
    </div>
  );
}

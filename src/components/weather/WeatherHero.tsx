import { CurrentWeather } from './CurrentWeather';
import { HourlyForecast } from './HourlyForecast';
import { CloudOff, RefreshCw, Menu } from 'lucide-react';
import type { WeatherData } from '@/types/weather';
import type { WeatherProvider } from '@/config/weather.config';
import type { Location } from '@/types/location';
import { useMemo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppMenu } from '@/components/layout/AppMenu';
import backgroundImage1 from '@/assets/renard_steampunk_fall_ultrawide.jpg';
import backgroundImage2 from '@/assets/renard_steampunk_fall_evening.jpg';
import backgroundImage3 from '@/assets/renard_steampunk_fall_workshop.jpg';
import backgroundImage4 from '@/assets/renard_steampunk_fall_park.jpg';
import backgroundImage5 from '@/assets/renard_steampunk_fall_rooftop.jpg';

interface WeatherHeroProps {
  data: WeatherData | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  activeProvider: WeatherProvider;
  onProviderChange: (provider: WeatherProvider) => void;
  currentLocation: Location;
  savedLocations: Location[];
  onLocationChange: (location: Location) => void;
  onLocationAdd: (location: Location) => void;
  onLocationRemove: (locationName: string) => void;
}

export function WeatherHero({
  data,
  isLoading = false,
  error = null,
  onRetry,
  activeProvider,
  onProviderChange,
  currentLocation,
  savedLocations,
  onLocationChange,
  onLocationAdd,
  onLocationRemove,
}: WeatherHeroProps) {
  // Randomly select a background image (memoized so it doesn't change on re-renders)
  const backgroundImage = useMemo(() => {
    const images = [backgroundImage1, backgroundImage2, backgroundImage3, backgroundImage4, backgroundImage5];
    return images[Math.floor(Math.random() * images.length)];
  }, []);

  // Parallax scroll effect
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderContent = () => {
    // Loading state
    if (isLoading && !data) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <RefreshCw className="w-12 h-12 text-[#ff6b00] animate-spin mb-4" />
          <p className="text-[#e5e7eb] text-lg font-raleway">
            Chargement des données météo...
          </p>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CloudOff className="w-16 h-16 text-[#ff6b00]/70 mb-4" />
          <h3 className="text-[#e5e7eb] text-xl font-raleway font-semibold mb-2">
            Impossible de charger la météo
          </h3>
          <p className="text-[#a8a8a8] text-sm max-w-md mb-6 font-raleway">
            {error}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 rounded-full font-raleway font-medium text-white transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #ff6b00, #ff8c00)',
                boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3)',
              }}
            >
              Réessayer
            </button>
          )}
        </div>
      );
    }

    // No data state
    if (!data) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CloudOff className="w-16 h-16 text-[#ff6b00]/70 mb-4" />
          <p className="text-[#e5e7eb] text-lg font-raleway">
            Aucune donnée météo disponible
          </p>
        </div>
      );
    }

    // Data loaded successfully
    return (
      <>
        <CurrentWeather data={data.current} />
        <HourlyForecast data={data.hourly} />
      </>
    );
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgba(26, 26, 46, 0.7) 0%, rgba(36, 36, 56, 0.6) 50%, rgba(46, 46, 66, 0.5) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: `
          0 20px 50px rgba(0, 0, 0, 0.5),
          0 0 40px rgba(255, 107, 0, 0.15)
        `,
      }}
    >
      {/* Background image with gradient fade (more visible top-right, fades to bottom-left) */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.25,
            transform: `translateY(${scrollY * 0.35}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(225deg, transparent 0%, transparent 30%, rgba(26, 26, 46, 0.7) 60%, rgba(26, 26, 46, 0.95) 100%)',
          }}
        />
      </div>

      {/* Floating glow effect */}
      <div
        className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(circle at center, rgba(255, 107, 0, 0.15) 0%, transparent 50%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Menu Button - positioned absolutely in top-right */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 lg:top-8 lg:right-8 z-20">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="transition-all duration-300 hover:scale-105 md:hover:scale-110 p-2 md:p-3 h-auto w-auto"
              style={{
                background: 'transparent',
              }}
              aria-label="Menu"
            >
              <Menu
                className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 text-[#e5e7eb]"
                strokeWidth={2.5}
                style={{
                  filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.6))',
                }}
              />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <AppMenu
              activeProvider={activeProvider}
              onProviderChange={onProviderChange}
              currentLocation={currentLocation}
              savedLocations={savedLocations}
              onLocationChange={onLocationChange}
              onLocationAdd={onLocationAdd}
              onLocationRemove={onLocationRemove}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="relative z-10 pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-6 sm:px-8 md:px-12 lg:px-16">
        {renderContent()}
      </div>
    </section>
  );
}

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppMenu } from './AppMenu';
import { Settings } from 'lucide-react';
import renardLogo from '@/assets/renard.png';
import type { WeatherProvider } from '@/config/weather.config';
import type { Location } from '@/types/location';

interface HeaderProps {
  activeProvider: WeatherProvider;
  onProviderChange: (provider: WeatherProvider) => void;
  currentLocation: Location;
  savedLocations: Location[];
  onLocationChange: (location: Location) => void;
  onLocationAdd: (location: Location) => void;
  onLocationRemove: (locationName: string) => void;
}

export function Header({
  activeProvider,
  onProviderChange,
  currentLocation,
  savedLocations,
  onLocationChange,
  onLocationAdd,
  onLocationRemove,
}: HeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[#ff6b00]/20"
      style={{
        background:
          'linear-gradient(135deg, rgba(26, 26, 46, 0.85) 0%, rgba(36, 36, 56, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 107, 0, 0.08)',
      }}
    >
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={renardLogo}
            alt="MeteoRenard Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            style={{
              boxShadow: '0 0 15px rgba(255, 107, 0, 0.3)',
            }}
          />
          <h1 className="font-raleway font-bold text-lg sm:text-xl">
            <span className="text-[#e5e7eb]">Meteo</span>
            <span className="text-[#ff6b00]">Renard</span>
          </h1>
        </div>

        {/* Settings Button with Drawer */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="transition-all duration-300"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
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
    </header>
  );
}

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppMenu } from './AppMenu';
import { Settings } from 'lucide-react';
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
  preschoolMode: boolean;
  onPreschoolModeChange: (enabled: boolean) => void;
}

export function Header({
  activeProvider,
  onProviderChange,
  currentLocation,
  savedLocations,
  onLocationChange,
  onLocationAdd,
  onLocationRemove,
  preschoolMode,
  onPreschoolModeChange,
}: HeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full opacity-80"
      style={{
        background:
          'linear-gradient(135deg, rgba(26, 26, 46, 0.85) 0%, rgba(36, 36, 56, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 107, 0, 0.08)',
      }}
    >
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-end">
        {/* Settings Button with Drawer */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="transition-all duration-300"
              aria-label="Settings"
            >
              <Settings className="w-7 h-7" />
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
              preschoolMode={preschoolMode}
              onPreschoolModeChange={onPreschoolModeChange}
            />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

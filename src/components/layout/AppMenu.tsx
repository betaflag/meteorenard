import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ProviderToggle } from '@/components/weather/ProviderToggle';
import { LocationSelector } from '@/components/location/LocationSelector';
import type { WeatherProvider } from '@/config/weather.config';
import type { Location } from '@/types/location';
import { Settings2 } from 'lucide-react';

interface AppMenuProps {
  activeProvider: WeatherProvider;
  onProviderChange: (provider: WeatherProvider) => void;
  currentLocation: Location;
  savedLocations: Location[];
  onLocationChange: (location: Location) => void;
  onLocationAdd: (location: Location) => void;
  onLocationRemove: (locationName: string) => void;
}

export function AppMenu({
  activeProvider,
  onProviderChange,
  currentLocation,
  savedLocations,
  onLocationChange,
  onLocationAdd,
  onLocationRemove,
}: AppMenuProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <SheetHeader className="border-b border-[#ff6b00]/20 pb-4">
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-[#ff6b00]" />
          <SheetTitle>Menu</SheetTitle>
        </div>
        <SheetDescription>
          Paramètres et préférences
        </SheetDescription>
      </SheetHeader>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6">
          {/* Location Section */}
          <LocationSelector
            currentLocation={currentLocation}
            savedLocations={savedLocations}
            onLocationChange={onLocationChange}
            onLocationAdd={onLocationAdd}
            onLocationRemove={onLocationRemove}
          />

          {/* Divider */}
          <div className="border-t border-[#ff6b00]/10" />

          {/* Weather Provider Section */}
          <div>
            <h3 className="text-sm font-semibold text-[#e5e7eb] uppercase tracking-wider mb-3">
              Fournisseur météo
            </h3>
            <ProviderToggle
              activeProvider={activeProvider}
              onProviderChange={onProviderChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

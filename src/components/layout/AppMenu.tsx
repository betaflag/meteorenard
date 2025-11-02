import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ProviderToggle } from '@/components/weather/ProviderToggle';
import { LocationSelector } from '@/components/location/LocationSelector';
import { LanguageSwitcher } from '@/components/settings/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import type { WeatherProvider } from '@/config/weather.config';
import type { Location } from '@/types/location';
import renardLogo from '@/assets/renard.png';

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
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <SheetHeader className="border-b border-[#ff6b00]/20 pb-4">
        <div className="flex items-center gap-3">
          <img
            src={renardLogo}
            alt="MeteoRenard Logo"
            className="w-10 h-10 rounded-full object-cover"
            style={{
              boxShadow: '0 0 15px rgba(255, 107, 0, 0.3)',
            }}
          />
          <SheetTitle className="font-raleway font-bold text-xl">
            <span className="text-[#e5e7eb]">Meteo</span>
            <span className="text-[#ff6b00]">Renard</span>
          </SheetTitle>
        </div>
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
              {t.appMenu.weatherProvider}
            </h3>
            <ProviderToggle
              activeProvider={activeProvider}
              onProviderChange={onProviderChange}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-[#ff6b00]/10" />

          {/* Language Switcher Section */}
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}

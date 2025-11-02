import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, X } from 'lucide-react';
import { CitySearchDialog } from './CitySearchDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Location } from '@/types/location';

interface LocationSelectorProps {
  currentLocation: Location | null;
  savedLocations: Location[];
  onLocationChange: (location: Location) => void;
  onLocationAdd: (location: Location) => void;
  onLocationRemove: (locationName: string) => void;
}

export function LocationSelector({
  currentLocation,
  savedLocations,
  onLocationChange,
  onLocationAdd,
  onLocationRemove,
}: LocationSelectorProps) {
  const [showCitySearch, setShowCitySearch] = useState(false);
  const { t } = useLanguage();

  const handleCitySelected = (location: Location) => {
    onLocationAdd(location);
    onLocationChange(location);
  };

  return (
    <div className="space-y-4">
      {/* Saved Locations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#e5e7eb] uppercase tracking-wider">
            {t.appMenu.savedCities}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCitySearch(true)}
            className="h-7 gap-1 text-xs"
          >
            <Plus className="w-3 h-3" />
            {t.appMenu.add}
          </Button>
        </div>

        <div className="space-y-1">
          {savedLocations.length === 0 ? (
            <p className="text-sm text-[#a8a8a8] italic p-2">
              {t.appMenu.noSavedCities}
            </p>
          ) : (
            savedLocations.map((location) => {
              const isCurrent = currentLocation?.name === location.name;

            return (
              <div
                key={location.name}
                className={`
                  flex items-center gap-2 p-2 rounded-md transition-all
                  ${
                    isCurrent
                      ? 'border border-[#ff6b00]/30'
                      : 'border border-transparent hover:border-[#ff6b00]/20'
                  }
                `}
                style={
                  isCurrent
                    ? {
                        background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.15) 0%, rgba(255, 107, 0, 0.08) 100%)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: 'inset 0 0 0 1px rgba(255, 107, 0, 0.1)',
                      }
                    : {
                        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.3) 0%, rgba(36, 36, 56, 0.2) 100%)',
                        backdropFilter: 'blur(8px)',
                      }
                }
              >
                <button
                  onClick={() => onLocationChange(location)}
                  disabled={isCurrent}
                  className="flex-1 flex items-center gap-2 text-left"
                >
                  <MapPin
                    className={`w-3 h-3 flex-shrink-0 ${
                      isCurrent ? 'text-[#ff6b00]' : 'text-[#a8a8a8]'
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isCurrent
                        ? 'text-[#ff6b00] font-medium'
                        : 'text-[#e5e7eb]'
                    }`}
                  >
                    {location.name}
                  </span>
                </button>

                {/* Remove button - only show if it's not the current location */}
                {!isCurrent && (
                  <button
                    onClick={() => onLocationRemove(location.name)}
                    className="p-1 hover:bg-[#ff6b00]/10 rounded transition-colors"
                    title={t.location.removeCity}
                  >
                    <X className="w-3 h-3 text-[#a8a8a8] hover:text-[#ff6b00]" />
                  </button>
                )}
              </div>
            );
            })
          )}
        </div>
      </div>

      {/* City Search Dialog */}
      <CitySearchDialog
        open={showCitySearch}
        onOpenChange={setShowCitySearch}
        onCitySelected={handleCitySelected}
      />
    </div>
  );
}

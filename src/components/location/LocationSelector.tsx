import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, X } from 'lucide-react';
import { CitySearchDialog } from './CitySearchDialog';
import type { Location } from '@/types/location';

interface LocationSelectorProps {
  currentLocation: Location;
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

  const handleCitySelected = (location: Location) => {
    onLocationAdd(location);
    onLocationChange(location);
  };

  return (
    <div className="space-y-4">
      {/* Current Location */}
      <div>
        <h3 className="text-sm font-semibold text-[#e5e7eb] uppercase tracking-wider mb-3">
          Position actuelle
        </h3>
        <div className="flex items-center gap-2 p-3 bg-[#ff6b00]/10 border border-[#ff6b00]/30 rounded-md">
          <MapPin className="w-4 h-4 text-[#ff6b00] flex-shrink-0" />
          <span className="text-sm font-medium text-[#e5e7eb] flex-1">
            {currentLocation.name}
          </span>
        </div>
      </div>

      {/* Saved Locations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#e5e7eb] uppercase tracking-wider">
            Villes sauvegardées
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCitySearch(true)}
            className="h-7 gap-1 text-xs"
          >
            <Plus className="w-3 h-3" />
            Ajouter
          </Button>
        </div>

        <div className="space-y-1">
          {savedLocations.map((location) => {
            const isCurrent = location.name === currentLocation.name;

            return (
              <div
                key={location.name}
                className={`
                  flex items-center gap-2 p-2 rounded-md transition-colors
                  ${
                    isCurrent
                      ? 'bg-[#ff6b00]/10 border border-[#ff6b00]/30'
                      : 'hover:bg-[#2a2a2a]'
                  }
                `}
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

                {/* Remove button - only show if there's more than one location and it's not current */}
                {savedLocations.length > 1 && !isCurrent && (
                  <button
                    onClick={() => onLocationRemove(location.name)}
                    className="p-1 hover:bg-[#ff6b00]/10 rounded transition-colors"
                    title="Supprimer cette ville"
                  >
                    <X className="w-3 h-3 text-[#a8a8a8] hover:text-[#ff6b00]" />
                  </button>
                )}
              </div>
            );
          })}
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

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, MapPin, Loader2, Globe, Navigation } from 'lucide-react';
import { GeocodingService, type CitySearchResult } from '@/services/geocoding/GeocodingService';
import { GeolocationService } from '@/services/geolocation/GeolocationService';
import type { Location } from '@/types/location';

interface CitySearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCitySelected: (location: Location) => void;
}

export function CitySearchDialog({
  open,
  onOpenChange,
  onCitySelected,
}: CitySearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showPopularCities, setShowPopularCities] = useState(true);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const popularCities = GeocodingService.getPopularCities();

  // Debounced search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowPopularCities(true);
      return;
    }

    setShowPopularCities(false);
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      const results = await GeocodingService.searchCities(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleCitySelect = useCallback(
    (location: Location) => {
      onCitySelected(location);
      onOpenChange(false);
      setSearchQuery('');
      setSearchResults([]);
    },
    [onCitySelected, onOpenChange]
  );

  const handlePopularCityClick = (location: Location) => {
    handleCitySelect(location);
  };

  const handleSearchResultClick = (result: CitySearchResult) => {
    const location = GeocodingService.resultToLocation(result);
    handleCitySelect(location);
  };

  const handleAutoDetect = async () => {
    setIsDetectingLocation(true);
    const result = await GeolocationService.getCurrentPosition();
    setIsDetectingLocation(false);

    if (result.location) {
      handleCitySelect(result.location);
    } else if (result.error) {
      // Show error message to user
      alert(result.error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#ff6b00]" />
            Choose a city
          </DialogTitle>
          <DialogDescription>
            Search for a city or select one from the list.
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a8a8]" />
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-[#ff6b00]/20 rounded-md text-[#e5e7eb] placeholder:text-[#a8a8a8] focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 focus:border-[#ff6b00]/50"
          />
        </div>

        {/* Auto-detect Location Button */}
        <button
          onClick={handleAutoDetect}
          disabled={isDetectingLocation}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.15) 0%, rgba(255, 107, 0, 0.08) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 107, 0, 0.3)',
          }}
        >
          {isDetectingLocation ? (
            <>
              <Loader2 className="w-4 h-4 text-[#ff6b00] animate-spin" />
              <span className="text-sm font-medium text-[#ff6b00]">
                Detecting...
              </span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 text-[#ff6b00]" />
              <span className="text-sm font-medium text-[#ff6b00]">
                Detect my location automatically
              </span>
            </>
          )}
        </button>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto min-h-[300px] -mx-6 px-6">
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#ff6b00]" />
            </div>
          )}

          {/* Search Results */}
          {!isSearching && searchResults.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-[#a8a8a8] uppercase tracking-wider mb-2 px-2">
                Search Results
              </p>
              {searchResults.map((result, index) => (
                <button
                  key={`${result.latitude}-${result.longitude}-${index}`}
                  onClick={() => handleSearchResultClick(result)}
                  className="w-full flex items-center gap-3 p-3 rounded-md transition-all text-left group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.3) 0%, rgba(36, 36, 56, 0.2) 100%)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.03)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 107, 0, 0.1) 0%, rgba(255, 107, 0, 0.05) 100%)';
                    e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(255, 107, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(26, 26, 46, 0.3) 0%, rgba(36, 36, 56, 0.2) 100%)';
                    e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(255, 255, 255, 0.03)';
                  }}
                >
                  <MapPin className="w-4 h-4 text-[#a8a8a8] group-hover:text-[#ff6b00] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#e5e7eb] group-hover:text-[#ff6b00] truncate">
                      {result.name}
                    </p>
                    <p className="text-xs text-[#a8a8a8] truncate">
                      {[result.admin1, result.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isSearching && !showPopularCities && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Search className="w-12 h-12 text-[#a8a8a8] mb-3" />
              <p className="text-sm text-[#a8a8a8]">
                No cities found for "{searchQuery}"
              </p>
            </div>
          )}

          {/* Popular Cities */}
          {showPopularCities && !isSearching && (
            <div className="space-y-1">
              <p className="text-xs text-[#a8a8a8] uppercase tracking-wider mb-2 px-2">
                Popular Cities
              </p>
              {popularCities.map((city) => (
                <button
                  key={`${city.latitude}-${city.longitude}`}
                  onClick={() => handlePopularCityClick(city)}
                  className="w-full flex items-center gap-3 p-3 rounded-md transition-all text-left group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.3) 0%, rgba(36, 36, 56, 0.2) 100%)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.03)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 107, 0, 0.1) 0%, rgba(255, 107, 0, 0.05) 100%)';
                    e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(255, 107, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(26, 26, 46, 0.3) 0%, rgba(36, 26, 56, 0.2) 100%)';
                    e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(255, 255, 255, 0.03)';
                  }}
                >
                  <MapPin className="w-4 h-4 text-[#a8a8a8] group-hover:text-[#ff6b00] flex-shrink-0" />
                  <p className="text-sm font-medium text-[#e5e7eb] group-hover:text-[#ff6b00]">
                    {city.name}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

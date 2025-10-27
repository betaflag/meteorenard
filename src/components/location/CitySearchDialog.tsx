import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, MapPin, Loader2, Globe } from 'lucide-react';
import { GeocodingService, type CitySearchResult } from '@/services/geocoding/GeocodingService';
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#ff6b00]" />
            Choisir une ville
          </DialogTitle>
          <DialogDescription>
            Recherchez une ville ou sélectionnez-en une dans la liste.
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a8a8]" />
          <input
            type="text"
            placeholder="Rechercher une ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-[#ff6b00]/20 rounded-md text-[#e5e7eb] placeholder:text-[#a8a8a8] focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 focus:border-[#ff6b00]/50"
          />
        </div>

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
                Résultats de recherche
              </p>
              {searchResults.map((result, index) => (
                <button
                  key={`${result.latitude}-${result.longitude}-${index}`}
                  onClick={() => handleSearchResultClick(result)}
                  className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-[#ff6b00]/10 transition-colors text-left group"
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
                Aucune ville trouvée pour "{searchQuery}"
              </p>
            </div>
          )}

          {/* Popular Cities */}
          {showPopularCities && !isSearching && (
            <div className="space-y-1">
              <p className="text-xs text-[#a8a8a8] uppercase tracking-wider mb-2 px-2">
                Villes populaires
              </p>
              {popularCities.map((city) => (
                <button
                  key={`${city.latitude}-${city.longitude}`}
                  onClick={() => handlePopularCityClick(city)}
                  className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-[#ff6b00]/10 transition-colors text-left group"
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

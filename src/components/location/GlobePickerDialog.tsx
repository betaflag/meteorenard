import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Globe, Loader2, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/language';
import { resolveLocationFromCoords } from '@/services/geocoding/resolveLocationFromCoords';
import type { Location } from '@/types/location';
import type { GlobePick } from './PlanetGlobe';

const PlanetGlobe = lazy(() =>
  import('./PlanetGlobe').then((m) => ({ default: m.PlanetGlobe }))
);

interface GlobePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelected: (location: Location) => void;
}

// Loaded once and shared across opens — the country polygons never change.
let countriesCache: object[] | null = null;

async function loadCountries(): Promise<object[]> {
  if (countriesCache) return countriesCache;
  const response = await fetch('/geo/countries-110m.geojson');
  const geojson = (await response.json()) as { features?: object[] };
  countriesCache = geojson.features ?? [];
  return countriesCache;
}

export function GlobePickerDialog({
  open,
  onOpenChange,
  onLocationSelected,
}: GlobePickerDialogProps) {
  const { t, language } = useLanguage();
  const [countries, setCountries] = useState<object[] | null>(countriesCache);
  const [loadFailed, setLoadFailed] = useState(false);
  const [pick, setPick] = useState<GlobePick | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  // Tracks the latest pick so a slow reverse-geocode for an earlier tap can't
  // overwrite the result of a newer one.
  const pickToken = useRef(0);

  useEffect(() => {
    if (!open || countries) return;
    setLoadFailed(false);
    loadCountries()
      .then(setCountries)
      .catch((error) => {
        console.error('Failed to load globe country data:', error);
        setLoadFailed(true);
      });
  }, [open, countries]);

  // Reset the selection each time the dialog closes.
  useEffect(() => {
    if (!open) {
      setPick(null);
      setLocation(null);
      setIsResolving(false);
    }
  }, [open]);

  // Stable identity so the memoized PlanetGlobe doesn't re-render when geocoding
  // state changes — the pin drops on tap, and resolving happens off to the side.
  const handlePick = useCallback(
    (next: GlobePick) => {
      const token = ++pickToken.current;
      setPick(next);
      setLocation(null);
      setIsResolving(true);
      resolveLocationFromCoords(next.lat, next.lng, language).then((resolved) => {
        if (pickToken.current !== token) return;
        setLocation(resolved);
        setIsResolving(false);
      });
    },
    [language]
  );

  const handleConfirm = () => {
    if (!location) return;
    onLocationSelected(location);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-[96vw] h-[92vh] p-5 flex flex-col gap-3">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#ff6b00]" />
            {t.globePicker.title}
          </DialogTitle>
          <DialogDescription>{t.globePicker.instruction}</DialogDescription>
        </DialogHeader>

        {/* Globe canvas fills the available space */}
        <div className="flex-1 min-h-0 rounded-xl overflow-hidden">
          {loadFailed ? (
            <div className="w-full h-full flex items-center justify-center text-[#a8a8a8]">
              {t.globePicker.loadError}
            </div>
          ) : countries ? (
            <Suspense fallback={<GlobeLoading />}>
              <PlanetGlobe countries={countries} pick={pick} onPick={handlePick} />
            </Suspense>
          ) : (
            <GlobeLoading />
          )}
        </div>

        {/* Selected place + actions */}
        <div className="flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-4 h-4 text-[#C5A572] flex-shrink-0" />
              <span className="truncate text-[#e5e7eb]">
                {isResolving ? (
                  <span className="inline-flex items-center gap-2 text-[#a8a8a8]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.globePicker.resolving}
                  </span>
                ) : location ? (
                  <span className="font-semibold">{location.name}</span>
                ) : (
                  <span className="text-[#a8a8a8]">{t.globePicker.noSelection}</span>
                )}
              </span>
            </div>
            {/* Attribution required by the Nominatim / OSM usage policy */}
            <span className="text-xs text-[#6b7280]">
              {t.globePicker.attribution}{' '}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-[#a8a8a8]"
              >
                © OpenStreetMap
              </a>
            </span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-md text-sm font-medium text-[#a8a8a8] hover:text-[#e5e7eb] transition-colors"
            >
              {t.globePicker.cancel}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!location || isResolving}
              className="px-5 py-2 rounded-md text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c33 100%)',
                boxShadow: '0 4px 16px rgba(255, 107, 0, 0.35)',
              }}
            >
              {t.globePicker.confirm}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GlobeLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#ff6b00]" />
    </div>
  );
}

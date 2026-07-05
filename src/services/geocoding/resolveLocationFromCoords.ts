import type { Location } from '@/types/location';
import { ReverseGeocodingService } from './ReverseGeocodingService';

/**
 * Format a latitude/longitude pair as a short human label, e.g. "12.3°N, 45.6°W".
 * Used when a tap lands somewhere with no named place (open ocean, remote areas).
 */
function formatCoordinates(latitude: number, longitude: number): string {
  const lat = `${Math.abs(latitude).toFixed(1)}°${latitude >= 0 ? 'N' : 'S'}`;
  const lon = `${Math.abs(longitude).toFixed(1)}°${longitude >= 0 ? 'E' : 'W'}`;
  return `${lat}, ${lon}`;
}

/**
 * Resolve a point picked on the globe into a usable Location. Tries reverse
 * geocoding for a named place and always returns a Location: when nothing
 * resolves (ocean / unmapped), it falls back to a coordinate label so the
 * selection can still be confirmed and weather can be fetched.
 */
export async function resolveLocationFromCoords(
  latitude: number,
  longitude: number,
  language: string = 'fr'
): Promise<Location> {
  const resolved = await ReverseGeocodingService.reverseGeocode(latitude, longitude, language);
  if (resolved) {
    return resolved;
  }

  return {
    name: formatCoordinates(latitude, longitude),
    latitude,
    longitude,
  };
}

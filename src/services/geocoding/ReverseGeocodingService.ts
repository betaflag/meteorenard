import type { Location } from '@/types/location';

/**
 * Response from Nominatim reverse geocoding API
 */
interface NominatimResponse {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
  };
  display_name?: string;
}

/**
 * Service for reverse geocoding (converting coordinates to location names)
 */
export class ReverseGeocodingService {
  private static readonly NOMINATIM_API = 'https://nominatim.openstreetmap.org/reverse';
  private static readonly REQUEST_DELAY = 1000; // 1 second delay between requests (Nominatim requirement)
  private static lastRequestTime = 0;

  /**
   * Get location name from coordinates using OpenStreetMap Nominatim API
   * @param latitude - Latitude coordinate
   * @param longitude - Longitude coordinate
   * @returns Location with name, or null if geocoding fails
   */
  static async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<Location | null> {
    try {
      // Respect rate limiting (max 1 request per second)
      await this.throttleRequest();

      const url = new URL(this.NOMINATIM_API);
      url.searchParams.set('lat', latitude.toString());
      url.searchParams.set('lon', longitude.toString());
      url.searchParams.set('format', 'json');
      url.searchParams.set('accept-language', 'fr'); // French names
      url.searchParams.set('zoom', '10'); // City-level detail

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'MeteoRenard/1.0', // Required by Nominatim
        },
      });

      if (!response.ok) {
        console.error('Reverse geocoding failed:', response.statusText);
        return null;
      }

      const data: NominatimResponse = await response.json();

      // Extract city name from response
      const cityName = this.extractCityName(data);

      if (!cityName) {
        console.warn('Could not extract city name from geocoding response');
        return null;
      }

      return {
        name: cityName,
        latitude,
        longitude,
      };
    } catch (error) {
      console.error('Error during reverse geocoding:', error);
      return null;
    }
  }

  /**
   * Extract city name from Nominatim response
   * Tries multiple fields in order of preference
   * @private
   */
  private static extractCityName(data: NominatimResponse): string | null {
    const address = data.address;
    if (!address) return null;

    // Try to get the most specific locality name
    return (
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      null
    );
  }

  /**
   * Throttle requests to respect Nominatim rate limit (1 request per second)
   * @private
   */
  private static async throttleRequest(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.REQUEST_DELAY) {
      const delay = this.REQUEST_DELAY - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    this.lastRequestTime = Date.now();
  }
}

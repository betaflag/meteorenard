import type { Location } from '@/types/location';

/**
 * City search result from geocoding API
 */
export interface CitySearchResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State/Province
  population?: number;
}

/**
 * Response from Open-Meteo geocoding API
 */
interface GeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
    population?: number;
  }>;
}

/**
 * Service for geocoding (city search and reverse geocoding)
 */
export class GeocodingService {
  private static readonly BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
  private static readonly SEARCH_ENDPOINT = '/search';

  /**
   * Search for cities by name
   * @param query - City name to search for
   * @param count - Maximum number of results (default: 10)
   * @param language - Language code for results (default: 'fr')
   * @returns Promise resolving to array of city search results
   */
  static async searchCities(
    query: string,
    count: number = 10,
    language: string = 'fr'
  ): Promise<CitySearchResult[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const params = new URLSearchParams({
        name: query.trim(),
        count: count.toString(),
        language,
        format: 'json',
      });

      const url = `${this.BASE_URL}${this.SEARCH_ENDPOINT}?${params}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data: GeocodingResponse = await response.json();

      if (!data.results || data.results.length === 0) {
        return [];
      }

      // Transform API results to our CitySearchResult format
      return data.results.map((result) => ({
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: result.country,
        admin1: result.admin1,
        population: result.population,
      }));
    } catch (error) {
      console.error('Error searching cities:', error);
      return [];
    }
  }

  /**
   * Convert a CitySearchResult to a Location
   * @param result - City search result to convert
   * @returns Location object
   */
  static resultToLocation(result: CitySearchResult): Location {
    // Format name with province/state if available
    let name = result.name;
    if (result.admin1) {
      name = `${result.name}, ${result.admin1}`;
    }

    return {
      name,
      latitude: result.latitude,
      longitude: result.longitude,
    };
  }

  /**
   * Get popular/default cities for quick selection
   * @returns Array of popular cities in Quebec/Canada
   */
  static getPopularCities(): Location[] {
    return [
      {
        name: 'Montréal, QC',
        latitude: 45.5017,
        longitude: -73.5673,
      },
      {
        name: 'Québec, QC',
        latitude: 46.8139,
        longitude: -71.2080,
      },
      {
        name: 'Laval, QC',
        latitude: 45.6066,
        longitude: -73.7124,
      },
      {
        name: 'Gatineau, QC',
        latitude: 45.4765,
        longitude: -75.7013,
      },
      {
        name: 'Longueuil, QC',
        latitude: 45.5312,
        longitude: -73.5182,
      },
      {
        name: 'Sherbrooke, QC',
        latitude: 45.4042,
        longitude: -71.8929,
      },
      {
        name: 'Trois-Rivières, QC',
        latitude: 46.3432,
        longitude: -72.5432,
      },
      {
        name: 'Toronto, ON',
        latitude: 43.6532,
        longitude: -79.3832,
      },
      {
        name: 'Vancouver, BC',
        latitude: 49.2827,
        longitude: -123.1207,
      },
      {
        name: 'Calgary, AB',
        latitude: 51.0447,
        longitude: -114.0719,
      },
    ];
  }
}

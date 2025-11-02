import type { IWeatherService } from './IWeatherService';
import type { WeatherData } from '@/types/weather';
import type { Location } from '@/types/location';
import type { MSCGeoMetResponse } from './adapters/mscGeoMetTypes';
import { adaptMSCGeoMetResponse } from './adapters/mscGeoMetAdapter';

/**
 * City code mapping for Environment Canada API
 * Maps approximate coordinates to city codes
 */
const CITY_CODE_MAP: Record<string, string> = {
  // Quebec cities
  'montreal': 'qc-147',    // Montréal
  'quebec': 'qc-133',      // Québec City
  'laval': 'qc-131',       // Laval
  'gatineau': 'qc-69',     // Gatineau
  'longueuil': 'qc-88',    // Longueuil
  'sherbrooke': 'qc-159',  // Sherbrooke
  'trois-rivieres': 'qc-184', // Trois-Rivières
  // Ontario cities
  'toronto': 'on-143',     // Toronto
  'ottawa': 'on-118',      // Ottawa
  // BC cities
  'vancouver': 'bc-74',    // Vancouver
  // Alberta cities
  'calgary': 'ab-52',      // Calgary
  'edmonton': 'ab-50',     // Edmonton
};

/**
 * Environment Canada Weather Service
 * Uses api.weather.gc.ca OGC API for weather data
 * Note: This API uses city codes, not coordinates, so only predefined cities are supported
 */
export class MSCGeoMetService implements IWeatherService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = 'https://api.weather.gc.ca';
  }

  /**
   * Find city code for a location
   * Uses approximate coordinate matching to find the nearest supported city
   */
  private getCityCodeForLocation(location: Location): string {
    // Try to match by name first (case-insensitive, normalized)
    const normalizedName = location.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z\s]/g, ''); // Remove special chars

    // Check if name contains any of our city keys
    for (const [cityKey, cityCode] of Object.entries(CITY_CODE_MAP)) {
      if (normalizedName.includes(cityKey)) {
        return cityCode;
      }
    }

    // Fallback: Find nearest city by coordinates
    const CITIES_BY_COORDS: Array<{ lat: number; lng: number; code: string }> = [
      { lat: 45.5017, lng: -73.5673, code: 'qc-147' }, // Montreal
      { lat: 46.8139, lng: -71.2080, code: 'qc-133' }, // Quebec
      { lat: 43.6532, lng: -79.3832, code: 'on-143' }, // Toronto
      { lat: 45.4215, lng: -75.6972, code: 'on-118' }, // Ottawa
      { lat: 49.2827, lng: -123.1207, code: 'bc-74' }, // Vancouver
      { lat: 51.0447, lng: -114.0719, code: 'ab-52' }, // Calgary
    ];

    let nearestCity = CITIES_BY_COORDS[0]; // Default to Montreal
    let minDistance = Infinity;

    for (const city of CITIES_BY_COORDS) {
      const distance = Math.sqrt(
        Math.pow(city.lat - location.latitude, 2) +
        Math.pow(city.lng - location.longitude, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    }

    return nearestCity.code;
  }

  async fetchWeather(location: Location): Promise<WeatherData> {
    try {
      const cityCode = this.getCityCodeForLocation(location);

      // Use Environment Canada's OGC API - no CORS proxy needed!
      const url = `${this.baseUrl}/collections/citypageweather-realtime/items/${cityCode}?f=json&lang=en-CA`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Environment Canada API error: ${response.status} ${response.statusText}`
        );
      }

      const data: MSCGeoMetResponse = await response.json();

      return adaptMSCGeoMetResponse(data, location.name);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to fetch weather from Environment Canada: ${error.message}`
        );
      }
      throw new Error('Failed to fetch weather from Environment Canada: Unknown error');
    }
  }

  getProviderName(): string {
    return 'Environnement Canada';
  }
}

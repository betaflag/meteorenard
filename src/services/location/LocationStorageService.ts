import type { Location } from '@/types/location';

/**
 * Local storage keys
 */
const STORAGE_KEYS = {
  CURRENT_LOCATION: 'meteorenard_current_location',
  SAVED_LOCATIONS: 'meteorenard_saved_locations',
  HAS_REQUESTED_PERMISSION: 'meteorenard_has_requested_permission',
} as const;

/**
 * Service for managing location data in localStorage
 */
export class LocationStorageService {
  /**
   * Get the current location from localStorage
   * @returns Current location or null if not set
   */
  static getCurrentLocation(): Location | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_LOCATION);
      if (stored) {
        const location = JSON.parse(stored) as Location;
        // Validate the location has required fields
        if (location.name && location.latitude && location.longitude) {
          return location;
        }
      }
    } catch (error) {
      console.error('Error reading current location from localStorage:', error);
    }
    return null;
  }

  /**
   * Set the current location in localStorage
   * @param location - Location to save
   */
  static setCurrentLocation(location: Location): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CURRENT_LOCATION,
        JSON.stringify(location)
      );
    } catch (error) {
      console.error('Error saving current location to localStorage:', error);
    }
  }

  /**
   * Get all saved locations from localStorage
   * @returns Array of saved locations (empty array if none saved)
   */
  static getSavedLocations(): Location[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_LOCATIONS);
      if (stored) {
        const locations = JSON.parse(stored) as Location[];
        // Validate it's an array
        if (Array.isArray(locations)) {
          return locations;
        }
      }
    } catch (error) {
      console.error('Error reading saved locations from localStorage:', error);
    }
    // Return empty array if no locations saved
    return [];
  }

  /**
   * Add a location to saved locations
   * @param location - Location to add
   * @returns Updated array of saved locations
   */
  static addLocation(location: Location): Location[] {
    const savedLocations = this.getSavedLocations();

    // Check if location already exists (by name or coordinates)
    const exists = savedLocations.some(
      (loc) =>
        loc.name === location.name ||
        (Math.abs(loc.latitude - location.latitude) < 0.01 &&
          Math.abs(loc.longitude - location.longitude) < 0.01)
    );

    if (!exists) {
      savedLocations.push(location);
      this.setSavedLocations(savedLocations);
    }

    return savedLocations;
  }

  /**
   * Remove a location from saved locations
   * @param locationName - Name of the location to remove
   * @returns Updated array of saved locations
   */
  static removeLocation(locationName: string): Location[] {
    const savedLocations = this.getSavedLocations();
    const filtered = savedLocations.filter((loc) => loc.name !== locationName);

    this.setSavedLocations(filtered);

    return filtered;
  }

  /**
   * Set the saved locations array
   * @param locations - Array of locations to save
   * @private
   */
  private static setSavedLocations(locations: Location[]): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.SAVED_LOCATIONS,
        JSON.stringify(locations)
      );
    } catch (error) {
      console.error('Error saving locations to localStorage:', error);
    }
  }

  /**
   * Check if we have already requested geolocation permission
   * @returns true if permission was previously requested
   */
  static hasRequestedPermission(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.HAS_REQUESTED_PERMISSION) === 'true';
    } catch (error) {
      console.error('Error reading permission flag from localStorage:', error);
      return false;
    }
  }

  /**
   * Mark that we have requested geolocation permission
   */
  static setPermissionRequested(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HAS_REQUESTED_PERMISSION, 'true');
    } catch (error) {
      console.error('Error saving permission flag to localStorage:', error);
    }
  }

  /**
   * Clear all location data from localStorage
   */
  static clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_LOCATION);
      localStorage.removeItem(STORAGE_KEYS.SAVED_LOCATIONS);
      localStorage.removeItem(STORAGE_KEYS.HAS_REQUESTED_PERMISSION);
    } catch (error) {
      console.error('Error clearing location data from localStorage:', error);
    }
  }
}

import type { Location, GeolocationError } from '@/types/location';
import { ReverseGeocodingService } from '@/services/geocoding/ReverseGeocodingService';

/**
 * Result of a geolocation request
 */
export interface GeolocationResult {
  location: Location | null;
  error: GeolocationError | null;
}

/**
 * Service for accessing device geolocation
 */
export class GeolocationService {
  private static readonly DEFAULT_TIMEOUT = 10000; // 10 seconds
  private static readonly HIGH_ACCURACY = true;

  /**
   * Check if geolocation is supported by the browser
   */
  static isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  /**
   * Get the user's current position
   * @param timeout - Timeout in milliseconds (default: 10000)
   * @returns Promise resolving to GeolocationResult
   */
  static async getCurrentPosition(
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<GeolocationResult> {
    // Check if geolocation is supported
    if (!this.isSupported()) {
      return {
        location: null,
        error: {
          code: 'NOT_SUPPORTED',
          message: 'La géolocalisation n\'est pas supportée par votre navigateur',
        },
      };
    }

    return new Promise((resolve) => {
      const options: PositionOptions = {
        enableHighAccuracy: this.HIGH_ACCURACY,
        timeout,
        maximumAge: 0, // Don't use cached position
      };

      navigator.geolocation.getCurrentPosition(
        // Success callback
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Try to get city name via reverse geocoding
          const geocodedLocation = await ReverseGeocodingService.reverseGeocode(
            latitude,
            longitude
          );

          resolve({
            location: geocodedLocation || {
              name: 'Ma position',
              latitude,
              longitude,
            },
            error: null,
          });
        },
        // Error callback
        (error) => {
          resolve({
            location: null,
            error: this.mapGeolocationError(error),
          });
        },
        options
      );
    });
  }

  /**
   * Map GeolocationPositionError to our GeolocationError type
   * @private
   */
  private static mapGeolocationError(
    error: GeolocationPositionError
  ): GeolocationError {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return {
          code: 'PERMISSION_DENIED',
          message: 'Permission de géolocalisation refusée. Veuillez autoriser l\'accès à votre position dans les paramètres de votre navigateur.',
        };
      case error.POSITION_UNAVAILABLE:
        return {
          code: 'POSITION_UNAVAILABLE',
          message: 'Position non disponible. Vérifiez que les services de localisation sont activés.',
        };
      case error.TIMEOUT:
        return {
          code: 'TIMEOUT',
          message: 'La demande de géolocalisation a expiré. Veuillez réessayer.',
        };
      default:
        return {
          code: 'POSITION_UNAVAILABLE',
          message: 'Erreur lors de la récupération de votre position.',
        };
    }
  }
}

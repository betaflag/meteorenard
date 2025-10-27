/**
 * Location data structure
 */
export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

/**
 * Geolocation error codes
 */
export type GeolocationErrorCode =
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'TIMEOUT'
  | 'NOT_SUPPORTED';

/**
 * Geolocation error information
 */
export interface GeolocationError {
  code: GeolocationErrorCode;
  message: string;
}

/**
 * Geolocation state for UI
 */
export interface GeolocationState {
  location: Location | null;
  isLoading: boolean;
  error: GeolocationError | null;
}

/**
 * Default location (Montreal)
 */
export const DEFAULT_LOCATION: Location = {
  name: 'Montréal',
  latitude: 45.5017,
  longitude: -73.5673,
};

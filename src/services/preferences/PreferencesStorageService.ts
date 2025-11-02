/**
 * Service for managing user preferences in localStorage
 * Handles preschool mode and other user settings
 */

const STORAGE_KEYS = {
  PRESCHOOL_MODE: 'meteorenard_preschool_mode',
} as const;

export class PreferencesStorageService {
  /**
   * Get the preschool mode setting
   * @returns boolean - true if preschool mode is enabled, false otherwise
   */
  static getPreschoolMode(): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRESCHOOL_MODE);
      return stored === 'true';
    } catch (error) {
      console.error('Error reading preschool mode from localStorage:', error);
      return false;
    }
  }

  /**
   * Set the preschool mode setting
   * @param enabled - true to enable preschool mode, false to disable
   */
  static setPreschoolMode(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRESCHOOL_MODE, String(enabled));
    } catch (error) {
      console.error('Error saving preschool mode to localStorage:', error);
    }
  }
}

import type { ClothingItem } from './types';
import { CLOTHING_RECOMMENDATIONS } from './clothingData';

/**
 * Service for providing clothing recommendations based on temperature.
 */
export class ClothingRecommendationService {
  /**
   * Get clothing recommendations for a temperature.
   * @param temperature - Temperature in Celsius (actual or feels-like)
   * @returns Array of recommended clothing items
   */
  static getRecommendations(temperature: number): ClothingItem[] {
    const recommendation = CLOTHING_RECOMMENDATIONS.find(
      ({ temperatureRange }) =>
        temperature >= temperatureRange.min && temperature < temperatureRange.max
    );

    // Fall back to the mild range if nothing matched.
    return (recommendation ?? CLOTHING_RECOMMENDATIONS[2]).items;
  }
}

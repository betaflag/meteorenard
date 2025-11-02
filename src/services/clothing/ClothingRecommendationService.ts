import type { ClothingRecommendation, ClothingItem } from './types';
import { CLOTHING_RECOMMENDATIONS } from './clothingData';

/**
 * Service for providing clothing recommendations based on weather conditions
 */
export class ClothingRecommendationService {
  /**
   * Temperature adjustment for preschool mode (2-5 years old)
   * Subtracting 5°C makes recommendations more conservative/warmer
   */
  private static readonly PRESCHOOL_TEMPERATURE_ADJUSTMENT = -5;

  /**
   * Get clothing recommendations based on temperature
   * @param temperature - Temperature in Celsius (can be actual or feels-like)
   * @param preschoolMode - If true, adjusts recommendations for children aged 2-5 years
   * @returns Array of recommended clothing items
   */
  static getRecommendations(temperature: number, preschoolMode: boolean = false): ClothingItem[] {
    // Apply temperature adjustment for preschool mode
    const adjustedTemperature = preschoolMode
      ? temperature + this.PRESCHOOL_TEMPERATURE_ADJUSTMENT
      : temperature;

    // Find the appropriate temperature range
    const recommendation = this.findRecommendationForTemperature(adjustedTemperature);

    if (!recommendation) {
      // Fallback to mild weather clothing if somehow no match found
      return CLOTHING_RECOMMENDATIONS[2].items;
    }

    return recommendation.items;
  }

  /**
   * Get the full recommendation object including temperature range info
   * @param temperature - Temperature in Celsius
   * @param preschoolMode - If true, adjusts recommendations for children aged 2-5 years
   * @returns Full ClothingRecommendation object or null
   */
  static getFullRecommendation(temperature: number, preschoolMode: boolean = false): ClothingRecommendation | null {
    const adjustedTemperature = preschoolMode
      ? temperature + this.PRESCHOOL_TEMPERATURE_ADJUSTMENT
      : temperature;
    return this.findRecommendationForTemperature(adjustedTemperature);
  }

  /**
   * Find the appropriate recommendation for a given temperature
   * Uses simple range matching - O(n) where n=5 (constant)
   * @private
   */
  private static findRecommendationForTemperature(
    temperature: number
  ): ClothingRecommendation | null {
    for (const recommendation of CLOTHING_RECOMMENDATIONS) {
      const { min, max } = recommendation.temperatureRange;

      // Check if temperature falls within this range
      if (temperature >= min && temperature < max) {
        return recommendation;
      }
    }

    return null;
  }

  /**
   * Get clothing items by category for a given temperature
   * @param temperature - Temperature in Celsius
   * @param category - Specific clothing category to filter by
   * @param preschoolMode - If true, adjusts recommendations for children aged 2-5 years
   * @returns Array of clothing items in that category
   */
  static getRecommendationsByCategory(
    temperature: number,
    category: ClothingItem['category'],
    preschoolMode: boolean = false
  ): ClothingItem[] {
    const recommendations = this.getRecommendations(temperature, preschoolMode);
    return recommendations.filter((item) => item.category === category);
  }

  /**
   * Get a summary description of the temperature range
   * @param temperature - Temperature in Celsius
   * @returns French description of the weather type
   */
  static getTemperatureDescription(temperature: number): string {
    if (temperature < 0) return 'Très froid';
    if (temperature < 8) return 'Froid';
    if (temperature < 18) return 'Frais';
    if (temperature < 22) return 'Doux';
    return 'Chaud';
  }
}

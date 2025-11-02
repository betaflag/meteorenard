/**
 * Clothing Recommendation Types
 */

export type ClothingCategory =
  | 'head'
  | 'neck'
  | 'hands'
  | 'outerwear'
  | 'pants'
  | 'footwear'
  | 'sun-protection';

export interface ClothingItem {
  id: string;
  name: string; // French name
  category: ClothingCategory;
}

export interface ClothingRecommendation {
  temperatureRange: {
    min: number;
    max: number;
  };
  items: ClothingItem[];
}

export type TemperatureRange =
  | 'extreme-cold' // < 0°C
  | 'cold' // 0-8°C
  | 'cool' // 8-18°C
  | 'mild' // 18-22°C
  | 'warm'; // 22°C+

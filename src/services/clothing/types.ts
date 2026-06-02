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
  | 'sun-protection'
  | 'rain-protection';

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

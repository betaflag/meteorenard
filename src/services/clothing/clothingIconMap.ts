/**
 * Mapping between clothing item IDs and icon filenames
 * Icons are located in src/assets/clothing/
 */

import type { ClothingCategory } from './types';

/** Distinct tints for non-clothing "protection" items, set apart from the clothing orange. */
const PROTECTION_TINTS: Partial<Record<ClothingCategory, string>> = {
  'sun-protection': '#F2C94C', // sunscreen — sun yellow
  'rain-protection': '#4fc3f7', // umbrella — precip blue
};

/** Tint for a protection-category item, or undefined for ordinary clothing. */
export function protectionTint(category: ClothingCategory): string | undefined {
  return PROTECTION_TINTS[category];
}

export const CLOTHING_ICON_MAP: Record<string, string> = {
  // Below 0°C - Full winter gear
  'winter-hat': 'tuque.png',
  'neck-warmer': 'foulard.png',
  'mittens-gloves': 'mitaines.png',
  'winter-coat': 'manteau-hiver.png',
  'snow-pants': 'pantalon-neige.png',
  'winter-boots': 'bottes-hiver.png',

  // 0 to 8°C - Mid-season clothing
  'thin-hat': 'tuque.png',
  'thin-gloves': 'mitaines.png',
  'mid-season-coat': 'manteau-chaud.png',
  'mid-season-pants': 'pantalon-leger.png',
  'rain-winter-boots': 'bottes-pluie.png',

  // 8 to 18°C - Light outerwear
  'light-coat-vest': 'manteau-leger.png',
  'casual-pants': 'pantalon-leger.png',
  'outdoor-shoes': 'espadrilles.png',

  // 18 to 22°C - Light long sleeves
  'light-long-sleeve': 't-shirt-manches-longues.png',
  'light-pants': 'pantalon-leger.png',

  // 22°C and above - Summer clothing
  'cap-hat': 'casquette.png',
  'short-sleeve': 't-shirt-leger.png',
  'shorts-skirt': 'short.png',
  'sunscreen': 'creme-solaire.png',

  // Weather-driven extras (injected by condition, not temperature tier)
  'umbrella': 'parapluie.png',
};

/**
 * Get icon filename for a clothing item ID
 * @param itemId - The clothing item ID
 * @returns Icon filename or undefined if not found
 */
export function getClothingIcon(itemId: string): string | undefined {
  return CLOTHING_ICON_MAP[itemId];
}

/**
 * Check if an icon exists for a clothing item
 * @param itemId - The clothing item ID
 * @returns true if icon mapping exists
 */
export function hasClothingIcon(itemId: string): boolean {
  return itemId in CLOTHING_ICON_MAP;
}

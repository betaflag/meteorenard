/**
 * Mapping between clothing item IDs and icon filenames
 * Icons are located in src/assets/clothing/
 */

export const CLOTHING_ICON_MAP: Record<string, string> = {
  // Below 0°C - Full winter gear
  'winter-hat': 'tuque.png',
  'neck-warmer': 'foulard.png',
  'mittens-gloves': 'mitaines.png',
  'winter-coat': 'manteau-hiver.png',
  'snow-pants': 'pantalon-leger.png', // Using pantalon-leger as proxy
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
  'outdoor-shoes': 'bottes-pluie.png', // Using rain boots as proxy for outdoor shoes

  // 18 to 22°C - Light long sleeves
  'light-long-sleeve': 't-shirt-manches-longues.png',
  'light-pants': 'pantalon-leger.png',
  'outdoor-shoes-2': 'bottes-pluie.png',

  // 22°C and above - Summer clothing
  'cap-hat': 'casquette.png',
  'short-sleeve': 't-shirt-leger.png',
  'shorts-skirt': 'short.png',
  'outdoor-shoes-3': 'bottes-pluie.png',
  'sunscreen': 'creme-solaire.png',

  // Additional items for special conditions
  'raincoat': 'imperméable.png',
  'windbreaker': 'coupe-vent.png',
  'sweater': 'chandail.png',
  'light-sweater': 'chandail-leger.png',
  'polo': 'polo.png',
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

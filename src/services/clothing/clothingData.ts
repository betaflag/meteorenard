import type { ClothingRecommendation } from "./types";

/**
 * Clothing recommendations based on temperature ranges
 * Source: Quebec school board clothing thermometer
 */
export const CLOTHING_RECOMMENDATIONS: readonly ClothingRecommendation[] = [
  // Below 0°C - Full winter gear
  {
    temperatureRange: { min: -Infinity, max: 0 },
    items: [
      { id: "winter-hat", name: "Winter hat", category: "head" },
      { id: "neck-warmer", name: "Neck warmer", category: "neck" },
      { id: "mittens-gloves", name: "Mittens/gloves", category: "hands" },
      { id: "winter-coat", name: "Winter coat", category: "outerwear" },
      { id: "snow-pants", name: "Snow pants", category: "pants" },
      { id: "winter-boots", name: "Winter boots", category: "footwear" },
    ],
  },

  // 0 to 8°C - Mid-season clothing
  {
    temperatureRange: { min: 0, max: 8 },
    items: [
      { id: "thin-hat", name: "Light hat", category: "head" },
      { id: "thin-gloves", name: "Light gloves", category: "hands" },
      {
        id: "mid-season-coat",
        name: "Mid-season jacket",
        category: "outerwear",
      },
      {
        id: "mid-season-pants",
        name: "Regular pants",
        category: "pants",
      },
      {
        id: "rain-winter-boots",
        name: "Winter/rain boots",
        category: "footwear",
      },
    ],
  },

  // 8 to 18°C - Light outerwear
  {
    temperatureRange: { min: 8, max: 18 },
    items: [
      {
        id: "light-coat-vest",
        name: "Light jacket or vest",
        category: "outerwear",
      },
      { id: "casual-pants", name: "Casual pants", category: "pants" },
      {
        id: "outdoor-shoes",
        name: "Outdoor shoes",
        category: "footwear",
      },
    ],
  },

  // 18 to 22°C - Light long sleeves
  {
    temperatureRange: { min: 18, max: 22 },
    items: [
      {
        id: "light-long-sleeve",
        name: "Light long-sleeve shirt",
        category: "outerwear",
      },
      { id: "light-pants", name: "Light pants", category: "pants" },
      {
        id: "outdoor-shoes-2",
        name: "Outdoor shoes",
        category: "footwear",
      },
    ],
  },

  // 22°C and above - Summer clothing
  {
    temperatureRange: { min: 22, max: Infinity },
    items: [
      { id: "cap-hat", name: "Cap/hat", category: "head" },
      {
        id: "short-sleeve",
        name: "Short-sleeve shirt",
        category: "outerwear",
      },
      { id: "shorts-skirt", name: "Shorts/skirt", category: "pants" },
      {
        id: "outdoor-shoes-3",
        name: "Outdoor shoes",
        category: "footwear",
      },
      { id: "sunscreen", name: "Sunscreen", category: "sun-protection" },
    ],
  },
] as const;

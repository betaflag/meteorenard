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
      { id: "winter-hat", name: "Tuque", category: "head" },
      { id: "neck-warmer", name: "Cache-cou", category: "neck" },
      { id: "mittens-gloves", name: "Mitaines/gants", category: "hands" },
      { id: "winter-coat", name: "Manteau d'hiver", category: "outerwear" },
      { id: "snow-pants", name: "Pantalon de neige", category: "pants" },
      { id: "winter-boots", name: "Bottes d'hiver", category: "footwear" },
    ],
  },

  // 0 to 8°C - Mid-season clothing
  {
    temperatureRange: { min: 0, max: 8 },
    items: [
      { id: "thin-hat", name: "Tuque mince", category: "head" },
      { id: "thin-gloves", name: "Gants minces", category: "hands" },
      {
        id: "mid-season-coat",
        name: "Manteau de mi-saison",
        category: "outerwear",
      },
      {
        id: "mid-season-pants",
        name: "Pantalon de mi-saison",
        category: "pants",
      },
      {
        id: "rain-winter-boots",
        name: "Bottes d'hiver/de pluie/bottillons",
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
        name: "Veste ou manteau léger",
        category: "outerwear",
      },
      { id: "casual-pants", name: "Pantalon tout aller", category: "pants" },
      {
        id: "outdoor-shoes",
        name: "Chaussures d'extérieur",
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
        name: "Chandail léger à manches longues",
        category: "outerwear",
      },
      { id: "light-pants", name: "Pantalon léger", category: "pants" },
      {
        id: "outdoor-shoes-2",
        name: "Chaussures d'extérieur",
        category: "footwear",
      },
    ],
  },

  // 22°C and above - Summer clothing
  {
    temperatureRange: { min: 22, max: Infinity },
    items: [
      { id: "cap-hat", name: "Casquette/chapeau", category: "head" },
      {
        id: "short-sleeve",
        name: "Chandail à manches courtes",
        category: "outerwear",
      },
      { id: "shorts-skirt", name: "Bermuda/jupe", category: "pants" },
      {
        id: "outdoor-shoes-3",
        name: "Chaussures d'extérieur",
        category: "footwear",
      },
      { id: "sunscreen", name: "Écran solaire", category: "sun-protection" },
    ],
  },
] as const;

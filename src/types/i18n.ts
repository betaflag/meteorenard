export type Language = 'en' | 'fr';

export interface Translations {
  // App Menu
  appMenu: {
    savedCities: string;
    add: string;
    noSavedCities: string;
    weatherProvider: string;
    language: string;
    clockPage: string;
  };

  // Location
  location: {
    yourLocation: string;
    locationDescription: string;
    locating: string;
    useMyLocation: string;
    chooseCity: string;
    searchPlaceholder: string;
    detecting: string;
    detectLocation: string;
    searchResults: string;
    noCitiesFound: string;
    popularCities: string;
    removeCity: string;
  };

  // Time Blocks
  timeBlocks: {
    morning: string;
    afternoon: string;
    evening: string;
    tomorrow: string;
  };

  // Time Block detail modal
  timeBlockDetail: {
    feelsLike: string;
    actual: string;
    high: string;
    low: string;
    wind: string;
    humidity: string;
    uvIndex: string;
    precipitationChance: string;
    snow: string;
    hourlyForecast: string;
    recommendedClothing: string;
    close: string;
  };

  // WHO UV index exposure levels
  uvLevels: {
    low: string;
    moderate: string;
    high: string;
    veryHigh: string;
    extreme: string;
  };

  // Short labels for our 8 normalized weather conditions
  conditions: {
    clear: string;
    partlyCloudy: string;
    cloudy: string;
    rain: string;
    heavyRain: string;
    thunderstorm: string;
    snow: string;
    fog: string;
  };

  // Weather Providers
  providers: {
    openMeteo: {
      label: string;
      description: string;
    };
    mscGeoMet: {
      label: string;
      description: string;
    };
  };

  // Weather Conditions (Open-Meteo)
  weather: {
    clearSky: string;
    mostlyClear: string;
    partlyCloudy: string;
    overcast: string;
    fog: string;
    freezingFog: string;
    lightDrizzle: string;
    moderateDrizzle: string;
    heavyDrizzle: string;
    lightRain: string;
    moderateRain: string;
    heavyRain: string;
    lightSnow: string;
    moderateSnow: string;
    heavySnow: string;
    snowGrains: string;
    lightShowers: string;
    moderateShowers: string;
    heavyShowers: string;
    lightSnowShowers: string;
    heavySnowShowers: string;
    thunderstorm: string;
    thunderstormLightHail: string;
    thunderstormHeavyHail: string;
    variableConditions: string;
  };

  // Days of week
  days: {
    sun: string;
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
  };

  // Clothing items
  clothing: {
    winterHat: string;
    neckWarmer: string;
    mittensGloves: string;
    winterCoat: string;
    snowPants: string;
    winterBoots: string;
    lightHat: string;
    lightGloves: string;
    midSeasonJacket: string;
    regularPants: string;
    winterRainBoots: string;
    lightJacketVest: string;
    casualPants: string;
    outdoorShoes: string;
    lightLongSleeve: string;
    lightPants: string;
    capHat: string;
    shortSleeve: string;
    shortsSkirt: string;
    sunscreen: string;
    umbrella: string;
  };
}

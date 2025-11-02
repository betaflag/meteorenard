export type Language = 'en' | 'fr';

export interface Translations {
  // App Menu
  appMenu: {
    savedCities: string;
    add: string;
    noSavedCities: string;
    weatherProvider: string;
    language: string;
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
  };
}

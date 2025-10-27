/**
 * Environment Canada API Types
 *
 * Uses api.weather.gc.ca OGC API
 * Documentation: https://api.weather.gc.ca/
 */

export interface MSCTemperature {
  class: 'high' | 'low' | 'temperature';
  period?: string;
  textSummary?: string;
  value?: number;
  unitType?: string;
}

export interface MSCWind {
  speed?: number;
  gust?: number;
  direction?: string;
  bearing?: number;
}

export interface MSCCurrentConditions {
  temperature: {
    value: {
      en: number;
      fr: number;
    };
  };
  dewpoint?: {
    value: {
      en: number;
      fr: number;
    };
  };
  condition: {
    en: string;
    fr: string;
  };
  iconCode?: {
    value: number;
  };
  pressure?: {
    value: {
      en: number;
      fr: number;
    };
  };
  relativeHumidity?: {
    value: {
      en: number;
      fr: number;
    };
  };
  wind?: {
    speed?: {
      value: {
        en: number;
        fr: number;
      };
    };
    direction?: {
      value: {
        en: string;
        fr: string;
      };
    };
  };
}

export interface MSCForecastPeriod {
  period: {
    textForecastName: {
      en: string;
      fr: string;
    };
  };
  textSummary?: {
    en: string;
    fr: string;
  };
  cloudPrecip?: {
    en: string;
    fr: string;
  };
  abbreviatedForecast?: {
    textSummary: {
      en: string;
      fr: string;
    };
  };
  temperatures?: {
    temperature?: Array<{
      class: {
        en: string;
        fr: string;
      };
      value: {
        en: number;
        fr: number;
      };
    }>;
  };
}

export interface MSCHourlyForecast {
  timestamp: string;
  temperature: {
    value: {
      en: number;
      fr: number;
    };
  };
  condition: {
    en: string;
    fr: string;
  };
  lop?: {
    value: {
      en: number;
      fr: number;
    };
  };
}

export interface MSCForecastGroup {
  forecasts: MSCForecastPeriod[];
}

export interface MSCHourlyForecastGroup {
  hourlyForecasts: MSCHourlyForecast[];
}

export interface MSCGeoMetProperties {
  identifier: string;
  nameEn: string;
  nameFr: string;
  currentConditions: MSCCurrentConditions;
  forecastGroup: MSCForecastGroup;
  hourlyForecastGroup: MSCHourlyForecastGroup;
}

export interface MSCGeoMetResponse {
  type: 'Feature';
  properties: MSCGeoMetProperties;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

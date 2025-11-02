export type WeatherProvider = 'open-meteo' | 'msc-geomet';

export const weatherConfig = {
  // Active weather provider - change this to switch APIs
  activeProvider: 'open-meteo' as WeatherProvider,

  // Montreal, Quebec coordinates
  location: {
    name: 'Montréal',
    latitude: 45.5017,
    longitude: -73.5673,
  },

  // Data refresh interval (in milliseconds)
  refreshInterval: 10 * 60 * 1000, // 10 minutes

  // API endpoints
  apis: {
    openMeteo: {
      baseUrl: 'https://api.open-meteo.com/v1',
      forecast: '/forecast',
    },
    mscGeoMet: {
      baseUrl: 'https://api.weather.gc.ca',
      collections: '/collections',
    },
  },
} as const;

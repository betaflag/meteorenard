# Weather API Integration Guide

## Overview

MeteoRenard now fetches real weather data using a flexible architecture that allows easy switching between different weather API providers.

## Current Setup

- **Active Provider**: Open-Meteo API
- **Location**: Montréal, Québec (45.5017° N, 73.5673° W)
- **Auto-refresh**: Every 10 minutes
- **Language**: French (Canada)

## How to Switch Weather APIs

### Quick Switch

1. Open `src/config/weather.config.ts`
2. Change the `activeProvider` value:

```typescript
export const weatherConfig = {
  // Change this line:
  activeProvider: 'open-meteo' as WeatherProvider,
  // To one of: 'open-meteo' | 'msc-geomet'
  ...
}
```

3. Save the file - the app will automatically reload

### Available Providers

#### ✅ Open-Meteo (Recommended - Currently Active)
- **Status**: Fully implemented and working
- **API Key**: Not required
- **Data Source**: Canadian GEM (Global Environmental Multiscale) model from CMC
- **Updates**: Hourly
- **Features**:
  - Simple JSON API
  - Excellent documentation
  - High accuracy for Quebec
  - Free for non-commercial use (up to 10,000 requests/day)

#### ⚠️ MSC GeoMet (Government of Canada)
- **Status**: Placeholder only - not yet implemented
- **API Key**: Not required
- **Data Source**: Official Environment Canada data
- **Note**: This API uses OGC standards and is designed for GIS applications. Implementation requires additional work to parse the complex data formats.

## Architecture

### Strategy Pattern Design

The implementation uses the **Strategy Pattern** to allow easy switching between providers:

```
WeatherServiceFactory → IWeatherService
                       ↓
                ┌──────┴──────┐
                ↓             ↓
      OpenMeteoService   MSCGeoMetService
```

### File Structure

```
src/
├── config/
│   └── weather.config.ts          # Configuration (switch providers here)
├── services/
│   └── weather/
│       ├── IWeatherService.ts     # Interface contract
│       ├── OpenMeteoService.ts    # Open-Meteo implementation
│       ├── MSCGeoMetService.ts    # MSC GeoMet placeholder
│       ├── WeatherServiceFactory.ts
│       └── adapters/
│           ├── openMeteoTypes.ts
│           ├── openMeteoAdapter.ts
│           ├── mscGeoMetTypes.ts
│           └── mscGeoMetAdapter.ts
└── types/
    └── weather.ts                  # Shared weather data types
```

## Configuration Options

Edit `src/config/weather.config.ts`:

### Change Location

```typescript
location: {
  name: 'Québec',           // Display name
  latitude: 46.8139,        // Latitude
  longitude: -71.2080,      // Longitude (use negative for West)
},
```

### Adjust Refresh Interval

```typescript
// Default: 10 minutes (600,000 ms)
refreshInterval: 10 * 60 * 1000,

// Examples:
// 5 minutes:  5 * 60 * 1000
// 15 minutes: 15 * 60 * 1000
// 30 minutes: 30 * 60 * 1000
```

## UI States

The app handles three states:

1. **Loading**: Shows spinning animation with "Chargement des données météo..."
2. **Error**: Shows error message with "Réessayer" button
3. **Success**: Displays current weather and 8-hour forecast

## Adding a New Weather Provider

To add support for another weather API:

1. Create types file: `src/services/weather/adapters/newProviderTypes.ts`
2. Create adapter: `src/services/weather/adapters/newProviderAdapter.ts`
3. Create service: `src/services/weather/NewProviderService.ts`
4. Update factory: Add case to `WeatherServiceFactory.create()`
5. Update config: Add provider to `WeatherProvider` type

## API Response Mapping

### Weather Conditions

The app uses these condition types (see `src/types/weather.ts`):

- `clear` - Ciel dégagé
- `partly-cloudy` - Partiellement nuageux
- `cloudy` - Couvert
- `rain` - Pluie
- `heavy-rain` - Forte pluie
- `thunderstorm` - Orage
- `snow` - Neige
- `fog` - Brouillard

Each adapter maps the provider's weather codes to these conditions.

## Troubleshooting

### App shows error on load

1. Check browser console for detailed error message
2. Verify internet connection
3. Check if the API endpoint is accessible
4. Try switching to a different provider in config

### Weather data seems incorrect

1. Verify coordinates in `weather.config.ts` are correct
2. Check that the provider is using Canadian/Quebec data
3. Open browser DevTools → Network tab to inspect API responses

### Want to use MSC GeoMet?

The MSC GeoMet implementation needs to be completed. The API is complex and uses OGC standards. For now, Open-Meteo is recommended as it includes Canadian weather model data.

## Development Notes

- Mock data has been removed from the codebase
- All weather data is fetched from live APIs
- TypeScript provides full type safety
- React hooks manage state and data fetching
- Auto-refresh runs in background
- Failed requests show user-friendly error messages

## Resources

- **Open-Meteo Docs**: https://open-meteo.com/en/docs
- **MSC GeoMet Docs**: https://eccc-msc.github.io/open-data/msc-geomet/readme_en/
- **Canadian GEM Model**: https://open-meteo.com/en/docs/gem-api

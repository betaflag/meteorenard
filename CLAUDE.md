# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Météo Renard is a weather application for Montréal, QC built with React, TypeScript, Vite, and Tailwind CSS. The application fetches weather data from multiple providers and displays current conditions and hourly forecasts.

## Development Commands

```bash
# Start development server (with HMR)
npm run dev

# Build for production (runs TypeScript check + Vite build)
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Multi-Provider Weather Service Architecture

The application uses the **Strategy Pattern** to support multiple weather data providers. This is implemented through:

1. **Service Interface**: `src/services/weather/IWeatherService.ts` - Defines the contract all weather services must implement
2. **Factory**: `src/services/weather/WeatherServiceFactory.ts` - Creates the appropriate service based on configuration
3. **Concrete Services**:
   - `OpenMeteoService.ts` - Open-Meteo API integration
   - `MSCGeoMetService.ts` - Meteorological Service of Canada GeoMet API integration

To add a new weather provider:
1. Create a new service class implementing `IWeatherService`
2. Create an adapter in `src/services/weather/adapters/` to transform the provider's response format to our `WeatherData` type
3. Add the provider to the factory's switch statement
4. Update the `WeatherProvider` type in `src/config/weather.config.ts`

### Adapter Pattern for API Responses

Each weather service has an adapter that transforms provider-specific API responses into our normalized `WeatherData` format. Adapters are located in `src/services/weather/adapters/`:

- `openMeteoAdapter.ts` - Transforms Open-Meteo responses (WMO weather codes, hourly data)
- `mscGeoMetAdapter.ts` - Transforms MSC GeoMet responses (different weather code system)

This decouples the UI from specific API formats and makes it easy to switch providers or add new ones.

### Configuration

Weather service configuration is centralized in `src/config/weather.config.ts`:
- Active weather provider selection
- Location coordinates (Montréal: 45.5017, -73.5673)
- API endpoints for each provider
- Refresh interval (10 minutes by default)

### Component Structure

- `App.tsx` - Main container managing state, provider switching, and data fetching
- `components/weather/WeatherWidget.tsx` - Main weather display container with loading/error states
- `components/weather/CurrentWeather.tsx` - Displays current weather conditions
- `components/weather/HourlyForecast.tsx` - Shows next 8 hours of forecast
- `components/weather/ProviderToggle.tsx` - UI for switching between weather providers
- `components/ui/` - Reusable UI components (card, badge, select) using Radix UI primitives

### Path Aliases

The project uses `@/` as an alias for `src/`:
```typescript
import { WeatherData } from '@/types/weather';
```

This is configured in both `vite.config.ts` and `tsconfig.json`.

## TypeScript Configuration

The project uses TypeScript project references with separate configs:
- `tsconfig.json` - Base config with path aliases
- `tsconfig.app.json` - Application source code config
- `tsconfig.node.json` - Vite/Node tooling config

## Styling

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- Custom color scheme with orange accent (`#ff6b00`)
- French language UI (weather descriptions in French)
- Responsive design with mobile-first approach
- Glass-morphism effects using backdrop-filter

## Key Dependencies

- **React 19** with hooks-based state management
- **Radix UI** for accessible UI primitives
- **Lucide React** for icons
- **Vite** for build tooling with React plugin
- **Tailwind CSS v4** for styling

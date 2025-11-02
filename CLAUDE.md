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

# Generate images with Gemini AI (requires GEMINI_API_KEY in .env)
npm run gemini -- "prompt text" output_filename
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

### Service Layer

The application has a rich service layer organized by domain:

**Location Services**:
- `GeolocationService` (`src/services/location/GeolocationService.ts`) - Browser Geolocation API wrapper with error handling
- `GeocodingService` (`src/services/location/GeocodingService.ts`) - City search using Open-Meteo Geocoding API
- `ReverseGeocodingService` (`src/services/location/ReverseGeocodingService.ts`) - Converts coordinates to city names
- `LocationStorageService` (`src/services/location/LocationStorageService.ts`) - Manages saved locations in localStorage (key: `weatherApp_savedLocations`)

**Location Management Flow**:
1. First-run: App displays `LocationPermissionDialog` to request geolocation permission
2. User grants permission → GeolocationService gets coordinates → ReverseGeocodingService resolves city name
3. Locations saved via LocationStorageService persist across sessions
4. Users can search cities via `CitySearchDialog` (powered by GeocodingService)
5. Quick location switching via `LocationSelector` component

**Recommendation Services**:
- `ClothingRecommendationService` (`src/services/clothing/ClothingRecommendationService.ts`) - Temperature-based clothing recommendations using Quebec school board standards. Returns categorized items (upper, lower, outerwear, accessories, footwear) based on temperature ranges (cold, cool, mild, warm, hot). Clothing data defined in `src/services/clothing/clothingData.ts`
- `TimeBlockService` (`src/services/timeBlock/TimeBlockService.ts`) - Divides the day into time blocks: Morning (8h-12h), Afternoon (12h-17h), Evening (18h-22h). Combines weather forecast data with clothing recommendations for each block. Determines current time block and provides next 3 blocks of recommendations

### State Management

The application uses **React hooks-based state management** without external state libraries:

- **App.tsx** serves as the orchestrator, managing:
  - Weather data fetching and caching
  - Active weather provider selection
  - Current location state
  - Periodic refresh (10-minute intervals)
  - Error and loading states
- State flows down via props to child components
- Location state managed by `LocationStorageService` (persisted in localStorage)
- No global state management library (Redux, Zustand, etc.)
- Components use local state (useState) for UI-specific concerns
- Data fetching orchestrated at App level, passed down as props

### Component Structure

**Main App Container**:
- `App.tsx` - Root component managing global state, provider switching, data fetching, and periodic refresh

**Layout Components**:
- `components/layout/Header.tsx` - App header with branding and provider toggle
- `components/layout/AppMenu.tsx` - Navigation/settings menu
- `components/layout/WeatherHero.tsx` - Hero section with background image and parallax effect

**Location Components**:
- `components/location/LocationPermissionDialog.tsx` - First-run geolocation permission request
- `components/location/CitySearchDialog.tsx` - City search interface with popular Quebec/Canada cities
- `components/location/LocationSelector.tsx` - Dropdown for quick switching between saved locations

**Weather Widget Components**:
- `components/weather/WeatherWidget.tsx` - Current weather conditions with loading/error states
- `components/weather/HourlyChartWidget.tsx` - Temperature chart for next 24 hours (uses Recharts)
- `components/weather/DailyForecastWidget.tsx` - 10-day forecast overview
- `components/weather/ClothingForecastWidget.tsx` - Time block-based clothing recommendations

**Weather Display Components**:
- `components/weather/CurrentWeather.tsx` - Current conditions display
- `components/weather/HourlyForecast.tsx` - Scrollable hourly forecast (next 8 hours)
- `components/weather/HourlyChart.tsx` - Chart component for temperature visualization
- `components/weather/DailyForecast.tsx` - Daily forecast list
- `components/weather/HourlyItem.tsx` - Individual hourly forecast item
- `components/weather/DailyItem.tsx` - Individual daily forecast item
- `components/weather/TimeBlockCard.tsx` - Time block with weather and clothing recommendations
- `components/weather/WeatherIcon.tsx` - Weather condition icon mapping
- `components/weather/ProviderToggle.tsx` - UI for switching between weather providers

**UI Primitives** (`components/ui/`):
- Reusable components using Radix UI: card, badge, select, button, sheet (dialog/drawer)

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
- English language UI (weather descriptions in English)
- Responsive design with mobile-first approach
- Glass-morphism effects using backdrop-filter
- **Utility function**: `cn()` in `src/lib/utils.ts` - Combines `clsx` and `tailwind-merge` for conditional class merging without conflicts

## PWA and Production Features

**Progressive Web App**:
- `public/manifest.json` - PWA manifest with app metadata
- Multiple icon sizes (192x192, 512x512) in `public/`
- Installable as standalone app on mobile/desktop

**SEO and Metadata**:
- OpenGraph image (`public/og-image.png`) for social sharing
- `public/robots.txt` and `public/sitemap.xml` for search engines
- Meta tags configured in `index.html`

**Error Monitoring**:
- **Sentry** integration in `src/main.tsx` for production error tracking
- PII (Personally Identifiable Information) enabled for debugging

## Gemini AI Image Generator

The project includes a custom CLI tool (`bin/gemini.ts`) for generating images using Google Gemini AI:

```bash
npm run gemini -- "prompt text" output_filename
```

Features:
- Extensive prompt engineering documentation in the file comments
- Supports multiple aspect ratios, models (Gemini 1.5/2.0), and modalities
- Requires `GEMINI_API_KEY` in `.env` file
- Uses `tsx` to run TypeScript directly

## Key Dependencies

- **React 19** with hooks-based state management
- **Radix UI** for accessible UI primitives (@radix-ui/react-dialog, @radix-ui/react-select, @radix-ui/react-slot)
- **Lucide React** for icons
- **Recharts** for temperature charts and data visualization
- **Vite** for build tooling with React plugin
- **Tailwind CSS v4** for styling via `@tailwindcss/vite` plugin
- **tsx** for running TypeScript scripts (used by Gemini CLI tool)

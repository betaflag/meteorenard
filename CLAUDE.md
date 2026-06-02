# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Météo Renard is a full-screen weather **clock** for Montréal, QC, built for an always-on tablet in kiosk mode (landscape). React, TypeScript, Vite, and Tailwind CSS. It fetches weather from multiple providers and shows a large clock, the current conditions with a mascot fox dressed for the weather, three upcoming time-block cards with clothing recommendations, and a compact 24-hour timeline.

The clock is the only screen, served at the root path `/`. The legacy `/clock` path redirects to `/`.

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

- **`App.tsx`** is just the router: `/` renders `ClockPage`, and `/clock` redirects to `/`. It wraps everything in `LanguageProvider`.
- **`ClockPage`** (`src/pages/ClockPage.tsx`) is the orchestrator, managing:
  - Weather data fetching and caching for the current location
  - Current location state and the first-run location/permission flow
  - Periodic refresh (5-minute intervals for weather + background rotation)
  - Selected time block (for the detail modal) and the rotating background image
- Location state is managed by `LocationStorageService` (persisted in localStorage).
- No global state management library (Redux, Zustand, etc.); components use local `useState`.

### Component Structure

**Routing**:
- `App.tsx` - `BrowserRouter` with `/` → `ClockPage` and `/clock` → redirect to `/`.

**Clock page** (`src/pages/ClockPage.tsx`) and its components (`src/components/clock/`):
- `ClockDisplay.tsx` - Large clock + date.
- `CurrentWeatherWidget.tsx` - Top bar: clickable location pill (opens city search) and a frosted speech bubble of current conditions with the mascot fox tucked beneath it.
- `WeatherFox.tsx` / `foxMood.ts` - Mascot fox that dresses for the weather/time of day, with date-based holiday and celestial specials. Resolver precedence: holiday → notable weather → night-sky → time of day → temperature band.
- `ClockTimeBlockCard.tsx` - One of the three upcoming time-block cards (temp, condition, precip/UV, clothing icons). Tapping it opens `TimeBlockDetailDialog.tsx`.
- `HourlyTimeline.tsx` - Compact full-width 24h strip in the bottom bar: temperature curve, day/night shading, sunrise/sunset, precip, "now" anchor.
- `WeatherEffects.tsx` - Ambient rain/snow overlay for the upcoming block.
- Helpers: `tempDisplay.ts` (feels-like-as-hero rule), `timeBlockLabels.ts` (i18n labels), `clothingIconMap.ts` (`SUN_PROTECTION_COLOR`).

**Location dialogs** (`src/components/location/`):
- `LocationPermissionDialog.tsx` - First-run geolocation permission request.
- `CitySearchDialog.tsx` - City search with popular Quebec/Canada cities.

**Shared weather** (`src/components/weather/`):
- `WeatherIcon.tsx` - Weather condition → icon mapping (used across the clock components).

**UI Primitives** (`components/ui/`):
- Reusable components using Radix UI: `card`, `button`, `dialog`.

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
- **react-router-dom** for routing (`/` clock, `/clock` redirect)
- **Radix UI** for accessible UI primitives (@radix-ui/react-dialog, @radix-ui/react-slot)
- **Lucide React** for icons
- **Vite** for build tooling with React plugin
- **Tailwind CSS v4** for styling via `@tailwindcss/vite` plugin
- **tsx** for running TypeScript scripts (used by Gemini CLI tool)

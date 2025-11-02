import type { HourlyWeather } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  data: HourlyWeather[];
}

export function HourlyForecast({ data }: HourlyForecastProps) {
  // Limit hours based on screen size: 6 (mobile) -> 10 (tablet) -> 12 (desktop) -> 14 (large)
  const maxHours = 14;
  const displayData = data.slice(0, maxHours);

  return (
    <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20">
      <div className="grid grid-flow-col auto-cols-fr gap-1 sm:gap-2 md:gap-3">
        {displayData.map((hour, index) => (
          <div
            key={hour.time}
            className={`flex flex-col items-center justify-center min-w-0 ${
              // Hide on mobile (show first 6)
              index >= 6 ? 'hidden sm:flex' : 'flex'
            } ${
              // Hide on tablet (show first 10)
              index >= 10 ? 'sm:hidden md:flex' : ''
            } ${
              // Hide on desktop (show first 12)
              index >= 12 ? 'md:hidden lg:flex' : ''
            } ${
              // Hide on large (show first 14)
              index >= 14 ? 'lg:hidden' : ''
            }`}
          >
            {/* Time */}
            <div className="mb-1 sm:mb-2">
              <span
                className="text-xs sm:text-sm text-[#e8e8e8] font-light whitespace-nowrap"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              >
                {hour.time}
              </span>
            </div>

            {/* Weather Icon */}
            <div className="mb-1 sm:mb-2 flex items-center justify-center">
              <WeatherIcon
                condition={hour.condition}
                size={32}
                className="text-[#ff6b00] opacity-70 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10"
              />
            </div>

            {/* Temperature */}
            <div>
              <span
                className="text-sm sm:text-base font-light text-[#e8e8e8] whitespace-nowrap"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              >
                {Math.round(hour.temp)}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

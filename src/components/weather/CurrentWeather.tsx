import type { CurrentWeather as CurrentWeatherType } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  data: CurrentWeatherType;
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
      {/* Location - Full width */}
      <h2
        className="text-xl sm:text-2xl md:text-3xl font-semibold text-left text-[#e8e8e8] tracking-wide"
        style={{ fontFamily: 'Cinzel, serif' }}
      >
        {data.location}
      </h2>

      {/* Temperature/Description block + Icon */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center">
        {/* Left: Temperature and Description */}
        <div className="space-y-1 sm:space-y-2 md:space-y-3">
          {/* Temperature */}
          <div className="flex items-baseline gap-0.5 sm:gap-1">
            <span
              className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold text-[#e8e8e8] leading-none"
              style={{
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 700,
                textShadow: '0 0 20px rgba(255, 107, 0, 0.3), 0 0 30px rgba(255, 107, 0, 0.2)',
              }}
            >
              {Math.round(data.temp)}
            </span>
            <span
              className="text-3xl sm:text-4xl md:text-5xl text-[#c8c8c8]"
              style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 300 }}
            >
              °C
            </span>
          </div>

          {/* Description */}
          <p
            className="text-left text-sm sm:text-base md:text-lg lg:text-xl text-[#d1d5db]"
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 300,
              letterSpacing: '0.05em',
            }}
          >
            {data.description}
          </p>
        </div>

        {/* Right: Weather Icon - aligned with temp/description block */}
        <div className="flex justify-end items-center">
          <WeatherIcon
            condition={data.condition}
            size={100}
            className="text-[#ff6b00] opacity-70 w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px]"
          />
        </div>
      </div>
    </div>
  );
}

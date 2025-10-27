import type { HourlyWeather } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';
import { cn } from '@/lib/utils';

interface HourlyItemProps {
  data: HourlyWeather;
  className?: string;
}

export function HourlyItem({ data, className }: HourlyItemProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 flex-1', className)}>
      {/* Time */}
      <span
        className="text-xs sm:text-sm md:text-base text-[#e8e8e8] font-light tracking-wide"
        style={{ fontFamily: 'Raleway, sans-serif' }}
      >
        {data.time}
      </span>

      {/* Weather Icon */}
      <div className="h-[32px] sm:h-[48px] md:h-[56px] lg:h-[60px] flex items-center justify-center">
        <WeatherIcon
          condition={data.condition}
          size={32}
          className="text-[#ff6b00] opacity-70 w-[32px] h-[32px] sm:w-[48px] sm:h-[48px] md:w-[56px] md:h-[56px]"
        />
      </div>

      {/* Temperature */}
      <span
        className="text-sm sm:text-base md:text-lg lg:text-xl font-light text-[#e8e8e8]"
        style={{ fontFamily: 'Raleway, sans-serif' }}
      >
        {Math.round(data.temp)}°
      </span>
    </div>
  );
}

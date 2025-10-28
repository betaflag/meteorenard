import type { DailyWeather } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';

interface DailyItemProps {
  data: DailyWeather;
  tempRange: { min: number; max: number };
}

export function DailyItem({ data, tempRange }: DailyItemProps) {
  const { dayLabel, tempLow, tempHigh, condition, precipitationProbability } = data;

  // Calculate the position and width of the temperature bar
  const totalRange = tempRange.max - tempRange.min;
  const leftPosition = ((tempLow - tempRange.min) / totalRange) * 100;
  const barWidth = ((tempHigh - tempLow) / totalRange) * 100;

  // Show precipitation probability for rain/snow conditions
  const showPrecipitation =
    precipitationProbability &&
    precipitationProbability > 0 &&
    (condition === 'rain' ||
      condition === 'heavy-rain' ||
      condition === 'snow' ||
      condition === 'thunderstorm');

  return (
    <div
      className="flex items-center gap-2 sm:gap-4 md:gap-6 py-3 px-2 sm:py-4 sm:px-4 rounded-lg mb-2 last:mb-0 transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.3) 0%, rgba(36, 36, 56, 0.2) 100%)',
        backdropFilter: 'blur(8px)',
        boxShadow: `
          0 2px 10px rgba(0, 0, 0, 0.15),
          inset 0 0 0 1px rgba(255, 255, 255, 0.03)
        `,
      }}
    >
      {/* Day Label */}
      <div className="w-11 sm:w-20 flex-shrink-0">
        <span className="text-[#e5e7eb] font-raleway font-medium text-xs sm:text-base">
          {dayLabel}
        </span>
      </div>

      {/* Weather Icon with Precipitation */}
      <div className="flex flex-col items-center justify-center w-9 sm:w-14 flex-shrink-0">
        <WeatherIcon condition={condition} className="w-7 h-7 sm:w-10 sm:h-10 text-[#ff6b00]" />
        {showPrecipitation && (
          <span className="text-[#ff6b00] text-[10px] sm:text-xs font-raleway font-semibold mt-0.5 sm:mt-1">
            {Math.round(precipitationProbability)}%
          </span>
        )}
      </div>

      {/* Low Temperature */}
      <div className="w-7 sm:w-10 flex-shrink-0 text-right">
        <span className="text-[#a8a8a8] font-raleway text-xs sm:text-base">
          {tempLow}°
        </span>
      </div>

      {/* Temperature Range Bar */}
      <div className="flex-1 min-w-0 h-1 sm:h-1.5 relative bg-[#e5e7eb]/10 rounded-full">
        <div
          className="absolute h-full rounded-full transition-all duration-300"
          style={{
            left: `${leftPosition}%`,
            width: `${barWidth}%`,
            background: 'linear-gradient(90deg, #ff6b00 0%, #ff8c00 100%)',
          }}
        />
      </div>

      {/* High Temperature */}
      <div className="w-7 sm:w-10 flex-shrink-0 text-left">
        <span className="text-[#e5e7eb] font-raleway font-medium text-sm sm:text-lg">
          {tempHigh}°
        </span>
      </div>
    </div>
  );
}

import type { DailyWeather } from '@/types/weather';
import { DailyItem } from './DailyItem';
import { Calendar } from 'lucide-react';

interface DailyForecastProps {
  data: DailyWeather[];
}

export function DailyForecast({ data }: DailyForecastProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Calculate the temperature range across all days for the bar visualization
  const allTemps = data.flatMap((day) => [day.tempLow, day.tempHigh]);
  const tempRange = {
    min: Math.min(...allTemps),
    max: Math.max(...allTemps),
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#a8a8a8]" />
        <h2 className="text-[#a8a8a8] font-raleway font-semibold text-xs sm:text-sm uppercase tracking-wider">
          Prévisions 10 jours
        </h2>
      </div>

      {/* Daily Items */}
      <div className="space-y-0">
        {data.map((day) => (
          <DailyItem key={day.date} data={day} tempRange={tempRange} />
        ))}
      </div>
    </div>
  );
}

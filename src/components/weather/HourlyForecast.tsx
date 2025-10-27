import type { HourlyWeather } from '@/types/weather';
import { HourlyItem } from './HourlyItem';

interface HourlyForecastProps {
  data: HourlyWeather[];
}

export function HourlyForecast({ data }: HourlyForecastProps) {
  return (
    <div className="mt-6 sm:mt-8 md:mt-12">
      <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6 justify-between">
        {data.map((hour, index) => (
          <HourlyItem
            key={hour.time}
            data={hour}
            className={index >= 6 ? 'hidden sm:flex' : ''}
          />
        ))}
      </div>
    </div>
  );
}

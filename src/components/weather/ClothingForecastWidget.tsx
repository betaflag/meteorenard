import type { WeatherData } from '@/types/weather';
import { TimeBlockCard } from './TimeBlockCard';
import { TimeBlockService } from '@/services/timeBlock/TimeBlockService';

interface ClothingForecastWidgetProps {
  data: WeatherData | null;
  preschoolMode?: boolean;
}

export function ClothingForecastWidget({ data, preschoolMode = false }: ClothingForecastWidgetProps) {
  // Don't render if no data
  if (!data) {
    return null;
  }

  // Get 3 time blocks with weather and clothing recommendations
  const timeBlocks = TimeBlockService.getTimeBlocksWithWeather(data, undefined, preschoolMode);

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Time block cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {timeBlocks.map((block, index) => (
          <TimeBlockCard
            key={`${block.period}-${index}`}
            data={block}
            isHighlighted={index === 0}
          />
        ))}
      </div>
    </div>
  );
}

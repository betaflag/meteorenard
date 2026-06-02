import { Card, CardContent } from '@/components/ui/card';
import type { DayForecastData } from '@/services/timeBlock/types';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { ArrowDown, Droplets } from 'lucide-react';
import { useLanguage } from '@/contexts/language';
import { getDayCardLabel } from './timeBlockLabels';
import { ClothingIconRow } from './ClothingIconRow';

interface ClockDayCardProps {
  data: DayForecastData;
}

/**
 * One tile in the 3-day outlook: day label, weather icon, the day's high temp
 * as the hero with the low and precip chance beneath, and the clothing
 * recommended for the day. Mirrors {@link ClockTimeBlockCard}'s visual style.
 */
export function ClockDayCard({ data }: ClockDayCardProps) {
  const { t } = useLanguage();

  const { date, isTomorrow, tempHigh, tempLow, condition, precipitationProbability, clothingItems } =
    data;

  const label = getDayCardLabel(t, date, isTomorrow);
  const precipPercent =
    precipitationProbability !== undefined ? Math.round(precipitationProbability) : 0;
  const showPrecip = precipPercent > 0;

  return (
    <Card
      className="relative w-full h-full overflow-hidden rounded-xl"
      style={{
        background: 'linear-gradient(135deg, rgba(30, 35, 42, 0.25) 0%, rgba(40, 45, 52, 0.2) 100%)',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(197, 165, 114, 0.2)',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.5),
          0 0 16px rgba(197, 165, 114, 0.1)
        `,
      }}
    >
      <CardContent className="h-full flex flex-col p-5">
        {/* Header with day label */}
        <h3
          className="font-raleway font-bold text-center flex-shrink-0 mb-4"
          style={{
            fontSize: '1.5rem',
            color: '#ff6b00',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 107, 0, 0.4)',
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </h3>

        {/* Weather and clothing combined section */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Weather info - hero row, then one secondary line */}
          <div className="flex flex-col items-center">
            {/* Hero row: condition icon + high temperature */}
            <div className="flex items-center justify-center gap-5">
              <div
                className="flex-shrink-0"
                style={{ color: '#C5A572', filter: 'drop-shadow(0 0 8px rgba(197, 165, 114, 0.6))' }}
              >
                <WeatherIcon condition={condition} size={72} />
              </div>
              <span
                className="font-raleway font-bold"
                style={{
                  fontSize: '3.5rem',
                  color: '#ffffff',
                  textShadow: '0 3px 6px rgba(0, 0, 0, 0.7), 0 0 15px rgba(197, 165, 114, 0.3)',
                  lineHeight: '1',
                }}
              >
                {tempHigh}°
              </span>
            </div>

            {/* Secondary line: low temperature and precipitation, side by side */}
            <div className="flex items-center justify-center" style={{ gap: '18px', marginTop: '10px' }}>
              <span
                className="flex items-center"
                style={{ gap: '4px', fontSize: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <ArrowDown size={15} />
                {tempLow}° {t.timeBlockDetail.low}
              </span>
              {showPrecip && (
                <span className="flex items-center text-[#4fc3f7]" style={{ gap: '4px', fontSize: '1rem' }}>
                  <Droplets size={16} />
                  {precipPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Clothing section */}
          <div className="mt-4">
            <ClothingIconRow clothingItems={clothingItems} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

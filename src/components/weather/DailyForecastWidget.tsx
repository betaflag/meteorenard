import { Card, CardContent } from '@/components/ui/card';
import { DailyForecast } from './DailyForecast';
import type { WeatherData } from '@/types/weather';

interface DailyForecastWidgetProps {
  data: WeatherData | null;
}

export function DailyForecastWidget({ data }: DailyForecastWidgetProps) {
  // Don't render if no data or no daily forecast
  if (!data || !data.daily || data.daily.length === 0) {
    return null;
  }

  return (
    <Card
      className="relative w-full max-w-[1400px] mx-auto border-[#ff6b00]/35 overflow-hidden rounded-2xl sm:rounded-3xl"
      style={{
        background:
          'linear-gradient(135deg, rgba(26, 26, 46, 0.7) 0%, rgba(36, 36, 56, 0.6) 50%, rgba(46, 46, 66, 0.5) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: `
          0 20px 50px rgba(0, 0, 0, 0.5),
          0 0 40px rgba(255, 107, 0, 0.15),
          inset 0 0 0 1px rgba(255, 255, 255, 0.1)
        `,
      }}
    >
      {/* Floating glow effect */}
      <div
        className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(circle at center, rgba(255, 107, 0, 0.15) 0%, transparent 50%)',
          filter: 'blur(40px)',
        }}
      />

      <CardContent className="relative z-10 p-2 sm:p-6 md:p-8 lg:p-10">
        <DailyForecast data={data.daily} />
      </CardContent>
    </Card>
  );
}

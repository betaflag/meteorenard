import { Card, CardContent } from '@/components/ui/card';
import { HourlyChart } from './HourlyChart';
import type { WeatherData } from '@/types/weather';

interface HourlyChartWidgetProps {
  data: WeatherData | null;
}

export function HourlyChartWidget({ data }: HourlyChartWidgetProps) {
  // Don't render if no data or no hourly forecast
  if (!data || !data.hourly || data.hourly.length === 0) {
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

      <CardContent className="relative z-10 pt-3 px-3 pb-0 sm:pt-6 sm:px-6 sm:pb-0 md:pt-6 md:px-8 md:pb-0 lg:pt-6 lg:px-10 lg:pb-0">
        <HourlyChart data={data.hourly} />
      </CardContent>
    </Card>
  );
}

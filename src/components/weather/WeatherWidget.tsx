import { Card, CardContent } from '@/components/ui/card';
import { CurrentWeather } from './CurrentWeather';
import { HourlyForecast } from './HourlyForecast';
import { CloudOff, RefreshCw } from 'lucide-react';
import type { WeatherData } from '@/types/weather';

interface WeatherWidgetProps {
  data: WeatherData | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function WeatherWidget({
  data,
  isLoading = false,
  error = null,
  onRetry,
}: WeatherWidgetProps) {
  const renderContent = () => {
    // Loading state
    if (isLoading && !data) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <RefreshCw className="w-12 h-12 text-[#ff6b00] animate-spin mb-4" />
          <p className="text-[#e5e7eb] text-lg font-raleway">
            Chargement des données météo...
          </p>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CloudOff className="w-16 h-16 text-[#ff6b00]/70 mb-4" />
          <h3 className="text-[#e5e7eb] text-xl font-raleway font-semibold mb-2">
            Impossible de charger la météo
          </h3>
          <p className="text-[#a8a8a8] text-sm max-w-md mb-6 font-raleway">
            {error}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 rounded-full font-raleway font-medium text-white transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #ff6b00, #ff8c00)',
                boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3)',
              }}
            >
              Réessayer
            </button>
          )}
        </div>
      );
    }

    // No data state
    if (!data) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CloudOff className="w-16 h-16 text-[#ff6b00]/70 mb-4" />
          <p className="text-[#e5e7eb] text-lg font-raleway">
            Aucune donnée météo disponible
          </p>
        </div>
      );
    }

    // Data loaded successfully
    return (
      <>
        <CurrentWeather data={data.current} />
        <HourlyForecast data={data.hourly} />
      </>
    );
  };

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

      <CardContent className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-10">
        {renderContent()}
      </CardContent>
    </Card>
  );
}

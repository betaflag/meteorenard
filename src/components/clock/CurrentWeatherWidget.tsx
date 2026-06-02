import { MapPin } from 'lucide-react';
import type { Location } from '@/types/location';
import type { WeatherData } from '@/types/weather';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateCondition } from './timeBlockLabels';

interface CurrentWeatherWidgetProps {
  location: Location | null;
  weather: WeatherData | null;
}

// Liquid-glass pill used for both the location and current-condition chips.
const pillStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 18px',
  borderRadius: '9999px',
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 16px rgba(0, 0, 0, 0.35)',
};

/**
 * Clock-page top bar showing the current location and current conditions as two
 * glass pills (location on the left, condition + temperature on the right).
 */
export function CurrentWeatherWidget({ location, weather }: CurrentWeatherWidgetProps) {
  const { t } = useLanguage();
  const current = weather?.current;

  // Render the row only when there's at least one pill to show.
  if (!location && !current) {
    return null;
  }

  return (
    <div className="flex items-center justify-between w-full">
      {location ? (
        <div style={pillStyle}>
          <MapPin size={18} style={{ color: '#C5A572' }} />
          <span
            className="font-raleway font-semibold text-white"
            style={{ fontSize: '1rem', letterSpacing: '0.02em' }}
          >
            {location.name}
          </span>
        </div>
      ) : (
        <span />
      )}

      {current && (
        <div style={pillStyle}>
          <span style={{ color: '#C5A572', display: 'flex' }}>
            <WeatherIcon condition={current.condition} size={20} />
          </span>
          <span
            className="font-raleway font-medium"
            style={{ fontSize: '0.9375rem', color: 'rgba(255, 255, 255, 0.9)' }}
          >
            {translateCondition(t, current.condition)}
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 700 }}>·</span>
          <span className="font-raleway font-bold text-white" style={{ fontSize: '1rem' }}>
            {Math.round(current.temp)}°
          </span>
        </div>
      )}
    </div>
  );
}

import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  CloudFog,
  type LucideIcon,
} from 'lucide-react';
import type { WeatherCondition } from '@/types/weather';

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: number;
  className?: string;
}

const iconMap: Record<WeatherCondition, LucideIcon> = {
  clear: Sun,
  'partly-cloudy': CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
  'heavy-rain': CloudDrizzle,
  thunderstorm: CloudLightning,
  snow: CloudSnow,
  fog: CloudFog,
};

export function WeatherIcon({ condition, size = 48, className = '' }: WeatherIconProps) {
  const Icon = iconMap[condition];

  return (
    <Icon
      size={size}
      className={className}
      style={{
        filter: 'drop-shadow(0 0 6px rgba(255, 107, 0, 0.2))',
      }}
    />
  );
}

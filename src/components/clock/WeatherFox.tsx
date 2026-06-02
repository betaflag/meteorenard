import { useMemo } from 'react';
import type { WeatherData } from '@/types/weather';
import { getFoxMood, type FoxMood } from './foxMood';
import foxSnowy from '@/assets/fox/fox-snowy.png';
import foxStormy from '@/assets/fox/fox-stormy.png';
import foxRainy from '@/assets/fox/fox-rainy.png';
import foxCold from '@/assets/fox/fox-cold.png';
import foxHot from '@/assets/fox/fox-hot.png';
import foxSunny from '@/assets/fox/fox-sunny.png';
import foxWindy from '@/assets/fox/fox-windy.png';
import foxFoggy from '@/assets/fox/fox-foggy.png';
import foxSleepy from '@/assets/fox/fox-sleepy.png';
import foxMorning from '@/assets/fox/fox-morning.png';
import foxCloudy from '@/assets/fox/fox-cloudy.png';
import foxCool from '@/assets/fox/fox-cool.png';
import foxWarm from '@/assets/fox/fox-warm.png';
import foxMild from '@/assets/fox/fox-mild.png';

// Each mood can carry several pose variants; one is chosen at random and stays
// put until the mood changes. Single-entry moods are deterministic.
const FOX_SPRITES: Record<FoxMood, string[]> = {
  snowy: [foxSnowy],
  stormy: [foxStormy],
  rainy: [foxRainy],
  cold: [foxCold],
  hot: [foxHot],
  sunny: [foxSunny],
  windy: [foxWindy],
  foggy: [foxFoggy],
  sleepy: [foxSleepy],
  morning: [foxMorning],
  cloudy: [foxCloudy],
  cool: [foxCool],
  warm: [foxWarm],
  mild: [foxMild],
};

/**
 * Mascot fox dressed for the current weather and time of day. Purely decorative
 * — it reflects conditions shown elsewhere on the screen, so it carries no click
 * target and is hidden from assistive tech.
 */
export function WeatherFox({ weather }: { weather: WeatherData | null }) {
  const mood = weather ? getFoxMood(weather) : null;

  const sprite = useMemo(() => {
    if (!mood) return null;
    const variants = FOX_SPRITES[mood];
    return variants[Math.floor(Math.random() * variants.length)];
  }, [mood]);

  if (!sprite) {
    return null;
  }

  return (
    <img
      src={sprite}
      alt=""
      aria-hidden
      draggable={false}
      style={{
        display: 'block',
        height: 'clamp(120px, 18vh, 220px)',
        width: 'clamp(120px, 18vh, 220px)',
        objectFit: 'contain',
        filter: 'drop-shadow(0 6px 16px rgba(0, 0, 0, 0.45))',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    />
  );
}

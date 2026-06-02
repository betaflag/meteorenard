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
// Extra pose variants (chosen at random within a mood)
import foxRainy2 from '@/assets/fox/fox-rainy-2.png';
import foxSunny2 from '@/assets/fox/fox-sunny-2.png';
import foxCool2 from '@/assets/fox/fox-cool-2.png';
import foxWarm2 from '@/assets/fox/fox-warm-2.png';
import foxMild2 from '@/assets/fox/fox-mild-2.png';
// Calendar specials
import foxHalloween from '@/assets/fox/fox-halloween.png';
import foxChristmas from '@/assets/fox/fox-christmas.png';
import foxNewyear from '@/assets/fox/fox-newyear.png';
import foxValentines from '@/assets/fox/fox-valentines.png';
import foxMaple from '@/assets/fox/fox-maple.png';
import foxStjean from '@/assets/fox/fox-stjean.png';
import foxEaster from '@/assets/fox/fox-easter.png';
import foxStpatrick from '@/assets/fox/fox-stpatrick.png';
import foxCanadaday from '@/assets/fox/fox-canadaday.png';
import foxThanksgiving from '@/assets/fox/fox-thanksgiving.png';
import foxEarthday from '@/assets/fox/fox-earthday.png';
import foxGroundhog from '@/assets/fox/fox-groundhog.png';
import foxFullmoon from '@/assets/fox/fox-fullmoon.png';
import foxMeteor from '@/assets/fox/fox-meteor.png';
import foxSolsticeSummer from '@/assets/fox/fox-solstice-summer.png';
import foxSolsticeWinter from '@/assets/fox/fox-solstice-winter.png';
import foxAprilfools from '@/assets/fox/fox-aprilfools.png';
import foxFriday13 from '@/assets/fox/fox-friday13.png';
import foxPiday from '@/assets/fox/fox-piday.png';
import foxPirate from '@/assets/fox/fox-pirate.png';
import foxStarwars from '@/assets/fox/fox-starwars.png';

// Each mood can carry several pose variants; one is chosen at random and stays
// put until the mood changes. Single-entry moods are deterministic.
const FOX_SPRITES: Record<FoxMood, string[]> = {
  snowy: [foxSnowy],
  stormy: [foxStormy],
  rainy: [foxRainy, foxRainy2],
  cold: [foxCold],
  hot: [foxHot],
  sunny: [foxSunny, foxSunny2],
  windy: [foxWindy],
  foggy: [foxFoggy],
  sleepy: [foxSleepy],
  morning: [foxMorning],
  cloudy: [foxCloudy],
  cool: [foxCool, foxCool2],
  warm: [foxWarm, foxWarm2],
  mild: [foxMild, foxMild2],
  halloween: [foxHalloween],
  christmas: [foxChristmas],
  newyear: [foxNewyear],
  valentines: [foxValentines],
  maple: [foxMaple],
  stjean: [foxStjean],
  easter: [foxEaster],
  stpatrick: [foxStpatrick],
  canadaday: [foxCanadaday],
  thanksgiving: [foxThanksgiving],
  earthday: [foxEarthday],
  groundhog: [foxGroundhog],
  solsticeSummer: [foxSolsticeSummer],
  solsticeWinter: [foxSolsticeWinter],
  aprilfools: [foxAprilfools],
  friday13: [foxFriday13],
  piday: [foxPiday],
  pirate: [foxPirate],
  starwars: [foxStarwars],
  fullmoon: [foxFullmoon],
  meteor: [foxMeteor],
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

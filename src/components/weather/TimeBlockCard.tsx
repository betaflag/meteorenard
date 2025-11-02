import { Card, CardContent } from '@/components/ui/card';
import type { TimeBlockData } from '@/services/timeBlock/types';
import { WeatherIcon } from './WeatherIcon';
import { Droplets } from 'lucide-react';
import { getClothingIcon } from '@/services/clothing/clothingIconMap';

// Import time block banner images
import morningBanner from '@/assets/timeblocks/morning_banner.jpg';
import afternoonBanner from '@/assets/timeblocks/afternoon_banner.jpg';
import eveningBanner from '@/assets/timeblocks/evening_banner.jpg';

interface TimeBlockCardProps {
  data: TimeBlockData;
  isHighlighted?: boolean;
}

// Get banner image based on time block label
const getTimeBlockBanner = (label: string): string | undefined => {
  if (label.includes('Morning') || label.includes('8am-12pm')) return morningBanner;
  if (label.includes('Afternoon') || label.includes('12pm-5pm')) return afternoonBanner;
  if (label.includes('Evening') || label.includes('6pm-10pm')) return eveningBanner;
  return undefined;
};

// Dynamic import for clothing icons
const getClothingIconUrl = (iconFilename: string) => {
  try {
    return new URL(`../../assets/clothing/${iconFilename}`, import.meta.url).href;
  } catch {
    return undefined;
  }
};

export function TimeBlockCard({ data, isHighlighted: _isHighlighted = false }: TimeBlockCardProps) {
  const {
    label,
    temperature,
    condition,
    precipitationProbability,
    clothingItems,
    isNextDay,
  } = data;

  const displayItems = clothingItems.slice(0, 4);
  const bannerImage = getTimeBlockBanner(label);

  return (
    <Card
      className="relative w-full overflow-hidden rounded-xl border-white/10"
      style={{
        background: 'linear-gradient(135deg, rgba(30, 35, 42, 0.7) 0%, rgba(40, 45, 52, 0.6) 100%)',
        backdropFilter: 'blur(15px)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Header section with banner background - extends to card edges */}
      <div className="relative -m-2 mb-0 rounded-t-xl overflow-hidden">
        {/* Banner background image */}
        {bannerImage && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${bannerImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              maskImage: 'linear-gradient(to top right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%)',
              WebkitMaskImage: 'linear-gradient(to top right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%)',
            }}
          />
        )}

        {/* Header content */}
        <div className="relative px-6 py-6">
          {/* Time label and next day indicator */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#ff6b00] font-raleway font-semibold text-sm sm:text-base">
              {label}
            </h3>
            {isNextDay && (
              <span className="text-[#a8a8a8] text-xs font-raleway italic bg-[#1a1a2e]/80 px-2 py-1 rounded backdrop-blur-sm">Tomorrow</span>
            )}
          </div>

          {/* Weather info */}
          <div className="flex items-center gap-3">
            <WeatherIcon condition={condition} className="w-10 h-10 sm:w-12 sm:h-12 text-[#ff6b00]" />
            <div className="flex flex-col">
              <span className="text-white font-raleway text-2xl sm:text-3xl font-bold">
                {Math.round(temperature)}°
              </span>
              {precipitationProbability !== undefined && precipitationProbability > 0 && (
                <div className="flex items-center gap-1 text-[#4fc3f7] text-xs sm:text-sm">
                  <Droplets className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{precipitationProbability}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subtle border at bottom of header */}
        <div className="h-[2px] w-full bg-white/10" />
      </div>

      {/* Clothing items section */}
      <CardContent className="px-4 pt-2 pb-4">
        <div className="flex flex-col gap-2">
          {displayItems.map((item, index) => {
            const iconFilename = getClothingIcon(item.id);
            const iconUrl = iconFilename ? getClothingIconUrl(iconFilename) : undefined;

            return (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#1e232a]/50"
              >
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={item.name}
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain flex-shrink-0"
                    style={{
                      filter:
                        'brightness(0) saturate(100%) invert(50%) sepia(98%) saturate(2476%) hue-rotate(2deg) brightness(103%) contrast(101%)',
                    }}
                  />
                ) : (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#ff6b00]/20 flex-shrink-0" />
                )}
                <span className="text-[#e5e7eb] text-xs sm:text-sm font-raleway">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

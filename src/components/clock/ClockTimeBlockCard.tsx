import { Card, CardContent } from '@/components/ui/card';
import type { TimeBlockData } from '@/services/timeBlock/types';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { Droplets } from 'lucide-react';
import { getClothingIcon } from '@/services/clothing/clothingIconMap';
import { useLanguage } from '@/contexts/LanguageContext';
import { TimeBlockPeriod } from '@/services/timeBlock/types';

interface ClockTimeBlockCardProps {
  data: TimeBlockData;
}

// Dynamic import for clothing icons
const getClothingIconUrl = (iconFilename: string) => {
  try {
    return new URL(`../../assets/clothing/${iconFilename}`, import.meta.url).href;
  } catch {
    return undefined;
  }
};

export function ClockTimeBlockCard({ data }: ClockTimeBlockCardProps) {
  const { t } = useLanguage();

  const {
    period,
    temperature,
    condition,
    precipitationProbability,
    clothingItems,
  } = data;

  // Get simplified label (just period name, no time range)
  const getTranslatedLabel = () => {
    switch (period) {
      case TimeBlockPeriod.MORNING:
        return t.timeBlocks.morning.split(' ')[0]; // Just "Morning"
      case TimeBlockPeriod.AFTERNOON:
        return t.timeBlocks.afternoon.split(' ')[0]; // Just "Afternoon"
      case TimeBlockPeriod.EVENING:
        return t.timeBlocks.evening.split(' ')[0]; // Just "Evening"
      default:
        return '';
    }
  };

  // Translate clothing item name based on its ID
  const translateClothingItem = (itemId: string): string => {
    const idToKeyMap: Record<string, keyof typeof t.clothing> = {
      'winter-hat': 'winterHat',
      'neck-warmer': 'neckWarmer',
      'mittens-gloves': 'mittensGloves',
      'winter-coat': 'winterCoat',
      'snow-pants': 'snowPants',
      'winter-boots': 'winterBoots',
      'thin-hat': 'lightHat',
      'thin-gloves': 'lightGloves',
      'mid-season-coat': 'midSeasonJacket',
      'mid-season-pants': 'regularPants',
      'rain-winter-boots': 'winterRainBoots',
      'light-coat-vest': 'lightJacketVest',
      'casual-pants': 'casualPants',
      'outdoor-shoes': 'outdoorShoes',
      'long-sleeve-shirt': 'lightLongSleeve',
      'light-pants': 'lightPants',
      'cap-hat': 'capHat',
      'short-sleeve-shirt': 'shortSleeve',
      'shorts-skirt': 'shortsSkirt',
      'sunscreen': 'sunscreen',
    };

    const translationKey = idToKeyMap[itemId];
    return translationKey ? t.clothing[translationKey] : itemId;
  };

  // Show top 4 clothing items for more compact display
  const displayItems = clothingItems.slice(0, 4);
  const translatedLabel = getTranslatedLabel();

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
        {/* Header with time block label */}
        <h3
          className="font-raleway font-bold text-center flex-shrink-0 mb-4"
          style={{
            fontSize: '1.5rem',
            color: '#ff6b00',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 107, 0, 0.4)',
            letterSpacing: '0.04em',
          }}
        >
          {translatedLabel}
        </h3>

        {/* Weather and clothing combined section */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Weather info - more compact */}
          <div className="flex items-center justify-center gap-6">
            <div className="flex-shrink-0" style={{ color: '#C5A572', filter: 'drop-shadow(0 0 8px rgba(197, 165, 114, 0.6))' }}>
              <WeatherIcon
                condition={condition}
                size={72}
              />
            </div>
            <div className="flex flex-col items-center">
              <span
                className="font-raleway font-bold"
                style={{
                  fontSize: '3.5rem',
                  color: '#ffffff',
                  textShadow: '0 3px 6px rgba(0, 0, 0, 0.7), 0 0 15px rgba(197, 165, 114, 0.3)',
                  lineHeight: '1',
                }}
              >
                {Math.round(temperature)}°
              </span>
              {precipitationProbability !== undefined && precipitationProbability > 0 && (
                <div className="flex items-center text-[#4fc3f7] mt-1" style={{ gap: '4px', fontSize: '1rem' }}>
                  <Droplets size={16} />
                  <span>{precipitationProbability}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Clothing section - simplified */}
          <div className="mt-4">
            <div className="flex flex-row items-center justify-center gap-4">
              {displayItems.map((item, index) => {
                const iconFilename = getClothingIcon(item.id);
                const iconUrl = iconFilename ? getClothingIconUrl(iconFilename) : undefined;

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex flex-col items-center"
                    title={translateClothingItem(item.id)}
                  >
                    {iconUrl ? (
                      <img
                        src={iconUrl}
                        alt={item.name}
                        className="flex-shrink-0"
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          objectFit: 'contain',
                          opacity: 0.8,
                          filter:
                            'brightness(0) saturate(100%) invert(60%) sepia(80%) saturate(2000%) hue-rotate(5deg) brightness(105%) contrast(102%)',
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-full bg-[#ff6b00]/20 flex-shrink-0"
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

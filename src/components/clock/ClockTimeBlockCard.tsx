import { Card, CardContent } from '@/components/ui/card';
import type { TimeBlockData } from '@/services/timeBlock/types';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { Droplets, Snowflake, Wind, Sun } from 'lucide-react';
import { getClothingIcon, protectionTint } from '@/services/clothing/clothingIconMap';
import { useLanguage } from '@/contexts/language';
import { getTimeBlockLabel, translateClothingItem } from './timeBlockLabels';
import { getTempDisplay } from './tempDisplay';

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
    feelsLike,
    condition,
    precipitationProbability,
    snowAccumulation,
    uvIndex,
    clothingItems,
    isNextDay,
  } = data;

  // Show up to 4 items, but always keep the weather-driven "protection" items
  // (sunscreen, umbrella) visible — fill the remaining slots with clothing.
  const MAX_ITEMS = 4;
  const protectionItems = clothingItems.filter((item) => protectionTint(item.category));
  const regularItems = clothingItems.filter((item) => !protectionTint(item.category));
  const displayItems = [
    ...regularItems.slice(0, Math.max(0, MAX_ITEMS - protectionItems.length)),
    ...protectionItems,
  ];
  const translatedLabel = getTimeBlockLabel(t, period, isNextDay);
  const temp = getTempDisplay(temperature, feelsLike);

  const showSnow =
    condition === 'snow' && snowAccumulation !== undefined && snowAccumulation > 0;
  const precipPercent =
    precipitationProbability !== undefined ? Math.round(precipitationProbability) : 0;
  const showPrecip = !showSnow && precipPercent > 0;
  // Surface UV on the card only when sun protection is warranted (UV >= 3),
  // matching the threshold that adds sunscreen to the clothing line.
  const uvDisplay = uvIndex !== undefined && uvIndex >= 3 ? Math.round(uvIndex) : null;
  const hasSecondary = temp.showActual || showSnow || showPrecip || uvDisplay !== null;

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
          {/* Weather info - hero row, then one secondary line */}
          <div className="flex flex-col items-center">
            {/* Hero row: condition icon + primary temperature */}
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
                {temp.hero}°
              </span>
            </div>

            {/* Secondary line: actual temperature and precipitation, side by side */}
            {hasSecondary && (
              <div className="flex items-center justify-center" style={{ gap: '18px', marginTop: '10px' }}>
                {temp.showActual && (
                  <span
                    className="flex items-center"
                    style={{ gap: '4px', fontSize: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    <Wind size={15} />
                    {temp.actual}° {t.timeBlockDetail.actual}
                  </span>
                )}
                {showSnow ? (
                  <span className="flex items-center text-[#4fc3f7]" style={{ gap: '4px', fontSize: '1rem' }}>
                    <Snowflake size={16} />
                    {snowAccumulation!.toFixed(1)} cm
                  </span>
                ) : (
                  showPrecip && (
                    <span className="flex items-center text-[#4fc3f7]" style={{ gap: '4px', fontSize: '1rem' }}>
                      <Droplets size={16} />
                      {precipPercent}%
                    </span>
                  )
                )}
                {uvDisplay !== null && (
                  <span className="flex items-center" style={{ gap: '4px', fontSize: '1rem', color: '#C5A572' }}>
                    <Sun size={16} />
                    UV {uvDisplay}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Clothing section - simplified */}
          <div className="mt-4">
            <div className="flex flex-row items-center justify-center gap-4">
              {displayItems.map((item, index) => {
                const iconFilename = getClothingIcon(item.id);
                const iconUrl = iconFilename ? getClothingIconUrl(iconFilename) : undefined;
                const tint = protectionTint(item.category);

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex flex-col items-center"
                    title={translateClothingItem(t, item)}
                  >
                    {iconUrl ? (
                      tint ? (
                        <div
                          className="flex-shrink-0"
                          style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            opacity: 0.9,
                            backgroundColor: tint,
                            WebkitMaskImage: `url(${iconUrl})`,
                            maskImage: `url(${iconUrl})`,
                            WebkitMaskRepeat: 'no-repeat',
                            maskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            maskPosition: 'center',
                            WebkitMaskSize: 'contain',
                            maskSize: 'contain',
                          }}
                        />
                      ) : (
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
                      )
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

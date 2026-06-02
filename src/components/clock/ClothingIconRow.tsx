import type { ClothingItem } from '@/services/clothing/types';
import { getClothingIcon, protectionTint } from '@/services/clothing/clothingIconMap';
import { useLanguage } from '@/contexts/language';
import { translateClothingItem } from './timeBlockLabels';

interface ClothingIconRowProps {
  clothingItems: ClothingItem[];
}

// Dynamic import for clothing icons
const getClothingIconUrl = (iconFilename: string) => {
  try {
    return new URL(`../../assets/clothing/${iconFilename}`, import.meta.url).href;
  } catch {
    return undefined;
  }
};

/**
 * A centered row of clothing icons shared by the time-block and day cards.
 *
 * Shows up to 4 items but always keeps the weather-driven "protection" items
 * (sunscreen, umbrella) visible — the remaining slots are filled with clothing.
 */
export function ClothingIconRow({ clothingItems }: ClothingIconRowProps) {
  const { t } = useLanguage();

  const MAX_ITEMS = 4;
  const protectionItems = clothingItems.filter((item) => protectionTint(item.category));
  const regularItems = clothingItems.filter((item) => !protectionTint(item.category));
  const displayItems = [
    ...regularItems.slice(0, Math.max(0, MAX_ITEMS - protectionItems.length)),
    ...protectionItems,
  ];

  return (
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
  );
}

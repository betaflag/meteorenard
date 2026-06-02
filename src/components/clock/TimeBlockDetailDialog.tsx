import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { TimeBlockData } from '@/services/timeBlock/types';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { getClothingIcon } from '@/services/clothing/clothingIconMap';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  getTimeBlockLabel,
  translateClothingItem,
  translateCondition,
  translateUvLevel,
} from './timeBlockLabels';
import {
  Droplet,
  Droplets,
  Snowflake,
  Wind,
  Thermometer,
  ChevronsUpDown,
  Sun,
  X,
} from 'lucide-react';

interface TimeBlockDetailDialogProps {
  block: TimeBlockData | null;
  onClose: () => void;
}

const getClothingIconUrl = (iconFilename: string) => {
  try {
    return new URL(`../../assets/clothing/${iconFilename}`, import.meta.url).href;
  } catch {
    return undefined;
  }
};

const clothingIconFilter =
  'brightness(0) saturate(100%) invert(60%) sepia(80%) saturate(2000%) hue-rotate(5deg) brightness(105%) contrast(102%)';

const BRASS = '#C5A572';
const ORANGE = '#ff6b00';

// Format a 24-hour value as a compact 12-hour label (e.g. 17 -> "5 pm").
const formatHour = (hour: number): string => {
  const suffix = hour >= 12 ? 'pm' : 'am';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display} ${suffix}`;
};

function SectionHeading({ children }: { children: string }) {
  return (
    <h3
      className="font-raleway font-semibold"
      style={{ color: BRASS, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
    >
      {children}
    </h3>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span style={{ color: BRASS }}>{icon}</span>
      <div className="flex flex-col">
        <span className="text-[#a8a8a8]" style={{ fontSize: '0.875rem' }}>
          {label}
        </span>
        <span className="text-white font-semibold" style={{ fontSize: '1.25rem' }}>
          {value}
        </span>
      </div>
    </div>
  );
}

export function TimeBlockDetailDialog({ block, onClose }: TimeBlockDetailDialogProps) {
  const { t } = useLanguage();

  const showSnow =
    block?.condition === 'snow' &&
    block.snowAccumulation !== undefined &&
    block.snowAccumulation > 0;

  return (
    <Dialog
      open={block !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {block && (
        <DialogContent
          hideCloseButton
          className="flex flex-col gap-0 p-0 overflow-hidden max-w-3xl w-[calc(100vw-2rem)] max-h-[calc(100dvh-1.5rem)]"
        >
          {/* Header (pinned) */}
          <div className="flex items-start justify-between gap-4 shrink-0 px-6 pt-6 pb-3 sm:px-9 sm:pt-8 sm:pb-4">
            <div className="flex flex-col gap-1">
              <DialogTitle
                className="font-raleway font-bold"
                style={{
                  fontSize: 'clamp(1.5rem, 4.2vh, 2.125rem)',
                  color: ORANGE,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 107, 0, 0.4)',
                  letterSpacing: '0.01em',
                }}
              >
                {getTimeBlockLabel(t, block.period, block.isNextDay)}
              </DialogTitle>
              <DialogDescription style={{ fontSize: 'clamp(0.95rem, 2.2vh, 1.125rem)' }}>
                {formatHour(block.startHour)} – {formatHour(block.endHour)}
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <button
                type="button"
                aria-label={t.timeBlockDetail.close}
                className="flex items-center justify-center rounded-full transition-colors"
                style={{
                  width: '52px',
                  height: '52px',
                  flexShrink: 0,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: `1px solid ${BRASS}33`,
                }}
              >
                <X size={24} className="text-[#e5e7eb]" />
              </button>
            </DialogClose>
          </div>

          {/* Scrollable body */}
          <div
            className="flex flex-col gap-5 overflow-y-auto overscroll-contain px-6 sm:px-9"
            style={{ flex: '1 1 auto', minHeight: 0 }}
          >
            {/* Summary: hero + metrics */}
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
              <div className="flex items-center gap-4">
                <div style={{ color: BRASS, filter: 'drop-shadow(0 0 8px rgba(197, 165, 114, 0.6))' }}>
                  <WeatherIcon
                    condition={block.condition}
                    size={80}
                    className="h-[clamp(56px,11vh,80px)] w-[clamp(56px,11vh,80px)]"
                  />
                </div>
                <div className="flex flex-col">
                  <span
                    className="font-raleway font-bold text-white"
                    style={{ fontSize: 'clamp(2.5rem, 8vh, 4.25rem)', lineHeight: '1' }}
                  >
                    {Math.round(block.temperature)}°
                  </span>
                  <span className="text-[#e5e7eb]" style={{ fontSize: 'clamp(1rem, 2.4vh, 1.25rem)' }}>
                    {translateCondition(t, block.condition)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                {block.feelsLike !== undefined && (
                  <Metric
                    icon={<Thermometer size={22} />}
                    label={t.timeBlockDetail.feelsLike}
                    value={`${Math.round(block.feelsLike)}°`}
                  />
                )}
                {block.tempHigh !== undefined && block.tempLow !== undefined && (
                  <Metric
                    icon={<ChevronsUpDown size={22} />}
                    label={`${t.timeBlockDetail.high} / ${t.timeBlockDetail.low}`}
                    value={`${Math.round(block.tempHigh)}° / ${Math.round(block.tempLow)}°`}
                  />
                )}
                {showSnow ? (
                  <Metric
                    icon={<Snowflake size={22} />}
                    label={t.timeBlockDetail.snow}
                    value={`${block.snowAccumulation!.toFixed(1)} cm`}
                  />
                ) : (
                  block.precipitationProbability !== undefined &&
                  block.precipitationProbability > 0 && (
                    <Metric
                      icon={<Droplets size={22} />}
                      label={t.timeBlockDetail.precipitationChance}
                      value={`${Math.round(block.precipitationProbability)}%`}
                    />
                  )
                )}
                {block.windSpeed !== undefined && (
                  <Metric
                    icon={<Wind size={22} />}
                    label={t.timeBlockDetail.wind}
                    value={`${Math.round(block.windSpeed)} km/h`}
                  />
                )}
                {block.humidity !== undefined && (
                  <Metric
                    icon={<Droplet size={22} />}
                    label={t.timeBlockDetail.humidity}
                    value={`${Math.round(block.humidity)}%`}
                  />
                )}
                {block.uvIndex !== undefined && (
                  <Metric
                    icon={<Sun size={22} />}
                    label={t.timeBlockDetail.uvIndex}
                    value={`${Math.round(block.uvIndex)} · ${translateUvLevel(t, block.uvIndex)}`}
                  />
                )}
              </div>
            </div>

            {/* Hourly forecast */}
            {block.hours.length > 0 && (
              <div className="flex flex-col gap-3">
                <SectionHeading>{t.timeBlockDetail.hourlyForecast}</SectionHeading>
                <div className="flex gap-3">
                  {block.hours.map((hour) => (
                    <div
                      key={hour.isoTime}
                      className="flex flex-1 flex-col items-center gap-1.5 rounded-xl px-2 py-3"
                      style={{
                        minWidth: 0,
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: `1px solid ${BRASS}26`,
                      }}
                    >
                      <span className="text-[#a8a8a8]" style={{ fontSize: '0.875rem' }}>
                        {hour.time}
                      </span>
                      <div style={{ color: BRASS }}>
                        <WeatherIcon condition={hour.condition} size={28} />
                      </div>
                      <span className="text-white font-semibold" style={{ fontSize: '1.125rem' }}>
                        {Math.round(hour.temp)}°
                      </span>
                      <span
                        className="flex items-center gap-1 text-[#4fc3f7]"
                        style={{
                          fontSize: '0.8rem',
                          visibility:
                            hour.precipitationProbability !== undefined &&
                            hour.precipitationProbability > 0
                              ? 'visible'
                              : 'hidden',
                        }}
                      >
                        <Droplet size={12} />
                        {hour.precipitationProbability ?? 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended clothing */}
            {block.clothingItems.length > 0 && (
              <div className="flex flex-col gap-3">
                <SectionHeading>{t.timeBlockDetail.recommendedClothing}</SectionHeading>
                <div className="flex flex-wrap gap-x-4 gap-y-4">
                  {block.clothingItems.map((item, index) => {
                    const iconFilename = getClothingIcon(item.id);
                    const iconUrl = iconFilename ? getClothingIconUrl(iconFilename) : undefined;
                    return (
                      <div
                        key={`${item.id}-${index}`}
                        className="flex flex-col items-center gap-2"
                        style={{ width: '80px' }}
                      >
                        <div
                          className="flex items-center justify-center rounded-2xl"
                          style={{
                            width: '60px',
                            height: '60px',
                            background: 'rgba(255, 107, 0, 0.08)',
                            border: '1px solid rgba(255, 107, 0, 0.2)',
                          }}
                        >
                          {iconUrl ? (
                            <img
                              src={iconUrl}
                              alt={item.name}
                              style={{
                                width: '2.25rem',
                                height: '2.25rem',
                                objectFit: 'contain',
                                filter: clothingIconFilter,
                              }}
                            />
                          ) : (
                            <div
                              className="rounded-full"
                              style={{ width: '2.25rem', height: '2.25rem', background: 'rgba(255, 107, 0, 0.25)' }}
                            />
                          )}
                        </div>
                        <span
                          className="text-[#e5e7eb] text-center leading-tight"
                          style={{ fontSize: '0.85rem' }}
                        >
                          {translateClothingItem(t, item.id)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer (pinned) */}
          <div className="shrink-0 flex justify-center px-6 pt-3 pb-6 sm:px-9 sm:pt-4 sm:pb-8">
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-xl font-raleway font-semibold transition-colors"
                style={{
                  padding: '13px 56px',
                  fontSize: '1.0625rem',
                  color: ORANGE,
                  border: '1px solid rgba(255, 107, 0, 0.4)',
                  background: 'rgba(255, 107, 0, 0.08)',
                }}
              >
                {t.timeBlockDetail.close}
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}

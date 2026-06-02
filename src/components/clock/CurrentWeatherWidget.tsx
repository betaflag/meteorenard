import { useLayoutEffect, useRef, useState } from 'react';
import { MapPin, Wind, Sun } from 'lucide-react';
import type { Location } from '@/types/location';
import type { WeatherData } from '@/types/weather';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateCondition } from './timeBlockLabels';
import { getTempDisplay } from './tempDisplay';
import { WeatherFox } from './WeatherFox';

interface CurrentWeatherWidgetProps {
  location: Location | null;
  weather: WeatherData | null;
}

const BUBBLE_FILL = 'rgba(255, 255, 255, 0.08)';
const BUBBLE_BORDER = 'rgba(255, 255, 255, 0.2)';

const locationPillStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 18px',
  borderRadius: '9999px',
  background: BUBBLE_FILL,
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: `1px solid ${BUBBLE_BORDER}`,
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 16px rgba(0, 0, 0, 0.35)',
};

// Corner radius, tail width and tail height for the speech bubble silhouette,
// plus where the tail sits measured from the bubble's right edge (the fox is
// centred on this same point so the two always line up).
const R = 20;
const TAIL_W = 26;
const TAIL_H = 13;
const TAIL_OFFSET_RIGHT = 90;

// Build a rounded-rectangle path with a downward tail near the right of the
// bottom edge, so the frosted fill and the border outline flow around the tail
// as one continuous shape (no detached "diamond").
function bubblePath(w: number, h: number): string {
  const tx = w - TAIL_OFFSET_RIGHT;
  return [
    `M ${R} 0`,
    `H ${w - R}`,
    `Q ${w} 0 ${w} ${R}`,
    `V ${h - R}`,
    `Q ${w} ${h} ${w - R} ${h}`,
    `H ${tx + TAIL_W / 2}`,
    `L ${tx} ${h + TAIL_H}`,
    `L ${tx - TAIL_W / 2} ${h}`,
    `H ${R}`,
    `Q 0 ${h} 0 ${h - R}`,
    `V ${R}`,
    `Q 0 0 ${R} 0`,
    'Z',
  ].join(' ');
}

/** A frosted-glass speech bubble whose tail points straight down at the fox. */
function SpeechBubble({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ w, h }, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const path = w && h ? bubblePath(w, h) : '';

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        display: 'inline-flex',
        padding: '12px 20px',
        borderRadius: `${R}px`,
        boxShadow: '0 8px 22px rgba(0, 0, 0, 0.45)',
      }}
    >
      {path && (
        <>
          {/* Frosted fill, clipped to the bubble + tail silhouette */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${w}px`,
              height: `${h + TAIL_H}px`,
              background: BUBBLE_FILL,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              clipPath: `path('${path}')`,
              zIndex: 0,
            }}
          />
          {/* Border outline tracing the same silhouette */}
          <svg
            width={w}
            height={h + TAIL_H}
            viewBox={`0 0 ${w} ${h + TAIL_H}`}
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, overflow: 'visible', pointerEvents: 'none' }}
          >
            <path d={path} fill="none" stroke={BUBBLE_BORDER} strokeWidth={1} />
          </svg>
        </>
      )}
      <div style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Clock-page top bar: the location pill on the left, and on the right a frosted
 * speech bubble of current conditions with the weather fox tucked beneath it,
 * the bubble's tail pointing down at the fox.
 */
export function CurrentWeatherWidget({ location, weather }: CurrentWeatherWidgetProps) {
  const { t } = useLanguage();
  const current = weather?.current;

  if (!location && !current) {
    return null;
  }

  const temp = current ? getTempDisplay(current.temp, current.feelsLike) : null;
  const uvIndex = weather?.hourly?.[0]?.uvIndex;
  const uvDisplay = uvIndex !== undefined && uvIndex >= 3 ? Math.round(uvIndex) : null;

  return (
    <div className="flex items-start justify-between w-full">
      {location ? (
        <div style={locationPillStyle}>
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

      {weather && (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          {current && temp && (
            <SpeechBubble>
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
                {temp.hero}°
              </span>
              {temp.showActual && (
                <span
                  className="flex items-center font-raleway"
                  style={{ gap: '3px', fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.6)' }}
                >
                  <Wind size={13} />
                  {temp.actual}°
                </span>
              )}
              {uvDisplay !== null && (
                <span
                  className="flex items-center font-raleway"
                  style={{ gap: '3px', fontSize: '0.8125rem', color: '#C5A572' }}
                >
                  <Sun size={13} />
                  UV {uvDisplay}
                </span>
              )}
            </SpeechBubble>
          )}

          {/* Fox centred under the bubble's tail (both keyed to the same offset
              from the right edge). Absolutely positioned so it overhangs the
              page without enlarging the top bar. translateX(50%) puts the fox's
              centre on the tail regardless of its responsive width. */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: `${TAIL_OFFSET_RIGHT}px`,
              transform: 'translateX(50%)',
              marginTop: '16px',
            }}
          >
            <WeatherFox weather={weather} />
          </div>
        </div>
      )}
    </div>
  );
}

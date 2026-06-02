import { useLayoutEffect, useRef, useState } from 'react';
import { Sunrise, Sunset } from 'lucide-react';
import type { WeatherData } from '@/types/weather';

const H = 50; // compact strip height
const PAD = 8; // small inset for the curve/labels (shading still spans edge to edge)
const CURVE_TOP = 23;
const CURVE_BOT = 35;
const AREA_BASE = 36; // temperature area fill baseline
const PRECIP_BASE = 36; // precip bars rise from the curve baseline
const PRECIP_MAX = 6; // tallest precip bar
const DAY_MS = 24 * 60 * 60 * 1000;
const BRASS = '#C5A572';

interface Pt {
  t: number;
  temp: number;
  precip: number;
}

const pad2 = (n: number) => String(n).padStart(2, '0');

// 24-hour "HH:MM" (e.g. 20:42) for sunrise/sunset times.
function fmtTime24(t: number): string {
  const d = new Date(t);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

// 24-hour "HHh" hour label for the timeline ticks (e.g. 15h, 00h).
function fmtHour24(t: number): string {
  return `${pad2(new Date(t).getHours())}h`;
}

/**
 * Compact 24-hour timeline for the bottom bar: a temperature curve over
 * edge-to-edge day/night shading, with sunrise/sunset markers, sparse condition
 * icons, precipitation bars and a "now" anchor. Degrades gracefully when hourly
 * data or sun times are unavailable.
 */
export function HourlyTimeline({ weather }: { weather: WeatherData | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const now = Date.now();
  const end = now + DAY_MS;

  const pts: Pt[] = (weather?.hourly ?? [])
    .map((h) => ({
      t: new Date(h.isoTime).getTime(),
      temp: h.temp,
      precip: h.precipitationProbability ?? 0,
    }))
    .filter((p) => p.t >= now - 60 * 60 * 1000 && p.t <= end);

  // Keep the element mounted so its width can be measured; bail on content only.
  if (!weather || pts.length < 2 || width === 0) {
    return <div ref={ref} style={{ width: '100%', height: H }} />;
  }

  const plotW = width - PAD * 2;
  const xOf = (t: number) => PAD + Math.max(0, Math.min(1, (t - now) / DAY_MS)) * plotW;

  const temps = pts.map((p) => p.temp);
  let lo = Math.min(...temps);
  let hi = Math.max(...temps);
  if (hi === lo) {
    hi += 1;
    lo -= 1;
  }
  const margin = (hi - lo) * 0.18;
  lo -= margin;
  hi += margin;
  const yOf = (temp: number) => CURVE_TOP + (1 - (temp - lo) / (hi - lo)) * (CURVE_BOT - CURVE_TOP);

  const linePath = `M ${pts.map((p) => `${xOf(p.t).toFixed(1)},${yOf(p.temp).toFixed(1)}`).join(' L ')}`;
  const areaPath = `${linePath} L ${xOf(pts[pts.length - 1].t).toFixed(1)},${AREA_BASE} L ${xOf(pts[0].t).toFixed(1)},${AREA_BASE} Z`;

  // Sunrise/sunset events; derive day/night segments across the window.
  const toMs = (arr?: string[]) => (arr ?? []).map((s) => new Date(s).getTime());
  const events = [
    ...toMs(weather.sunrise).map((t) => ({ t, type: 'sunrise' as const })),
    ...toMs(weather.sunset).map((t) => ({ t, type: 'sunset' as const })),
  ].sort((a, b) => a.t - b.t);
  const haveSun = events.length > 0;

  const priorEvents = events.filter((e) => e.t <= now);
  const nowHour = new Date(now).getHours();
  const dayNow = priorEvents.length
    ? priorEvents[priorEvents.length - 1].type === 'sunrise'
    : nowHour >= 6 && nowHour < 20;

  const windowEvents = events.filter((e) => e.t > now && e.t <= end);
  // Shading spans the full width (edge to edge); transitions at each sun event.
  const segments: { x0: number; x1: number; day: boolean }[] = [];
  let cursor = 0;
  let state = dayNow;
  for (const e of windowEvents) {
    const ex = xOf(e.t);
    segments.push({ x0: cursor, x1: ex, day: state });
    cursor = ex;
    state = e.type === 'sunrise';
  }
  segments.push({ x0: cursor, x1: width, day: state });

  const maxPt = pts.reduce((a, b) => (b.temp > a.temp ? b : a));
  const minPt = pts.reduce((a, b) => (b.temp < a.temp ? b : a));
  const ticks = pts.filter((_, i) => i % 3 === 0);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height: H }}>
      <svg width={width} height={H} style={{ position: 'absolute', inset: 0, display: 'block' }}>
        {haveSun &&
          segments.map((s, i) => (
            <rect
              key={i}
              x={s.x0}
              y={0}
              width={Math.max(0, s.x1 - s.x0)}
              height={H}
              fill={s.day ? 'rgba(255, 228, 170, 0.12)' : 'rgba(120, 145, 210, 0.07)'}
            />
          ))}
        {pts.map((p, i) =>
          p.precip > 0 ? (
            <rect
              key={i}
              x={xOf(p.t) - 2}
              y={PRECIP_BASE - (p.precip / 100) * PRECIP_MAX}
              width={4}
              height={(p.precip / 100) * PRECIP_MAX}
              rx={1}
              fill="#4fc3f7"
              opacity={0.5}
            />
          ) : null
        )}
        <path d={areaPath} fill="rgba(197, 165, 114, 0.12)" />
        <path
          d={linePath}
          fill="none"
          stroke={BRASS}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      {haveSun &&
        windowEvents.map((e, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: xOf(e.t),
              top: 1,
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              color: BRASS,
              pointerEvents: 'none',
            }}
          >
            {e.type === 'sunrise' ? <Sunrise size={13} /> : <Sunset size={13} />}
            <span style={{ fontSize: '0.58rem', color: 'rgba(255, 255, 255, 0.75)' }}>{fmtTime24(e.t)}</span>
          </div>
        ))}

      {/* "now" + current temp sitting on the curve's left end */}
      <div
        style={{
          position: 'absolute',
          left: xOf(now),
          top: Math.max(1, yOf(weather.current.temp) - 21),
          display: 'flex',
          flexDirection: 'column',
          lineHeight: 1.05,
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: '0.5rem', letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.6)' }}>now</span>
        <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#ffffff' }}>
          {Math.round(weather.current.temp)}°
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: xOf(maxPt.t),
          top: yOf(maxPt.temp) - 11,
          transform: 'translateX(-50%)',
          fontSize: '0.58rem',
          fontWeight: 700,
          color: '#ffffff',
          pointerEvents: 'none',
        }}
      >
        {Math.round(maxPt.temp)}°
      </div>
      <div
        style={{
          position: 'absolute',
          left: xOf(minPt.t),
          top: yOf(minPt.temp) - 10,
          transform: 'translateX(-50%)',
          fontSize: '0.58rem',
          color: 'rgba(255, 255, 255, 0.8)',
          pointerEvents: 'none',
        }}
      >
        {Math.round(minPt.temp)}°
      </div>

      {ticks.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: xOf(p.t),
            top: H - 11,
            transform: 'translateX(-50%)',
            fontSize: '0.55rem',
            color: 'rgba(255, 255, 255, 0.5)',
            pointerEvents: 'none',
          }}
        >
          {fmtHour24(p.t)}
        </div>
      ))}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { getZonedNow, isForeignZone } from '@/lib/time';

interface ClockDisplayProps {
  /** Location's IANA timezone; the clock follows it. Omit for device time. */
  timeZone?: string;
  /** Short zone label (e.g. "JST"), shown only when the zone isn't the device's. */
  timeZoneAbbreviation?: string;
}

export function ClockDisplay({ timeZone, timeZoneAbbreviation }: ClockDisplayProps) {
  const [currentTime, setCurrentTime] = useState(() => getZonedNow(timeZone));

  useEffect(() => {
    const tick = () => setCurrentTime(getZonedNow(timeZone));

    // Update immediately (e.g. when the timezone changes), then every minute.
    tick();
    const intervalId = setInterval(tick, 60000);

    return () => clearInterval(intervalId);
  }, [timeZone]);

  const showZone = isForeignZone(timeZone) && !!timeZoneAbbreviation;

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('fr-CA', options);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Digital Clock Display - Responsive with tablet optimization */}
      <div
        className="font-bold tracking-wider text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[14rem]"
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          color: '#C5A572', // Brass color
          textShadow: `
            0 0 40px rgba(197, 165, 114, 0.9),
            0 0 60px rgba(197, 165, 114, 0.7),
            0 6px 12px rgba(0, 0, 0, 0.7),
            4px 4px 16px rgba(184, 115, 51, 0.5)
          `,
          letterSpacing: '0.08em',
          lineHeight: '0.9',
          fontWeight: '700',
        }}
      >
        {formatTime(currentTime)}
      </div>

      {/* Date Display - Responsive */}
      <div
        className="font-raleway capitalize text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[3.5rem]"
        style={{
          fontWeight: '600',
          color: '#B87333', // Copper color
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.7), 0 0 20px rgba(184, 115, 51, 0.5)',
          letterSpacing: '0.04em',
          marginTop: '1rem',
          lineHeight: '1.2',
        }}
      >
        {formatDate(currentTime)}
      </div>

      {/* Timezone label, shown only when the clock follows a non-device zone */}
      {showZone && (
        <div
          className="font-raleway uppercase text-sm sm:text-base md:text-lg"
          style={{
            marginTop: '0.75rem',
            padding: '4px 14px',
            borderRadius: '9999px',
            letterSpacing: '0.12em',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.85)',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {timeZoneAbbreviation}
        </div>
      )}
    </div>
  );
}

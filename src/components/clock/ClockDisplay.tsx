import { useState, useEffect } from 'react';

export function ClockDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update every minute
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every 60 seconds

    // Also update immediately
    setCurrentTime(new Date());

    return () => clearInterval(intervalId);
  }, []);

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
    </div>
  );
}

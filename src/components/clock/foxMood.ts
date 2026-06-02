import type { WeatherData } from '@/types/weather';

/**
 * The mascot fox's outfit/pose, chosen to reflect the current weather and time
 * of day. Each value maps to one or more sprites. A single mood wins per the
 * precedence in getFoxMood.
 */
export type WeatherMood =
  | 'snowy'
  | 'stormy'
  | 'rainy'
  | 'cold'
  | 'hot'
  | 'sunny'
  | 'windy'
  | 'foggy'
  | 'sleepy'
  | 'morning'
  | 'cloudy'
  | 'cool'
  | 'warm'
  | 'mild';

/** Calendar specials that take over the fox for a few days around the date. */
export type HolidayMood =
  | 'halloween'
  | 'christmas'
  | 'newyear'
  | 'valentines'
  | 'maple'
  | 'stjean'
  | 'easter'
  | 'stpatrick'
  | 'canadaday'
  | 'thanksgiving'
  | 'earthday'
  | 'groundhog'
  | 'solsticeSummer'
  | 'solsticeWinter'
  | 'aprilfools'
  | 'friday13'
  | 'piday'
  | 'pirate'
  | 'starwars';

/** Celestial treats shown on calm nights (the moon/meteors are out). */
export type NightSkyMood = 'fullmoon' | 'meteor';

export type FoxMood = WeatherMood | HolidayMood | NightSkyMood;

/** Easter Sunday for a year (Anonymous Gregorian computus). */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/** The nth occurrence of a weekday (0 = Sunday) in a month (0 = January). */
function nthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
  const first = new Date(year, month, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month, 1 + offset + (n - 1) * 7);
}

/** True when `now` falls within [base + before, base + after] days, inclusive. */
function withinDays(now: Date, base: Date, before: number, after: number): boolean {
  const start = new Date(base);
  start.setDate(base.getDate() + before);
  start.setHours(0, 0, 0, 0);
  const end = new Date(base);
  end.setDate(base.getDate() + after);
  end.setHours(23, 59, 59, 999);
  return now >= start && now <= end;
}

/**
 * Return the holiday in effect today, or null. Each window is padded by a day
 * on each side so the special fox sticks around a little longer; maple season
 * is a multi-week range. Movable feasts (Easter, Canadian Thanksgiving) are
 * computed per year; fixed dates compare as month*100 + day (Oct 31 = 1031).
 */
export function getHolidayMood(now: Date = new Date()): HolidayMood | null {
  const year = now.getFullYear();
  const md = (now.getMonth() + 1) * 100 + now.getDate();
  const inRange = (start: number, end: number) => md >= start && md <= end;

  // Movable feasts (checked first so they win any overlap with a season).
  if (withinDays(now, easterSunday(year), -2, 1)) return 'easter'; // Good Friday–Easter Monday
  if (withinDays(now, nthWeekdayOfMonth(year, 9, 1, 2), -1, 1)) return 'thanksgiving'; // 2nd Mon of Oct

  // Fixed dates (each padded ±1 day; maple is a multi-week season). Specific
  // days are checked before broad ranges so they win any overlap.
  if (inRange(1030, 1101)) return 'halloween'; // Oct 31
  if (inRange(1220, 1222)) return 'solsticeWinter'; // longest night
  if (inRange(1224, 1226)) return 'christmas'; // Dec 25
  if (md >= 1231 || md <= 102) return 'newyear'; // Dec 31 - Jan 2
  if (inRange(201, 203)) return 'groundhog'; // Feb 2
  if (inRange(213, 215)) return 'valentines'; // Feb 14
  if (inRange(313, 315)) return 'piday'; // Mar 14 (before the maple season)
  if (inRange(316, 318)) return 'stpatrick'; // Mar 17 (before the maple season)
  if (inRange(301, 331)) return 'maple'; // sugar season (March)
  if (inRange(401, 402)) return 'aprilfools'; // Apr 1
  if (inRange(421, 423)) return 'earthday'; // Apr 22
  if (inRange(503, 505)) return 'starwars'; // May the 4th
  if (inRange(620, 622)) return 'solsticeSummer'; // longest day
  if (inRange(623, 625)) return 'stjean'; // Saint-Jean-Baptiste, Jun 24
  if (inRange(630, 702)) return 'canadaday'; // Jul 1
  if (inRange(918, 920)) return 'pirate'; // Talk Like a Pirate Day, Sep 19
  // Friday the 13th — only when no themed holiday already claimed the day.
  if (now.getDate() === 13 && now.getDay() === 5) return 'friday13';
  return null;
}

/**
 * Celestial treat for tonight, or null. Meteor shower peaks (Quadrantids,
 * Perseids, Geminids) take precedence over the monthly full moon. Only meant to
 * be shown at night on otherwise-calm weather.
 */
export function getNightSkyMood(now: Date = new Date()): NightSkyMood | null {
  const md = (now.getMonth() + 1) * 100 + now.getDate();
  const inRange = (start: number, end: number) => md >= start && md <= end;

  if (inRange(103, 104) || inRange(811, 813) || inRange(1212, 1215)) return 'meteor';

  // Full moon: phase age within ~1 day of full (synodic month from a known new moon).
  const SYNODIC = 29.530588853;
  const refNewMoon = Date.UTC(2000, 0, 6, 18, 14) / 86400000;
  const age = (((now.getTime() / 86400000 - refNewMoon) % SYNODIC) + SYNODIC) % SYNODIC;
  if (Math.abs(age - SYNODIC / 2) < 1) return 'fullmoon';

  return null;
}

/**
 * Pick the fox's mood from current conditions and the time of day.
 *
 * Precedence (first match wins): notable weather comes first so the fox always
 * reflects anything worth dressing for — snow/deep-cold, thunderstorm, rain,
 * cold, heat, strong sun, wind, fog. Only when the weather is unremarkable does
 * the time of day take over (sleepy at night, stretching in the morning), then
 * an overcast cloudy fox, otherwise the fox dresses by temperature band:
 * cool (8-18), mild (18-22), warm (22-30).
 *
 * Driven by feels-like (falling back to air temp) plus the nearest hour's UV
 * and wind, mirroring the same signals the cards use.
 */
export function getFoxMood(weather: WeatherData, now: Date = new Date()): FoxMood {
  // A calendar special, when active, takes precedence over the weather.
  const holiday = getHolidayMood(now);
  if (holiday) return holiday;

  const { condition, temp, feelsLike } = weather.current;
  const effectiveTemp = feelsLike ?? temp;
  const uvIndex = weather.hourly[0]?.uvIndex ?? 0;
  const windSpeed = weather.hourly[0]?.windSpeed ?? 0;
  const hour = now.getHours();

  // Notable weather — always takes priority over time of day.
  if (condition === 'snow' || effectiveTemp <= -5) return 'snowy';
  if (condition === 'thunderstorm') return 'stormy';
  if (condition === 'rain' || condition === 'heavy-rain') return 'rainy';
  if (effectiveTemp < 8) return 'cold';
  if (effectiveTemp >= 30) return 'hot';
  if (uvIndex >= 6) return 'sunny';
  if (windSpeed >= 30) return 'windy';
  if (condition === 'fog') return 'foggy';

  // Calm weather — give the fox some personality by time of day, then dress it
  // by temperature band (cold < 8 is already handled above). Calm nights may
  // surface a celestial treat (full moon, meteor shower) before the sleepy fox.
  if (hour >= 21 || hour < 6) return getNightSkyMood(now) ?? 'sleepy';
  if (hour < 9) return 'morning';
  if (condition === 'cloudy') return 'cloudy';
  if (effectiveTemp < 18) return 'cool';
  if (effectiveTemp >= 22) return 'warm';
  return 'mild';
}

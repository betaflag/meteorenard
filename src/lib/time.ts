/**
 * Timezone helpers for showing the selected location's local time.
 *
 * Open-Meteo returns forecast timestamps as naive local-time strings (no
 * offset), which JavaScript parses in the device's zone — so reading their
 * fields back yields the location's wall-clock values. To keep "now" consistent
 * with that, {@link getZonedNow} returns the current moment as a Date whose
 * local fields equal the wall clock in a given IANA timezone. Every comparison
 * and display in the app then operates on one coherent wall-clock timeline.
 */

/**
 * The current time in `timeZone`, returned as a Date whose local getters
 * (getHours, getDate, getMonth, getDay, …) yield that zone's wall-clock values.
 * Falls back to the device clock when the zone is missing or invalid.
 */
export function getZonedNow(timeZone?: string): Date {
  if (!timeZone) return new Date();

  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    }).formatToParts(new Date());

    const field = (type: Intl.DateTimeFormatPartTypes): number =>
      Number(parts.find((p) => p.type === type)?.value);

    // Intl can report midnight as hour 24; normalize to 0.
    const hour = field('hour') % 24;

    return new Date(
      field('year'),
      field('month') - 1,
      field('day'),
      hour,
      field('minute'),
      field('second')
    );
  } catch {
    return new Date();
  }
}

/** The device's own IANA timezone (e.g. "America/Toronto"). */
function deviceTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/** True when `timeZone` is set and differs from the device's own zone. */
export function isForeignZone(timeZone?: string): boolean {
  return !!timeZone && timeZone !== deviceTimeZone();
}

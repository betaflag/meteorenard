// Near-real-time cloud cover from NASA GIBS (no key required): clean infrared
// imagery from the geostationary satellite whose disk covers the location.
// Docs: https://nasa-gibs.github.io/gibs-api-docs/

interface GeostationarySatellite {
  layer: string;
  /** Sub-satellite longitude (degrees) */
  longitude: number;
}

const SATELLITES: GeostationarySatellite[] = [
  { layer: 'GOES-East_ABI_Band13_Clean_Infrared', longitude: -75.2 },
  { layer: 'GOES-West_ABI_Band13_Clean_Infrared', longitude: -137.0 },
  { layer: 'Himawari_AHI_Band13_Clean_Infrared', longitude: 140.7 },
];

// Beyond this angular distance from the sub-satellite point, the disk edge is
// too distorted (or not covered at all — e.g. Europe/Africa have no GIBS
// geostationary layer).
const MAX_LONGITUDE_DISTANCE = 60;

// These layers are only published up to this WMTS zoom level; Leaflet upscales
// past it (maxNativeZoom).
export const CLOUDS_MAX_NATIVE_ZOOM = 6;

const wrappedDistance = (a: number, b: number): number => {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
};

/**
 * Tile URL template ({z}/{x}/{y} placeholders) for infrared cloud imagery
 * covering the given longitude, or null when no satellite covers it.
 * `default` as the WMTS time returns the most recent imagery.
 */
export function cloudTileUrlForLongitude(longitude: number): string | null {
  let best: GeostationarySatellite | null = null;
  let bestDistance = MAX_LONGITUDE_DISTANCE;
  for (const satellite of SATELLITES) {
    const distance = wrappedDistance(longitude, satellite.longitude);
    if (distance <= bestDistance) {
      best = satellite;
      bestDistance = distance;
    }
  }
  if (!best) return null;
  return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${best.layer}/default/default/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png`;
}

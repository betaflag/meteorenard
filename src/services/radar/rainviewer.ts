// RainViewer public weather-maps API (no key required).
// Docs: https://www.rainviewer.com/api/weather-maps-api.html

export interface RadarFrame {
  /** Unix timestamp (seconds) of the frame */
  time: number;
  /** Path fragment used to build the tile URL */
  path: string;
}

export interface RadarMaps {
  host: string;
  /** Precipitation radar frames for the past 2 hours, oldest first */
  radar: RadarFrame[];
}

interface RainViewerResponse {
  host: string;
  radar?: { past?: RadarFrame[]; nowcast?: RadarFrame[] };
}

const API_URL = 'https://api.rainviewer.com/public/weather-maps.json';

export async function fetchRadarMaps(): Promise<RadarMaps> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`RainViewer API request failed with status ${response.status}`);
  }
  const data: RainViewerResponse = await response.json();
  return {
    host: data.host,
    radar: [...(data.radar?.past ?? []), ...(data.radar?.nowcast ?? [])],
  };
}

/**
 * Tile URL template for a radar frame, with {z}/{x}/{y} placeholders left for
 * Leaflet. 512px tiles keep the request count low enough to avoid RainViewer's
 * rate limiting. Color scheme 7 ("Rainbow SELEX-IS"), smooth=1, snow=1.
 */
export const RADAR_TILE_SIZE = 512;

export function frameTileUrl(host: string, frame: RadarFrame): string {
  return `${host}${frame.path}/${RADAR_TILE_SIZE}/{z}/{x}/{y}/7/1_1.png`;
}

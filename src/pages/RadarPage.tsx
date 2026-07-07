import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plus, Minus, CloudRain, Cloud } from 'lucide-react';
import { fetchRadarMaps, frameTileUrl, RADAR_TILE_SIZE } from '@/services/radar/rainviewer';
import type { RadarMaps } from '@/services/radar/rainviewer';
import { cloudTileUrlForLongitude, CLOUDS_MAX_NATIVE_ZOOM } from '@/services/radar/gibsClouds';
import { LocationStorageService } from '@/services/location/LocationStorageService';
import { useLanguage } from '@/contexts/language';
import type { Location } from '@/types/location';

const DEFAULT_ZOOM = 7;
const MIN_ZOOM = 4;
const MAX_ZOOM = 11;
// How many radar frames to animate (last N past frames + nowcast)
const ANIMATION_FRAMES = 10;
const FRAME_INTERVAL_MS = 550;
const LAST_FRAME_PAUSE_MS = 2000;
const RADAR_OPACITY = 0.75;
const CLOUDS_OPACITY = 0.55;
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

// Dark basemap that matches the app's night-sky background
const BASEMAP_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const BASEMAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a> | <a href="https://www.rainviewer.com/">RainViewer</a>';

const glassPillStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  borderRadius: '9999px',
  color: '#ffffff',
  background: 'rgba(14, 17, 28, 0.6)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 16px rgba(0, 0, 0, 0.35)',
};

const zoomButtonStyle: React.CSSProperties = {
  ...glassPillStyle,
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  padding: 0,
  cursor: 'pointer',
  appearance: 'none',
};

interface RadarPageProps {
  /** True while this page is the one shown by the swiper */
  active: boolean;
}

/**
 * Live radar page: precipitation radar + infrared cloud cover (RainViewer)
 * animated over a dark basemap, centered on the current location.
 */
export function RadarPage({ active }: RadarPageProps) {
  const { t, language } = useLanguage();
  const [location, setLocation] = useState<Location | null>(() =>
    LocationStorageService.getCurrentLocation()
  );
  const [radarMaps, setRadarMaps] = useState<RadarMaps | null>(null);
  const [frameTime, setFrameTime] = useState<number | null>(null);
  const [loadError, setLoadError] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);

  // The location is owned by the clock page; re-read it whenever this page
  // becomes visible so a city change over there is reflected here.
  useEffect(() => {
    if (active) setLocation(LocationStorageService.getCurrentLocation());
  }, [active]);

  // Create the map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      attributionControl: true,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      center: [45.5, -73.6], // placeholder until a location is set
      zoom: DEFAULT_ZOOM,
    });
    L.tileLayer(BASEMAP_URL, {
      subdomains: 'abcd',
      attribution: BASEMAP_ATTRIBUTION,
    }).addTo(map);

    // Clouds sit above the basemap, below the radar. The infrared imagery is
    // opaque and false-colored; grayscale + screen blending turns it into a
    // soft white cloud glow over the dark basemap.
    const cloudsPane = map.createPane('clouds');
    cloudsPane.style.zIndex = '250';
    cloudsPane.style.filter = 'grayscale(1) brightness(0.8) contrast(1.7)';
    cloudsPane.style.mixBlendMode = 'screen';
    const radarPane = map.createPane('radar');
    radarPane.style.zIndex = '300';

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // The swiper reveals the page after mount, so Leaflet's initial size can be
  // stale; refresh it when the page becomes visible.
  useEffect(() => {
    if (active) mapRef.current?.invalidateSize();
  }, [active]);

  // Keep the map centered on the current location, with a marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !location) return;
    const center: L.LatLngExpression = [location.latitude, location.longitude];
    map.setView(center, map.getZoom());
    if (markerRef.current) {
      markerRef.current.setLatLng(center);
    } else {
      markerRef.current = L.circleMarker(center, {
        radius: 8,
        color: '#ffffff',
        weight: 2,
        fillColor: '#ff6b00',
        fillOpacity: 1,
      }).addTo(map);
    }
  }, [location]);

  // Fetch the radar frame index now and every 5 minutes
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const maps = await fetchRadarMaps();
        if (!cancelled) {
          setRadarMaps(maps);
          setLoadError(false);
        }
      } catch (err) {
        console.error('Radar frames fetch error:', err);
        if (!cancelled) setLoadError(true);
      }
    };
    load();
    const intervalId = setInterval(load, REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  // Infrared cloud layer for whichever geostationary satellite covers the
  // location. Recreated on each radar refresh so the "default" (latest) GIBS
  // imagery is revalidated.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !location) return;
    const url = cloudTileUrlForLongitude(location.longitude);
    if (!url) return;
    const cloudLayer = L.tileLayer(url, {
      pane: 'clouds',
      opacity: CLOUDS_OPACITY,
      maxNativeZoom: CLOUDS_MAX_NATIVE_ZOOM,
    }).addTo(map);
    return () => {
      cloudLayer.remove();
    };
  }, [location, radarMaps]);

  // Build the animated radar layers for the current frame set
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !radarMaps || radarMaps.radar.length === 0) return;

    // Layers are created upfront but only added to the map the first time
    // their frame is shown, spreading tile requests across the animation
    // cycle instead of firing them all at once (RainViewer rate-limits).
    const frames = radarMaps.radar.slice(-ANIMATION_FRAMES);
    const radarLayers = frames.map((frame) =>
      L.tileLayer(frameTileUrl(radarMaps.host, frame), {
        pane: 'radar',
        opacity: 0,
        tileSize: RADAR_TILE_SIZE,
        zoomOffset: -1,
      })
    );
    const showFrame = (i: number) => {
      if (!map.hasLayer(radarLayers[i])) radarLayers[i].addTo(map);
      radarLayers[i].setOpacity(RADAR_OPACITY);
      setFrameTime(frames[i].time);
    };

    let index = frames.length - 1;
    showFrame(index);

    let timeoutId: ReturnType<typeof setTimeout>;
    const step = () => {
      radarLayers[index].setOpacity(0);
      index = (index + 1) % frames.length;
      showFrame(index);
      const isLastFrame = index === frames.length - 1;
      timeoutId = setTimeout(step, isLastFrame ? LAST_FRAME_PAUSE_MS : FRAME_INTERVAL_MS);
    };
    timeoutId = setTimeout(step, LAST_FRAME_PAUSE_MS);

    return () => {
      clearTimeout(timeoutId);
      radarLayers.forEach((layer) => layer.remove());
    };
  }, [radarMaps]);

  const frameLabel =
    frameTime !== null
      ? new Intl.DateTimeFormat(language === 'fr' ? 'fr-CA' : 'en-CA', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(frameTime * 1000))
      : null;

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: '#0e111c' }}>
      <div ref={mapContainerRef} className="absolute inset-0" />

      {/* Top bar: location + frame time + layer legend */}
      <div
        className="absolute left-0 right-0 flex items-start justify-between"
        style={{ top: '32px', padding: '0 40px', zIndex: 500, pointerEvents: 'none' }}
      >
        <div className="font-raleway" style={{ ...glassPillStyle, flexDirection: 'column', alignItems: 'flex-start', gap: '2px', borderRadius: '24px', padding: '12px 20px' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {location ? location.name : t.radar.title}
          </span>
          <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>
            {loadError ? t.radar.loadError : frameLabel ? `${t.radar.title} · ${frameLabel}` : t.radar.loading}
          </span>
        </div>

        <div className="font-raleway flex" style={{ gap: '12px' }}>
          <span style={{ ...glassPillStyle, fontSize: '0.875rem', fontWeight: 600 }}>
            <CloudRain size={16} style={{ color: '#8fd0ff' }} />
            {t.radar.precipitation}
          </span>
          <span style={{ ...glassPillStyle, fontSize: '0.875rem', fontWeight: 600 }}>
            <Cloud size={16} style={{ color: '#c9d3e0' }} />
            {t.radar.clouds}
          </span>
        </div>
      </div>

      {/* Zoom controls */}
      <div
        className="absolute flex flex-col"
        style={{ right: '40px', bottom: '48px', gap: '12px', zIndex: 500 }}
      >
        <button
          type="button"
          aria-label="Zoom in"
          style={zoomButtonStyle}
          className="transition-transform hover:scale-[1.05] active:scale-95"
          onClick={() => mapRef.current?.zoomIn()}
        >
          <Plus size={22} />
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          style={zoomButtonStyle}
          className="transition-transform hover:scale-[1.05] active:scale-95"
          onClick={() => mapRef.current?.zoomOut()}
        >
          <Minus size={22} />
        </button>
      </div>
    </div>
  );
}

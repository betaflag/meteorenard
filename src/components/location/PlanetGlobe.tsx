import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import { MeshPhongMaterial } from 'three';

export interface GlobePick {
  lat: number;
  lng: number;
}

interface PlanetGlobeProps {
  /** GeoJSON features for country polygons (accurate continents). */
  countries: object[];
  /** Currently picked point, or null when nothing is selected yet. */
  pick: GlobePick | null;
  /** Fired when the child taps a point on the globe. */
  onPick: (pick: GlobePick) => void;
}

// Cheerful flat colours cycled across countries for a cartoon look.
const LAND_COLORS = ['#7cc47f', '#facc5c', '#f4976c', '#9bd1e5', '#c3aed6', '#8fd9a8'];
const OCEAN_COLOR = '#2b6cb0';

const oceanMaterial = new MeshPhongMaterial({ color: OCEAN_COLOR, shininess: 8 });

function landColor(feature: object): string {
  const id = String((feature as { id?: string | number }).id ?? '');
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return LAND_COLORS[hash % LAND_COLORS.length];
}

// Stable accessor identities: react-globe.gl regenerates a layer when a bound
// accessor changes identity, so these stay module-level to avoid re-tessellating
// every country polygon on each render (e.g. when a pin is dropped).
const polygonSideColor = () => 'rgba(0,0,0,0.12)';
const polygonStrokeColor = () => '#1f3a52';
const htmlLat = (d: object) => (d as GlobePick).lat;
const htmlLng = (d: object) => (d as GlobePick).lng;

function makePin(): HTMLElement {
  const el = document.createElement('div');
  el.textContent = '📍';
  el.style.fontSize = '34px';
  el.style.transform = 'translate(-50%, -100%)';
  el.style.pointerEvents = 'none';
  el.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))';
  return el;
}

/**
 * Interactive cartoon Earth built on react-globe.gl: a flat ocean sphere with
 * accurate country polygons, a soft atmosphere glow, and touch-friendly
 * rotate/zoom/pan. Tapping the globe reports the lat/lng to the parent.
 */
export function PlanetGlobe({ countries, pick, onPick }: PlanetGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [{ w, h }, setSize] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Swallow native touch-move inside the globe so a drag can't trigger the
  // browser's pull-to-refresh or overscroll on a tablet. The listener must be
  // non-passive for preventDefault to take effect; OrbitControls drives the
  // camera off pointer events, which are unaffected.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const block = (e: TouchEvent) => e.preventDefault();
    el.addEventListener('touchmove', block, { passive: false });
    return () => el.removeEventListener('touchmove', block);
  }, []);

  // Configure the camera and controls once the globe instance exists.
  // onGlobeReady guarantees globeRef is populated, which a mount-time effect
  // cannot (the <Globe> only renders after the container has been measured).
  useEffect(() => {
    const globe = globeRef.current;
    if (!ready || !globe) return;

    // touch-action is not inherited, so set it on the WebGL canvas itself —
    // this is what tells the browser the canvas owns its touch gestures.
    globe.renderer().domElement.style.touchAction = 'none';

    globe.pointOfView({ lat: 30, lng: -40, altitude: 2.4 });

    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enablePan = true;
    controls.minDistance = 130;
    controls.maxDistance = 500;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 0.8;

    const stopSpin = () => {
      controls.autoRotate = false;
    };
    controls.addEventListener('start', stopSpin);
    return () => controls.removeEventListener('start', stopSpin);
  }, [ready]);

  const pins = pick ? [pick] : [];

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ touchAction: 'none', overscrollBehavior: 'none' }}
    >
      {w > 0 && h > 0 && (
        <Globe
          ref={globeRef}
          width={w}
          height={h}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={oceanMaterial}
          onGlobeReady={() => setReady(true)}
          showAtmosphere
          atmosphereColor="#8fd0ff"
          atmosphereAltitude={0.22}
          polygonsData={countries}
          polygonAltitude={0.012}
          polygonCapColor={landColor}
          polygonSideColor={polygonSideColor}
          polygonStrokeColor={polygonStrokeColor}
          onGlobeClick={({ lat, lng }) => onPick({ lat, lng })}
          onPolygonClick={(_p, _e, { lat, lng }) => onPick({ lat, lng })}
          htmlElementsData={pins}
          htmlLat={htmlLat}
          htmlLng={htmlLng}
          htmlAltitude={0.02}
          htmlElement={makePin}
        />
      )}
    </div>
  );
}

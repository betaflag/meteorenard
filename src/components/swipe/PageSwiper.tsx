import { useCallback, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface PageSwiperProps {
  /** One full-screen element per page */
  pages: ReactNode[];
  /** Notified when the visible page changes (after the swipe settles) */
  onPageChange?: (index: number) => void;
}

// Horizontal drag distance (px) before a gesture counts as a swipe. Below this,
// pointer events pass through untouched so taps on page content keep working.
const DRAG_START_THRESHOLD = 12;
// Fraction of the viewport width the drag must cover to change page.
const PAGE_CHANGE_FRACTION = 0.2;
// A fast flick changes page even under the distance threshold (px/ms).
const FLICK_VELOCITY = 0.5;

/**
 * Full-screen horizontal page swiper for the kiosk display.
 *
 * Pages sit side by side in a translated track. A drag only becomes a swipe
 * once it clearly moves horizontally, so taps and vertical gestures inside
 * pages are unaffected. Dots at the bottom edge show and switch pages.
 */
export function PageSwiper({ pages, onPageChange }: PageSwiperProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const gesture = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startTime: number;
    active: boolean;
  } | null>(null);

  const goToPage = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(pages.length - 1, index));
      if (clamped === pageIndex) return;
      setPageIndex(clamped);
      onPageChange?.(clamped);
    },
    [pages.length, pageIndex, onPageChange]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    gesture.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startTime: e.timeStamp,
      active: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.pointerId !== e.pointerId) return;

    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;

    if (!g.active) {
      // Ignore until the gesture is clearly a horizontal drag
      if (Math.abs(dx) < DRAG_START_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      g.active = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    // Resist dragging past the first/last page
    const atEdge =
      (pageIndex === 0 && dx > 0) || (pageIndex === pages.length - 1 && dx < 0);
    setDragOffset(atEdge ? dx / 3 : dx);
  };

  const endGesture = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.pointerId !== e.pointerId) return;
    gesture.current = null;

    if (!g.active) return;
    setDragging(false);
    setDragOffset(0);

    const dx = e.clientX - g.startX;
    const elapsed = Math.max(1, e.timeStamp - g.startTime);
    const velocity = Math.abs(dx) / elapsed;
    const width = e.currentTarget.clientWidth || window.innerWidth;

    if (Math.abs(dx) > width * PAGE_CHANGE_FRACTION || velocity > FLICK_VELOCITY) {
      goToPage(pageIndex + (dx < 0 ? 1 : -1));
    }
  };

  // Swallow the click that follows a completed swipe so page content
  // underneath the finger doesn't also activate.
  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none"
      style={{ touchAction: 'pan-y', background: '#0e111c' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endGesture}
      onPointerCancel={endGesture}
      onClickCapture={handleClickCapture}
    >
      <div
        className="flex h-full"
        style={{
          width: `${pages.length * 100}%`,
          transform: `translateX(calc(${-pageIndex * (100 / pages.length)}% + ${dragOffset}px))`,
          transition: dragging ? 'none' : 'transform 350ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {pages.map((page, i) => (
          <div key={i} className="relative h-full" style={{ width: `${100 / pages.length}%` }}>
            {page}
          </div>
        ))}
      </div>

      {/* Page indicator dots */}
      {pages.length > 1 && (
        <div
          className="absolute left-1/2 flex"
          style={{ bottom: '8px', transform: 'translateX(-50%)', gap: '10px', zIndex: 50 }}
        >
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Page ${i + 1}`}
              aria-current={i === pageIndex}
              onClick={() => goToPage(i)}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '9999px',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                background:
                  i === pageIndex ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)',
                transition: 'background 200ms',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

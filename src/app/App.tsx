import { useState, useEffect, useRef } from 'react';
import type { MouseEvent, TouchEvent } from 'react';
import Page1 from '../imports/1';
import Page2 from '../imports/2';
import Page3 from '../imports/3';
import Page4 from '../imports/4';
import Page5 from '../imports/5';
import Page6 from '../imports/6';
import Page7 from '../imports/7';
import Page8 from '../imports/8';
import Page9 from '../imports/9';

export default function App() {
  const BASE_PAGE_WIDTH = 595;
  const BASE_PAGE_HEIGHT = 843;
  const TOP_BAR_SPACE = 84;
  const HORIZONTAL_PADDING = 24;
  const BOTTOM_SPACE = 20;

  const [page, setPage] = useState(1);
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : BASE_PAGE_WIDTH,
    height: typeof window !== 'undefined' ? window.innerHeight : BASE_PAGE_HEIGHT,
  }));
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const skipClickRef = useRef(false);

  const pages = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9];
  const CurrentPage = pages[page - 1];
  const goPrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const goNext = () => setPage((prev) => Math.min(prev + 1, pages.length));

  const handlePageClick = (e: MouseEvent<HTMLDivElement>) => {
    if (skipClickRef.current) {
      skipClickRef.current = false;
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isLeftHalf = clickX < rect.width / 2;

    if (isLeftHalf) {
      goPrev();
      return;
    }

    goNext();
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) {
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const swipeThreshold = 36;

    if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      skipClickRef.current = true;
      if (deltaX > 0) {
        goPrev();
      } else {
        goNext();
      }
    }

    touchStartRef.current = null;
  };

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goPrev();
      }
      if (e.key === 'ArrowRight') {
        goNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pages.length]);

  const availableWidth = Math.max(viewport.width - HORIZONTAL_PADDING, 1);
  const availableHeight = Math.max(viewport.height - TOP_BAR_SPACE - BOTTOM_SPACE, 1);
  const pageScale = Math.min(availableWidth / BASE_PAGE_WIDTH, availableHeight / BASE_PAGE_HEIGHT);
  const scaledPageWidth = BASE_PAGE_WIDTH * pageScale;
  const scaledPageHeight = BASE_PAGE_HEIGHT * pageScale;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5', padding: '0' }}>
      <style>{`
        @keyframes pageFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '14px 20px', background: 'white', borderBottom: '1px solid #ddd', zIndex: 100 }}>
        <button
          onClick={goPrev}
          disabled={page === 1}
          style={{ padding: '8px 16px', background: 'white', color: page === 1 ? '#ccc' : '#4eb9bf', border: 'none', borderRadius: '5px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
          ← Назад
        </button>

        <button
          onClick={() => setPage(1)}
          style={{ fontFamily: 'var(--font-display)', color: '#2c2c2c', margin: '0 20px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          aria-label="Перейти на первый слайд">
          {page} / {pages.length}
        </button>

        <button
          onClick={goNext}
          disabled={page === pages.length}
          style={{ padding: '8px 16px', background: 'white', color: page === pages.length ? '#ccc' : '#4eb9bf', border: 'none', borderRadius: '5px', cursor: page === pages.length ? 'not-allowed' : 'pointer' }}>
          Вперёд →
        </button>
      </div>

      <div
        onClick={handlePageClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          marginTop: '84px',
          marginBottom: '20px',
          width: `${scaledPageWidth}px`,
          height: `${scaledPageHeight}px`,
          position: 'relative',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          cursor: 'pointer',
          touchAction: 'pan-y',
        }}>
        <div
          key={page}
          style={{
            width: `${BASE_PAGE_WIDTH}px`,
            height: `${BASE_PAGE_HEIGHT}px`,
            transform: `scale(${pageScale})`,
            transformOrigin: 'top left',
            animation: 'pageFadeIn 280ms ease',
          }}>
          <CurrentPage />
        </div>
      </div>
    </div>
  );
}

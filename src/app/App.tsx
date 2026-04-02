import { useState, useEffect } from 'react';
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
  const [page, setPage] = useState(1);

  const pages = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9];
  const CurrentPage = pages[page - 1];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && page > 1) {
        setPage(page - 1);
      }
      if (e.key === 'ArrowRight' && page < pages.length) {
        setPage(page + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page, pages.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5', padding: '0' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '14px 20px', background: 'white', borderBottom: '1px solid #ddd', zIndex: 100 }}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          style={{ padding: '8px 16px', background: 'white', color: page === 1 ? '#ccc' : '#4eb9bf', border: 'none', borderRadius: '5px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
          ← Назад
        </button>

        <div style={{ fontFamily: 'Unbounded, sans-serif', color: '#2c2c2c', margin: '0 20px' }}>
          {page} / {pages.length}
        </div>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === pages.length}
          style={{ padding: '8px 16px', background: 'white', color: page === pages.length ? '#ccc' : '#4eb9bf', border: 'none', borderRadius: '5px', cursor: page === pages.length ? 'not-allowed' : 'pointer' }}>
          Вперёд →
        </button>
      </div>

      <div style={{ marginTop: '84px', marginBottom: '20px', width: '100%', maxWidth: '595px', height: 'auto', aspectRatio: '595/843', position: 'relative', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', overflow: 'hidden' }}>
        <div style={{ width: '100%', height: '100%', transform: 'scale(1)', transformOrigin: 'top left' }}>
          <CurrentPage />
        </div>
      </div>
    </div>
  );
}
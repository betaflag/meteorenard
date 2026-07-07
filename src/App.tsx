import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { PageSwiper } from './components/swipe/PageSwiper';
import { ClockPage } from './pages/ClockPage';
import { RadarPage } from './pages/RadarPage';

// Kiosk home: swipeable pages, clock first, radar second
function KioskPages() {
  const [pageIndex, setPageIndex] = useState(0);
  return (
    <PageSwiper
      onPageChange={setPageIndex}
      pages={[<ClockPage key="clock" />, <RadarPage key="radar" active={pageIndex === 1} />]}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<KioskPages />} />
          {/* Legacy link: /clock now lives at the root */}
          <Route path="/clock" element={<Navigate to="/" replace />} />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;

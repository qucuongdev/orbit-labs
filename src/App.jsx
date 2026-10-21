import React, { lazy, Suspense, useState } from 'react';
const GlobalSimulator = lazy(() => import('./global/GlobalSimulator.jsx'));
const LegacySimulator = lazy(() => import('./LegacySimulator.jsx'));
export default function App() {
  const [lab, setLab] = useState(new URLSearchParams(location.search).get('mode') === 'lab');
  function switchMode() {
    const next = !lab;
    history.replaceState(null, '', next ? '?mode=lab' : location.pathname);
    setLab(next);
  }
  return <Suspense fallback={<div style={{ padding: 40, color: '#90daca' }}>Đang khởi tạo Mission Control…</div>}>
    {lab ? <><LegacySimulator /><button className="return-global" onClick={switchMode}>◉ Trái Đất 3D</button></> : <GlobalSimulator onLab={switchMode} />}
  </Suspense>;
}

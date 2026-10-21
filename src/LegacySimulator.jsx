import React, { useState, lazy, Suspense } from 'react';
import { AirflowPanel } from './components/telemetry/AirflowPanel.jsx';
import { useRocketSimulation } from './hooks/useRocketSimulation.js';
import { Header } from './components/layout/Header.jsx';
import { RocketCanvas } from './components/3d/RocketCanvas.jsx';
import { ConfigPanel } from './components/controls/ConfigPanel.jsx';
import { FlightDashboard } from './components/telemetry/FlightDashboard.jsx';
import { TelemetryCharts } from './components/telemetry/TelemetryCharts.jsx';
import { MissionSummaryModal } from './components/telemetry/MissionSummaryModal.jsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.jsx';
const FlightMap = lazy(() => import('./components/map/FlightMap.jsx').then(module => ({ default: module.FlightMap })));

export default function App() {
  const [activePanel, setActivePanel] = useState('scene');
  const {
    isCalculating, isLaunchPending, countdown, busy, launchError, hasLiftOffThrust,
    cameraMode, setCameraMode, environmentMode, setEnvironmentMode, cutaway, setCutaway,
    soundEnabled, toggleSound, clockRef, audioRef,
    config,
    setConfig,
    material,
    setMaterial,
    aeroData,
    flightState,
    summaryModalOpen,
    setSummaryModalOpen,
    playbackSpeed,
    setPlaybackSpeed,
    handleLaunch,
    handleReset,
    handlePauseResume,
    isStableForLaunch
  } = useRocketSimulation();

  return (
    <div className="flex flex-col w-screen h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. Header điều hướng */}
      <Header />

      {/* 2. Thanh điều khiển bay & Đồng hồ Telemetry HUD */}
      <FlightDashboard
        isCalculating={isCalculating}
        isLaunchPending={isLaunchPending}
        countdown={countdown}
        flightState={flightState}
        onLaunch={() => { setActivePanel('scene'); handleLaunch(); }}
        onReset={handleReset}
        onPauseResume={handlePauseResume}
        isStable={isStableForLaunch}
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
      />

      <div className="shrink-0 flex flex-wrap items-center gap-2 border-b border-slate-800 px-3 py-2 bg-slate-900 text-[11px] font-mono">
        {[['grid', 'Khung lưới 3D'], ['map', 'Thực tế · Bản đồ']].map(([mode, label]) => <button key={mode} onClick={() => { setEnvironmentMode(mode); setActivePanel('scene'); }} aria-pressed={environmentMode === mode}
          className={`rounded border px-3 py-1.5 ${environmentMode === mode ? 'text-cyan-200 border-cyan-500 bg-cyan-950' : 'text-slate-400 border-slate-700'}`}>{label}</button>)}
        <button onClick={() => { setCutaway(value => !value); setEnvironmentMode('grid'); }} aria-pressed={cutaway} className="rounded border border-slate-700 px-3 py-1.5 text-violet-300">{cutaway ? 'Nội thất: Đang xem' : 'Xem bên trong'}</button>
        <button onClick={toggleSound} aria-pressed={soundEnabled} className="rounded border border-slate-700 px-3 py-1.5 text-amber-200">Âm thanh 3D: {soundEnabled ? 'Bật' : 'Tắt'}</button>
        <span className="text-slate-500">{flightState.currentTelemetry ? `Tầng ${flightState.currentTelemetry.engineStage}/${flightState.currentTelemetry.stageCount}` : 'Sẵn sàng lắp ráp'}</span>
      </div>

      {(launchError || !hasLiftOffThrust) && <div role="alert" className="px-4 py-2 text-xs bg-amber-950 text-amber-200">{launchError || 'Lực đẩy chưa đủ để rời bệ: tăng lực đẩy hoặc giảm khối lượng.'}</div>}
      <nav aria-label="Chọn bảng" className="flex xl:hidden shrink-0 bg-slate-900 border-b border-slate-800">
        {[['config', 'Thiết kế'], ['scene', 'Mô phỏng 3D'], ['telemetry', 'Chỉ số & đồ thị']].map(([id, label]) => <button key={id} onClick={() => setActivePanel(id)} className={`flex-1 p-3 text-xs ${activePanel === id ? 'text-cyan-300 bg-slate-800' : 'text-slate-400'}`}>{label}</button>)}
      </nav>
      {/* 3. Không gian làm việc 3 cột chính */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Cột Trái: Bảng tùy chỉnh kích thước & vật liệu */}
        <aside className={`${activePanel === 'config' ? 'block' : 'hidden'} xl:block w-full xl:w-[300px] shrink-0 h-full`}>
          <ErrorBoundary>
            <ConfigPanel
              config={config}
              onChange={setConfig}
              material={material}
              onMaterialChange={setMaterial}
              aeroData={aeroData}
              disabled={busy}
            />
          </ErrorBoundary>
        </aside>

        {/* Cột Giữa: Khung nhìn 3D tương tác Three.js */}
        <main className={`${activePanel === 'scene' ? 'block' : 'hidden'} xl:block flex-1 min-w-0 h-full relative`}>
          <ErrorBoundary>
            {environmentMode === 'map' ? <Suspense fallback={<div className="p-5 text-cyan-300">Đang tải bản đồ…</div>}>
              <FlightMap config={config} setConfig={setConfig} flightState={flightState} disabled={busy} />
            </Suspense> :
            <RocketCanvas
              config={config}
              material={material}
              aeroData={aeroData}
              flightState={flightState}
              cameraMode={cameraMode}
              setCameraMode={setCameraMode}
              clockRef={clockRef}
              audioRef={audioRef}
              cutaway={cutaway}
              playbackSpeed={playbackSpeed}
            />}
          </ErrorBoundary>
          {countdown !== null && <div role="status" aria-label="Đếm ngược phóng" className="absolute bottom-3 left-3 z-[600] pointer-events-none flex items-center gap-3 rounded-xl border border-cyan-500/40 bg-slate-950/90 px-4 py-2 shadow-lg">
            <strong className="text-4xl font-mono text-cyan-200 tabular-nums">{countdown}</strong>
            <div><span className="text-[10px] tracking-wider text-cyan-200 font-mono">CHUẨN BỊ KHỞI ĐỘNG</span>
            <p className="text-[10px] text-slate-400">Khởi động → tăng lực → rời bệ</p></div>
          </div>}
        </main>

        {/* Cột Phải: Đồ thị Telemetry ECharts */}
        <aside className={`${activePanel === 'telemetry' ? 'block' : 'hidden'} xl:block w-full xl:w-[370px] shrink-0 h-full overflow-y-auto custom-scrollbar bg-slate-900`}>
          <ErrorBoundary>
            <AirflowPanel telemetry={flightState.currentTelemetry} isEngineActive={flightState.isEngineActive} />
            {flightState.events.length > 0 && <section className="p-3 border-b border-slate-700 text-[11px] font-mono">
              <h3 className="text-cyan-300 font-bold mb-2">NHẬT KÝ TÁCH TẦNG</h3>
              {flightState.events.filter(event => event.time <= (flightState.currentTelemetry?.time ?? 0)).map(event => <p key={event.stageIndex} className="text-slate-300 py-1">T+{event.time.toFixed(1)}s · Tách tầng {event.stageIndex + 1} · −{event.discardedMass.toFixed(2)} kg</p>)}
            </section>}
            <div className="h-[420px]"><TelemetryCharts
              trajectoryData={flightState.trajectoryData}
            /></div>
          </ErrorBoundary>
        </aside>
      </div>

      {/* 4. Modal báo cáo tổng kết khi tên lửa hạ cánh */}
      <MissionSummaryModal
        summary={flightState.flightSummary}
        isOpen={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
      />
    </div>
  );
}

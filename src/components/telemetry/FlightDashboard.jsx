import React from 'react';
import { Rocket, RotateCcw, Pause, Play, FastForward } from 'lucide-react';

export function FlightDashboard({
  isCalculating,
  isLaunchPending,
  countdown,
  flightState,
  onLaunch,
  onReset,
  onPauseResume,
  isStable,
  playbackSpeed,
  setPlaybackSpeed
}) {
  const { isFlying, isPaused, currentTelemetry, flightStage } = flightState;

  // Lấy giá trị tức thời hoặc mặc định 0
  const alt = currentTelemetry ? currentTelemetry.altitude : 0;
  const vel = currentTelemetry ? currentTelemetry.velocity : 0;
  const mach = currentTelemetry ? currentTelemetry.mach : 0;
  const gLoad = currentTelemetry ? currentTelemetry.gLoad : 1.0;
  const q = currentTelemetry ? currentTelemetry.dynamicPressure : 0;
  const time = currentTelemetry ? currentTelemetry.time : 0;

  // Màu sắc nhãn giai đoạn bay
  let stageBadge = 'bg-slate-800 text-slate-300 border-slate-700';
  let stageText = 'SẴN SÀNG TRÊN BỆ';

  if (flightStage === 'IGNITION') {
    stageBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/50';
    stageText = 'KHỞI ĐỘNG · GIỮ TRÊN BỆ';
  } else if (flightStage === 'ENGINE_START') {
    stageBadge = 'bg-orange-500/20 text-orange-300 border-orange-500/50';
    stageText = 'ĐỘNG CƠ ĐANG TĂNG LỰC';
  } else if (flightStage === 'POWERED_FLIGHT') {
    stageBadge = 'bg-orange-500/20 text-orange-400 border-orange-500/50 animate-pulse';
    stageText = 'ĐỐT ĐỘNG CƠ (BOOST)';
  } else if (flightStage === 'COASTING') {
    stageBadge = 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
    stageText = 'BAY QUÁN TÍNH (COAST)';
  } else if (flightStage === 'DROGUE_DESCENT') {
    stageBadge = 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50';
    stageText = 'RƠI HÃM DÙ CON (DROGUE)';
  } else if (flightStage === 'MAIN_DESCENT') {
    stageBadge = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    stageText = 'BUNG DÙ CHÍNH (MAIN CHUTE)';
  } else if (flightStage === 'TIME_LIMIT') {
    stageText = 'HẾT THỜI GIAN MÔ PHỎNG';
  } else if (flightStage === 'LANDED') {
    stageBadge = 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    stageText = 'ĐÃ TIẾP ĐẤT (TOUCHDOWN)';
  }

  return (
    <div className="w-full bg-slate-950/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap backdrop-blur-md">
      {/* 1. NÚT PHÓNG / ĐIỀU KHIỂN & TỐC ĐỘ */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {!isFlying ? (
          <button
            type="button"
            onClick={onLaunch}
            disabled={!isStable || isLaunchPending}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider font-mono shadow-lg transition-all ${
              isStable
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50 cursor-pointer active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <Rocket className="w-4 h-4" />
            {countdown !== null ? `Đếm ngược ${countdown}…` : isCalculating ? 'Đang tính quỹ đạo…' : 'Phóng Tên Lửa'}
          </button>
        ) : (
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={onPauseResume}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {isPaused ? 'Tiếp Tục' : 'Tạm Dừng'}
            </button>

          </div>
        )}

        <div role="group" aria-label="Tốc độ mô phỏng" className="flex flex-wrap bg-slate-900 border border-slate-800 rounded-lg p-0.5 font-mono text-[11px]">
          {[0.25, 0.5, 0.75, 1, 2, 4, 8].map(speed => <button key={speed} type="button"
            aria-pressed={playbackSpeed === speed} onClick={() => setPlaybackSpeed(speed)}
            className={`px-2 py-1 rounded transition-all ${playbackSpeed === speed ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}>
            {speed}x
          </button>)}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Đặt Lại
        </button>

        {/* Trạng thái giai đoạn bay */}
        <div className={`px-2.5 py-1 rounded-full border text-[11px] font-mono font-bold tracking-wide uppercase ${stageBadge}`}>
          {stageText}{flightStage === 'POWERED_FLIGHT' && currentTelemetry ? ` · TẦNG ${currentTelemetry.engineStage}` : ''}
        </div>
      </div>

      {/* 2. ĐỒNG HỒ TELEMETRY SỐ THỜI GIAN THỰC */}
      <div className="flex items-center gap-x-6 gap-y-2 flex-wrap font-mono text-xs">
        {/* Đồng hồ T+ */}
        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Thời Gian Bay</span>
          <span className="text-slate-200 font-bold text-sm">
            T+ {time.toFixed(1)}s
          </span>
        </div>

        {/* Độ cao */}
        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Độ Cao (Altitude)</span>
          <span className="text-cyan-400 font-bold text-sm">
            {alt >= 1000 ? `${(alt / 1000).toFixed(2)} km` : `${alt.toFixed(0)} m`}
          </span>
        </div>

        {/* Vận tốc */}
        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Vận Tốc (Speed)</span>
          <span className="text-orange-400 font-bold text-sm">
            {vel.toFixed(0)} m/s
          </span>
        </div>

        {/* Số Mach */}
        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Số Mach</span>
          <span className={`font-bold text-sm ${mach >= 1.0 ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
            M {mach.toFixed(2)}
          </span>
        </div>

        {/* Tải trọng gia tốc G */}
        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Gia Tốc (G-Force)</span>
          <span className="text-yellow-400 font-bold text-sm">
            {gLoad.toFixed(1)} G
          </span>
        </div>

        {/* Áp suất động q */}
        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Áp Suất Động</span>
          <span className="text-pink-400 font-bold text-sm">
            {q.toFixed(1)} kPa
          </span>
        </div>
      </div>
    </div>
  );
}

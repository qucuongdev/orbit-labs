import React from 'react';
import { Award, CheckCircle2, AlertTriangle, X, ShieldAlert } from 'lucide-react';

export function MissionSummaryModal({ summary, isOpen, onClose }) {
  if (!isOpen || !summary) return null;

  const {
    landed,
    flightDurationSec,
    maxAltitudeKm,
    maxAltitudeMeters,
    maxVelocityMs,
    maxMach,
    maxDynamicPressureKPa,
    maxQAltitudeKm,
    maxGLoad,
    apogeeTimeSec,
    landingVelocityMs,
    impactEnergyJoules,
    isSafeLanding
  } = summary;

  return (
    <div role="dialog" aria-modal="true" aria-label="Báo cáo tổng kết chuyến bay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-lg rounded-2xl shadow-2xl p-6 text-slate-100 max-h-[90dvh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tiêu đề & Biểu tượng */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-xl border ${isSafeLanding ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg font-mono tracking-wide">
              Báo Cáo Tổng Kết Chuyến Bay
            </h3>
            <p className="text-xs text-slate-400">
              Dữ liệu trích xuất từ bộ giải vi phân Runge-Kutta bậc 4 (RK4)
            </p>
          </div>
        </div>

        {/* Đánh giá an toàn tiếp đất */}
        <div className={`p-3.5 rounded-xl border mb-5 flex items-start gap-3 ${
          isSafeLanding
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
        }`}>
          {isSafeLanding ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          )}
          <div className="text-xs leading-relaxed">
            <span className="font-bold uppercase tracking-wider block font-mono">
              {!landed ? 'Chưa hoàn tất chuyến bay' : isSafeLanding ? 'Thu Hồi Thành Công (Safe Recovery)' : 'Va Chạm Nguy Hiểm (Hard Impact)'}
            </span>
            {!landed ? <span>Đã đạt giới hạn thời gian mô phỏng khi tên lửa còn trên không. Chưa có dữ liệu tiếp đất.</span> : isSafeLanding ? (
              <span>Dù hãm hai giai đoạn bung chuẩn xác. Vận tốc tiếp đất {landingVelocityMs ?? '?'} m/s an toàn, thiết bị nguyên vẹn.</span>
            ) : (
              <span>Vận tốc tiếp đất {landingVelocityMs ?? '?'} m/s vượt ngưỡng an toàn. Cần tăng diện tích dù chính!</span>
            )}
          </div>
        </div>

        {/* Lưới các thông số chính */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-5">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Độ cao cực đại (Apogee)</span>
            <span className="text-cyan-400 font-bold text-base">{maxAltitudeKm} km</span>
            <span className="text-slate-500 text-[10px] block">tại T+ {apogeeTimeSec}s</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Vận tốc tối đa (Max V)</span>
            <span className="text-orange-400 font-bold text-base">{maxVelocityMs} m/s</span>
            <span className="text-slate-500 text-[10px] block">Mach {maxMach}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Áp suất động Max-Q</span>
            <span className="text-pink-400 font-bold text-base">{maxDynamicPressureKPa} kPa</span>
            <span className="text-slate-500 text-[10px] block">ở độ cao {maxQAltitudeKm} km</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Gia tốc lớn nhất (Max G)</span>
            <span className="text-yellow-400 font-bold text-base">{maxGLoad} G</span>
            <span className="text-slate-500 text-[10px] block">Tổng thời gian: {flightDurationSec}s</span>
          </div>
        </div>

        {/* Năng lượng va chạm cơ học */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <span className="text-slate-300">Động năng va chạm tiếp đất (E_k):</span>
          </div>
          <span className="font-bold text-purple-400">{impactEnergyJoules ?? '?'} Joules</span>
        </div>

        {/* Nút đóng & Xem đồ thị */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-900/30"
        >
          Đóng & Phân Tích Đồ Thị Chi Tiết
        </button>
      </div>
    </div>
  );
}

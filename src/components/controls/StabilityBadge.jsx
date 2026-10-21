import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export function StabilityBadge({ aeroData }) {
  if (!aeroData) return null;

  const {
    staticMarginInitial,
    status,
    statusMessage,
    xCp,
    xCgInitial,
    dryMass,
    initialMass
  } = aeroData;

  const sm = staticMarginInitial;

  // Cấu hình màu sắc theo trạng thái
  let badgeColor = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
  let Icon = ShieldCheck;
  let statusTitle = 'ỔN ĐỊNH TỐI ƯU';

  if (status === 'UNSTABLE_SEVERE' || sm < 0) {
    badgeColor = 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse';
    Icon = AlertOctagon;
    statusTitle = 'MẤT ỔN ĐỊNH NGHIÊM TRỌNG';
  } else if (status === 'MARGINAL_UNSTABLE' || sm < 1.0) {
    badgeColor = 'bg-amber-500/20 border-amber-500/40 text-amber-400';
    Icon = AlertTriangle;
    statusTitle = 'BIÊN ĐỘ THẤP (NGUY HIỂM)';
  } else if (status === 'OVER_STABLE' || sm > 3.0) {
    badgeColor = 'bg-sky-500/20 border-sky-500/40 text-sky-400';
    Icon = AlertTriangle;
    statusTitle = 'QUÁ ỔN ĐỊNH (NHẠY GIÓ)';
  }

  return (
    <div className={`p-3.5 rounded-xl border ${badgeColor} backdrop-blur-md transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider font-mono">
            {statusTitle}
          </span>
        </div>
        <span className="font-mono font-bold text-sm bg-slate-900/60 px-2 py-0.5 rounded border border-white/10">
          {sm.toFixed(2)} Calibers
        </span>
      </div>

      <p className="text-[11px] leading-relaxed text-slate-300 mb-3">
        {statusMessage}
      </p>

      {/* Thanh đo trực quan Calibers */}
      <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden p-0.5 border border-white/5 mb-3">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            sm < 1.0 ? 'bg-rose-500' : sm <= 2.5 ? 'bg-emerald-500' : 'bg-sky-500'
          }`}
          style={{ width: `${Math.min(100, Math.max(5, (sm / 4.0) * 100))}%` }}
        />
      </div>

      {/* Lưới thông số khí động học nhanh */}
      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-white/10">
        <div>
          Trọng tâm (CG): <span className="text-emerald-400 font-bold">{xCgInitial.toFixed(2)}m</span>
        </div>
        <div>
          Tâm áp suất (CP): <span className="text-rose-400 font-bold">{xCp.toFixed(2)}m</span>
        </div>
        <div>
          Khối lượng cạn: <span className="text-slate-200 font-bold">{dryMass.toFixed(2)} kg</span>
        </div>
        <div>
          Tổng cất cánh: <span className="text-cyan-400 font-bold">{initialMass.toFixed(2)} kg</span>
        </div>
      </div>
    </div>
  );
}

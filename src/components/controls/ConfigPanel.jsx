import React from 'react';
import { MATERIALS } from '../../physics/materials.js';
import { StabilityBadge } from './StabilityBadge.jsx';
import { Sliders, Wrench, Flame, Box, Compass } from 'lucide-react';
import { StageEditor } from './StageEditor.jsx';

export function ConfigPanel({ config, onChange, material, onMaterialChange, aeroData, disabled = false }) {
  const updateConfig = (field, value) => {
    onChange({
      ...config,
      [field]: Number(value)
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900/90 border-r border-slate-800 text-slate-100 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2 text-cyan-400">
          <Sliders className="w-5 h-5" />
          <h2 className="font-bold text-sm tracking-wider uppercase font-mono">
            Bảng Thiết Kế & Chế Tạo
          </h2>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Tùy chỉnh thông số hình học, cánh và hệ thống đẩy thời gian thực
        </p>
      </div>

      <div className="p-4 space-y-5">
        {/* ================= 1. CHỈ BÁO ĐỘ ỔN ĐỊNH TĨNH ================= */}
        <StabilityBadge aeroData={aeroData} />
        <StageEditor config={config} onChange={onChange} disabled={disabled} />

        {/* ================= 2. CHỌN VẬT LIỆU CHẾ TẠO ================= */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
            <Box className="w-4 h-4 text-amber-400" />
            Vật Liệu Cấu Trúc
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {Object.values(MATERIALS).map((mat) => {
              const isSelected = material.id === mat.id;
              return (
                <button
                  key={mat.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onMaterialChange(mat)}
                  className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 font-semibold shadow-sm'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{mat.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">{mat.density} kg/m³</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-normal truncate">
                    {mat.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= 3. THÔNG SỐ HÌNH HỌC THÂN ================= */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
            <Wrench className="w-4 h-4 text-cyan-400" />
            Kích Thước Thân & Mũi
          </label>

          {/* Đường kính thân */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Đường kính thân (d):</span>
              <span className="font-mono text-cyan-400 font-bold">{config.bodyDiameter.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min="0.08"
              max="0.60"
              step="0.01"
              disabled={disabled}
              value={config.bodyDiameter}
              onChange={(e) => updateConfig('bodyDiameter', e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Chiều dài thân trụ */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Chiều dài thân (L_body):</span>
              <span className="font-mono text-cyan-400 font-bold">{config.bodyLength.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min="0.80"
              max="5.00"
              step="0.10"
              disabled={disabled}
              value={config.bodyLength}
              onChange={(e) => updateConfig('bodyLength', e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Chiều dài chóp mũi */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Chiều dài chóp mũi (L_nose):</span>
              <span className="font-mono text-cyan-400 font-bold">{config.noseLength.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min="0.20"
              max="1.50"
              step="0.05"
              disabled={disabled}
              value={config.noseLength}
              onChange={(e) => updateConfig('noseLength', e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Bề dày vỏ kim loại */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Bề dày vỏ thân (t):</span>
              <span className="font-mono text-cyan-400 font-bold">{(config.wallThickness * 1000).toFixed(1)} mm</span>
            </div>
            <input
              type="range"
              min="0.001"
              max="0.008"
              step="0.0005"
              disabled={disabled}
              value={config.wallThickness}
              onChange={(e) => updateConfig('wallThickness', e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>

        {/* ================= 4. THÔNG SỐ CÁNH ĐUÔI ================= */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
            <Compass className="w-4 h-4 text-emerald-400" />
            Cụm Cánh Khí Động (Fins)
          </label>

          {/* Số cánh */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Số lượng cánh:</span>
            <div className="flex gap-2">
              {[0, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  disabled={disabled}
                  onClick={() => updateConfig('finCount', count)}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold border transition-all ${
                    config.finCount === count
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {count === 0 ? 'Không cánh' : `${count} cánh`}
                </button>
              ))}
            </div>
          </div>

          {config.finCount > 0 && (
            <>
              {/* Sải cánh */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Sải cánh (s):</span>
                  <span className="font-mono text-emerald-400 font-bold">{config.finSpan.toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min="0.04"
                  max="0.35"
                  step="0.01"
                  disabled={disabled}
                  value={config.finSpan}
                  onChange={(e) => updateConfig('finSpan', e.target.value)}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Dây cánh gốc */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Dây cánh gốc (C_root):</span>
                  <span className="font-mono text-emerald-400 font-bold">{config.finRootChord.toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.60"
                  step="0.02"
                  disabled={disabled}
                  value={config.finRootChord}
                  onChange={(e) => updateConfig('finRootChord', e.target.value)}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Dây cánh đỉnh */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Dây cánh đỉnh (C_tip):</span>
                  <span className="font-mono text-emerald-400 font-bold">{config.finTipChord.toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min="0.02"
                  max="0.30"
                  step="0.01"
                  disabled={disabled}
                  value={config.finTipChord}
                  onChange={(e) => updateConfig('finTipChord', e.target.value)}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>
            </>
          )}
        </div>

        {/* ================= 5. ĐỘNG CƠ & NHIÊN LIỆU ================= */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
            <Flame className="w-4 h-4 text-orange-400" />
            Hệ Thống Đẩy & Nhiên Liệu
          </label>

          {config.stages?.length ? <p className="text-xs text-slate-400">Chỉnh từng động cơ trong mục Lắp ráp đa tầng phía trên.</p> : <>
          {/* Lực đẩy */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Lực đẩy động cơ (T):</span>
              <span className="font-mono text-orange-400 font-bold">{config.thrustVac} N</span>
            </div>
            <input
              type="range"
              min="200"
              max="8000"
              step="50"
              disabled={disabled}
              value={config.thrustVac}
              aria-label="Lực đẩy động cơ"
              onChange={(e) => updateConfig('thrustVac', e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-400"
            />
          </div>

          {/* Thời gian đốt */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Thời gian cháy (t_burn):</span>
              <span className="font-mono text-orange-400 font-bold">{config.burnTime.toFixed(1)} s</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="120.0"
              step="0.5"
              disabled={disabled}
              value={config.burnTime}
              aria-label="Thời gian cháy"
              onChange={(e) => updateConfig('burnTime', e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-400"
            />
          </div>

          {/* Khối lượng thuốc phóng */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Khối lượng nhiên liệu (m_prop):</span>
              <span className="font-mono text-orange-400 font-bold">{config.propellantMass.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="25.0"
              step="0.5"
              disabled={disabled}
              value={config.propellantMass}
              onChange={(e) => updateConfig('propellantMass', e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-400"
            />
          </div>
          </>}
        </div>
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">Gió & hệ thống thu hồi</h3>
          <label className="block text-xs text-slate-400">
            Gió ngang: <strong className="text-cyan-300 font-mono">{config.windSpeed ?? 0} m/s</strong>
            <input aria-label="Gió ngang" type="range" min="-20" max="20" step="0.1" value={config.windSpeed ?? 0} disabled={disabled}
              onChange={e => updateConfig('windSpeed', e.target.value)} className="w-full mt-2 accent-cyan-400" />
          </label>
          <p className="text-[10px] text-slate-500">Gió đều theo phương ngang; số âm đảo chiều gió. Đung đưa thân dưới dù là hiệu ứng minh họa.</p>
          {[['drogueDiameter', 'Đường kính dù con', 0.3, 1.2, 0.6], ['mainDiameter', 'Đường kính dù chính', 1, 4, 2.4]].map(([field, label, min, max, fallback]) => <label key={field} className="block text-xs text-slate-400">
            {label}: <strong className="text-cyan-300 font-mono">{(config[field] ?? fallback).toFixed(1)} m</strong>
            <input aria-label={label} type="range" min={min} max={max} step="0.1" value={config[field] ?? fallback} disabled={disabled}
              onChange={e => updateConfig(field, e.target.value)} className="w-full mt-2 accent-cyan-400" />
          </label>)}
        </div>
      </div>
    </div>
  );
}

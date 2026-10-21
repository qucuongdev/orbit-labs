import React from 'react';
import { PLUME_ZONES } from '../../physics/telemetry.js';

export function AirflowPanel({ telemetry, isEngineActive }) {
  const speed = telemetry?.airspeed ?? 0;
  const mach = telemetry?.mach ?? 0;
  const hasJet = isEngineActive && (telemetry?.throttle ?? 0) > 0.01;
  return <section className="p-4 border-b border-slate-700 space-y-3 text-xs">
    <h2 className="font-mono font-bold text-cyan-300 uppercase">Tốc độ & tải khí động</h2>
    <div className="grid grid-cols-2 gap-2 font-mono">
      {[['Tốc độ qua không khí', `${(speed * 3.6).toFixed(0)} km/h`],
        ['Vận tốc', `${speed.toFixed(1)} m/s`],
        ['Mach', mach.toFixed(2)],
        ['Áp suất động q', `${(telemetry?.dynamicPressure ?? 0).toFixed(1)} kPa`],
        ['Tải q × diện tích thân', `${(telemetry?.airLoadN ?? 0).toFixed(0)} N`],
        ['Gió ngang', `${(telemetry?.windSpeed ?? 0).toFixed(1)} m/s`],
        ['Khối lượng hiện tại', telemetry ? `${telemetry.mass.toFixed(2)} kg` : '—'],
        ['Lực đẩy hiện tại', `${(telemetry?.thrust ?? 0).toFixed(0)} N`],
        ['Mức lực đẩy', `${((telemetry?.throttle ?? 0) * 100).toFixed(0)} %`],
        ['TWR nâng thẳng đứng', (telemetry?.thrustToWeight ?? 0).toFixed(2)],
        ['Isp suy từ cấu hình', telemetry ? `${telemetry.effectiveIsp.toFixed(1)} s` : '—'],
        ['Tầng đang mang', telemetry ? `${telemetry.engineStage} / ${telemetry.stageCount}` : '—'],
        ['Nghiêng thân', `${(telemetry?.bodyTiltDeg ?? 0).toFixed(1)}°`],
        ['Tốc độ âm thanh', telemetry ? `${telemetry.speedOfSound?.toFixed(0)} m/s` : '—']].map(([label, value]) =>
        <div key={label} className="bg-slate-950 rounded p-2"><div className="text-slate-400 text-[10px]">{label}</div><strong className="text-slate-100">{value}</strong></div>)}
    </div>
    <p className="text-slate-400">{mach >= 1 ? 'Đang bay siêu âm' : mach >= 0.8 ? 'Đang bay xuyên âm' : 'Đang bay dưới âm'}. Tốc độ qua khí đã trừ gió ngang; tải q × A là chỉ số tham chiếu, không phải lực cản.</p>
    <h2 className="font-mono font-bold text-orange-300 pt-2">Nhiệt luồng phụt · {hasJet ? 'ĐANG PHUN' : isEngineActive ? 'MỒI ĐỘNG CƠ' : 'ĐỘNG CƠ TẮT'}</h2>
    <table className="w-full text-left"><caption className="sr-only">Preset nhiệt độ minh họa theo vùng màu lửa</caption><thead><tr className="text-slate-400"><th className="py-1">Vùng màu</th><th className="text-right">Ước tính minh họa</th></tr></thead>
      <tbody>{PLUME_ZONES.map(zone => <tr key={zone.name} className="border-t border-slate-800"><td className="py-2"><span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: zone.color }} />{zone.name}</td><td className="text-right font-mono">{hasJet ? `~${zone.temperatureC.toLocaleString('vi-VN')} °C` : '—'}</td></tr>)}</tbody>
    </table>
    <p className="text-[10px] text-slate-400">Preset phục vụ minh họa màu trong cảnh 3D, không phải số đo hoặc kết quả nhiệt hóa học. Màu lửa còn phụ thuộc thành phần nhiên liệu và điều kiện cháy.</p>
  </section>;
}

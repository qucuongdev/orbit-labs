import React from 'react';
import { getEngineStages, makeStageAssembly } from '../../physics/stages.js';

export function StageEditor({ config, onChange, disabled }) {
  const stages = getEngineStages(config);
  const updateStage = (index, field, value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return;
    onChange(previous => ({ ...previous, stages: getEngineStages(previous).map((stage, i) => i === index ? { ...stage, [field]: number } : stage) }));
  };
  return <section className="space-y-3 border-b border-slate-800 pb-4">
    <div className="flex items-center justify-between gap-2">
      <h3 className="text-xs font-bold font-mono text-cyan-300">LẮP RÁP ĐA TẦNG</h3>
      <select aria-label="Số tầng động cơ" disabled={disabled} value={stages.length} onChange={e => onChange(previous => makeStageAssembly(previous, Number(e.target.value)))} className="bg-slate-800 text-cyan-200 border border-slate-600 rounded p-1 text-xs">
        {[1, 2, 3].map(count => <option key={count} value={count}>{count} tầng</option>)}
      </select>
    </div>
    {stages.map((stage, index) => <fieldset key={index} disabled={disabled} className="rounded-lg border border-slate-700 bg-slate-950/60 p-2.5 space-y-2">
      <legend className="text-xs px-1 font-mono text-orange-300">Tầng {index + 1}{index === 0 ? ' · Dưới cùng' : ''}</legend>
      {[['thrust', 'Lực đẩy (N)', 100, 34500000, 100], ['burnTime', 'Thời gian cháy (s)', 0.5, 500, 0.5],
        ['propellantMass', 'Nhiên liệu (kg)', 0.1, 2800000, 0.1], ['dryMass', 'Động cơ khô (kg)', 0.1, 200000, 0.1]].map(([field, label, min, max, step]) =>
        <label key={field} className="flex items-center justify-between gap-2 text-[10px] text-slate-400">{label}
          <input aria-label={`Tầng ${index + 1} ${label}`} type="number" min={min} max={max} step={step} value={stage[field]}
            onChange={e => updateStage(index, field, e.target.value)} className="w-24 rounded bg-slate-800 border border-slate-700 p-1 text-slate-100 font-mono" />
        </label>)}
    </fieldset>)}
    <p className="text-[10px] text-slate-500">Tầng đánh số từ dưới lên. Hết nhiên liệu → bỏ động cơ và phần vỏ tầng đó → khởi động tầng kế. Tầng rời rơi trong hoạt ảnh minh họa.</p>
    <label className="flex items-center justify-between gap-2 text-[10px] text-slate-400">Tăng lực khởi động (s)
      <input aria-label="Thời gian tăng lực khởi động" type="number" min="0" max="10" step="0.1" value={config.ignitionDuration ?? 2.5} disabled={disabled}
        onChange={e => { const value = Number(e.target.value); if (Number.isFinite(value)) onChange(previous => ({ ...previous, ignitionDuration: Math.max(0, Math.min(10, value)) })); }}
        className="w-20 rounded bg-slate-800 border border-slate-700 p-1 text-white" />
    </label>
    <p className="text-[10px] text-slate-500">Lực đẩy tăng theo đường cong gần đúng; mỗi tầng giới hạn thời gian tăng lực tối đa bằng nửa thời gian cháy. Tầng đầu giữ trên bệ đến khi tăng lực xong và lực nâng lớn hơn trọng lượng.</p>
    <details className="text-[10px] text-slate-400">
      <summary className="cursor-pointer text-cyan-400">Công thức & nguồn NASA</summary>
      <p className="my-2">a = (T − D − mg) / m theo phương thẳng đứng; T = ṁ × Isp × g₀. Isp hiển thị được suy ra từ lực đẩy, nhiên liệu và thời gian cháy đã nhập. Đường tăng lực là giả định có thể chỉnh, chưa phải dữ liệu thử động cơ cụ thể.</p>
      <a className="underline text-cyan-300 block" href="https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/thrust-to-weight-ratio/" target="_blank" rel="noreferrer">NASA Glenn · Lực đẩy / trọng lượng</a>
      <a className="underline text-cyan-300 block" href="https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/specific-impulse/" target="_blank" rel="noreferrer">NASA Glenn · Isp và lưu lượng</a>
      <a className="underline text-cyan-300 block" href="https://www.nasa.gov/history/sts-41d-and-the-first-space-shuttle-launch-pad-abort/" target="_blank" rel="noreferrer">NASA · Khởi động trước khi rời bệ</a>
    </details>
    <details className="text-[10px] text-slate-400">
      <summary className="cursor-pointer text-cyan-400">Thông số mở rộng & mốc tham khảo</summary>
      <p className="my-2">Mốc dân dụng Saturn V: cao khoảng 111 m, lực đẩy 34,5 MN. Đây là mốc quy mô tham khảo, không phải giới hạn tuyệt đối của mọi tên lửa.</p>
      <a href="https://www.nasa.gov/learning-resources/for-kids-and-students/what-was-the-saturn-v-grades-5-8/" target="_blank" rel="noreferrer" className="underline text-cyan-400">Nguồn NASA · Saturn V</a>
      {[['bodyLength', 'Chiều dài thân (m)', 0.8, 110, 0.1], ['bodyDiameter', 'Đường kính thân (m)', 0.08, 10.06, 0.01],
        ['payloadMass', 'Tải trọng (kg)', 0.1, 100000, 0.1]].map(([field, label, min, max, step]) => <label key={field} className="flex items-center justify-between gap-2 mt-2">{label}
        <input type="number" aria-label={`Mở rộng ${label}`} min={min} max={max} step={step} disabled={disabled} value={config[field]} onChange={e => {
          const value = Number(e.target.value);
          if (Number.isFinite(value)) onChange(previous => ({ ...previous, [field]: Math.max(min, Math.min(max, value)) }));
        }} className="w-24 rounded bg-slate-800 border border-slate-700 p-1 text-white" />
      </label>)}
      <p className="mt-2 text-amber-300">Mô hình 2D chưa có quỹ đạo quanh Trái Đất, gió tầng cao, địa hình hoặc khí động thay đổi sau tách tầng. Cấu hình lớn chỉ dùng minh họa.</p>
    </details>
  </section>;
}

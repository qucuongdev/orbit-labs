import React, { useState } from 'react';
import ReactEChartsRaw from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { Activity } from 'lucide-react';

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent, CanvasRenderer]);

// Xử lý an toàn tương thích ESM / CJS của Vite cho echarts-for-react
const ReactECharts = typeof ReactEChartsRaw === 'function'
  ? ReactEChartsRaw
  : (ReactEChartsRaw?.default?.default || ReactEChartsRaw?.default || ReactEChartsRaw);

export const TelemetryCharts = React.memo(function TelemetryCharts({ trajectoryData }) {
  const [activeTab, setActiveTab] = useState('alt-vel'); // 'alt-vel' | 'press-g'

  if (!trajectoryData || trajectoryData.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 font-mono text-xs p-6 text-center border-l border-slate-800 bg-slate-900/90">
        <Activity className="w-8 h-8 text-slate-600 mb-2 opacity-50" />
        <span>Chưa có dữ liệu bay.</span>
        <span className="text-[11px] text-slate-600 mt-1">Bấm nút "Phóng Tên Lửa" để mô phỏng và vẽ đồ thị Telemetry thời gian thực.</span>
      </div>
    );
  }

  const times = trajectoryData.map((d) => d.time);
  const altitudes = trajectoryData.map((d) => (d.altitude / 1000.0).toFixed(2)); // km
  const velocities = trajectoryData.map((d) => d.velocity); // m/s
  const dynPressures = trajectoryData.map((d) => d.dynamicPressure); // kPa
  const gLoads = trajectoryData.map((d) => d.gLoad); // G

  // Cấu hình đồ thị 1: Độ cao (km) & Vận tốc (m/s)
  const optionAltVel = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 11, fontFamily: 'monospace' }
    },
    legend: {
      data: ['Độ cao (km)', 'Vận tốc (m/s)'],
      textStyle: { color: '#94a3b8', fontSize: 11 },
      top: 5
    },
    grid: { left: 45, right: 55, top: 40, bottom: 45 },
    xAxis: {
      type: 'category',
      data: times,
      name: 'Thời gian (s)',
      nameLocation: 'middle',
      nameGap: 24,
      axisLine: { lineStyle: { color: '#475569' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Độ cao (km)',
        axisLine: { lineStyle: { color: '#00f0ff' } },
        splitLine: { lineStyle: { color: '#1e293b' } },
        axisLabel: { color: '#00f0ff', fontSize: 10 }
      },
      {
        type: 'value',
        name: 'Vận tốc (m/s)',
        axisLine: { lineStyle: { color: '#f97316' } },
        splitLine: { show: false },
        axisLabel: { color: '#f97316', fontSize: 10 }
      }
    ],
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
      { type: 'slider', height: 16, bottom: 2, borderColor: '#334155', fillerColor: 'rgba(0, 240, 255, 0.1)' }
    ],
    series: [
      {
        name: 'Độ cao (km)',
        type: 'line',
        data: altitudes,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2.5, color: '#00f0ff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 240, 255, 0.3)' },
              { offset: 1, color: 'rgba(0, 240, 255, 0.0)' }
            ]
          }
        }
      },
      {
        name: 'Vận tốc (m/s)',
        type: 'line',
        yAxisIndex: 1,
        data: velocities,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: '#f97316', type: 'dashed' }
      }
    ]
  };

  // Cấu hình đồ thị 2: Áp suất động Max-Q (kPa) & Tải trọng gia tốc (G)
  const optionPressG = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 11, fontFamily: 'monospace' }
    },
    legend: {
      data: ['Áp suất động q (kPa)', 'Gia tốc (G)'],
      textStyle: { color: '#94a3b8', fontSize: 11 },
      top: 5
    },
    grid: { left: 45, right: 45, top: 40, bottom: 45 },
    xAxis: {
      type: 'category',
      data: times,
      name: 'Thời gian (s)',
      nameLocation: 'middle',
      nameGap: 24,
      axisLine: { lineStyle: { color: '#475569' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Áp suất động (kPa)',
        axisLine: { lineStyle: { color: '#ec4899' } },
        splitLine: { lineStyle: { color: '#1e293b' } },
        axisLabel: { color: '#ec4899', fontSize: 10 }
      },
      {
        type: 'value',
        name: 'Gia tốc (G)',
        axisLine: { lineStyle: { color: '#eab308' } },
        splitLine: { show: false },
        axisLabel: { color: '#eab308', fontSize: 10 }
      }
    ],
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
      { type: 'slider', height: 16, bottom: 2, borderColor: '#334155', fillerColor: 'rgba(236, 72, 153, 0.1)' }
    ],
    series: [
      {
        name: 'Áp suất động q (kPa)',
        type: 'line',
        data: dynPressures,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2.5, color: '#ec4899' }
      },
      {
        name: 'Gia tốc (G)',
        type: 'line',
        yAxisIndex: 1,
        data: gLoads,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: '#eab308' }
      }
    ]
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900/90 border-l border-slate-800 p-3">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          Đồ Thị Telemetry Chuyến Bay
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('alt-vel')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
              activeTab === 'alt-vel'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Độ Cao & Tốc Độ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('press-g')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
              activeTab === 'press-g'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Max-Q & Gia Tốc
          </button>
        </div>
      </div>

      {/* Vùng vẽ đồ thị ECharts */}
      <div className="flex-1 w-full pt-1 min-h-[200px]">
        {ReactECharts ? (
          <ReactECharts
            echarts={echarts}
            option={activeTab === 'alt-vel' ? optionAltVel : optionPressG}
            style={{ width: '100%', height: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        ) : (
          <div className="text-rose-400 font-mono text-xs p-4">Không thể tải thư viện ECharts</div>
        )}
      </div>
    </div>
  );
});

import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { projectDownrange, projectWind } from '../../physics/geography.js';

export function FlightMap({ config, setConfig, flightState, disabled }) {
  const containerRef = useRef(), mapRef = useRef(), layersRef = useRef(), clickRef = useRef();
  const requestRef = useRef(null), configRef = useRef(config);
  const [loading, setLoading] = useState(false), [error, setError] = useState(''), [tileError, setTileError] = useState(false);
  const [latitude, setLatitude] = useState(String(config.launchLatitude));
  const [longitude, setLongitude] = useState(String(config.launchLongitude));
  const [weather, setWeather] = useState(config.weatherSnapshot ?? null);
  configRef.current = config;
  const lat = config.launchLatitude, lon = config.launchLongitude, bearing = config.launchBearing;
  clickRef.current = event => {
    if (disabled) return;
    const longitude = ((event.latlng.lng + 540) % 360) - 180;
    const latitude = Math.max(-85, Math.min(85, event.latlng.lat));
    setConfig(previous => ({ ...previous, launchLatitude: latitude, launchLongitude: longitude, environment: undefined, weatherSnapshot: undefined }));
  };
  useEffect(() => {
    const map = L.map(containerRef.current, { center: [lat, lon], zoom: 13, preferCanvas: false });
    mapRef.current = map;
    L.tileLayer(import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).on('tileerror', () => setTileError(true)).addTo(map);
    const pad = L.circleMarker([lat, lon], { radius: 9, color: '#16a34a', fillOpacity: 1 }).bindTooltip('Bệ phóng').addTo(map);
    const route = L.polyline([], { color: '#64748b', weight: 2, dashArray: '6 8' }).addTo(map);
    const trail = L.polyline([], { color: '#06b6d4', weight: 4 }).addTo(map);
    const vehicle = L.circleMarker([lat, lon], { radius: 6, color: '#ea580c', fillOpacity: 1 }).addTo(map);
    const end = L.circleMarker([lat, lon], { radius: 7, color: '#7c3aed', fillOpacity: 0.7, opacity: 0 }).bindTooltip('Vị trí kết thúc theo mô hình').addTo(map);
    layersRef.current = { pad, route, trail, vehicle, end };
    map.on('click', event => clickRef.current(event));
    L.control.scale({ imperial: false }).addTo(map);
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(containerRef.current);
    return () => { observer.disconnect(); map.stop(); map.remove(); mapRef.current = null; layersRef.current = null; };
  }, []);

  useEffect(() => {
    setLatitude(String(Number(lat.toFixed(5)))); setLongitude(String(Number(lon.toFixed(5))));
    setWeather(config.weatherSnapshot ?? null);
    requestRef.current?.abort(); setLoading(false); setError('');
    layersRef.current?.pad.setLatLng([lat, lon]);
    mapRef.current?.panTo([lat, lon]);
  }, [lat, lon]);
  useEffect(() => () => requestRef.current?.abort(), []);
  useEffect(() => {
    if (disabled) { requestRef.current?.abort(); requestRef.current = null; setLoading(false); }
  }, [disabled]);
  const projected = useMemo(() => flightState.trajectoryData.map(point => ({
    time: point.time, coordinates: projectDownrange(lat, lon, bearing, point.downrange),
  })), [flightState.trajectoryData, lat, lon, bearing]);
  useEffect(() => {
    if (!layersRef.current || !mapRef.current) return;
    const every = Math.max(1, Math.ceil(projected.length / 600));
    const points = projected.filter((_, i) => i % every === 0).map(point => point.coordinates);
    if (projected.length) points.push(projected.at(-1).coordinates);
    layersRef.current.route.setLatLngs(points);
    layersRef.current.end.setStyle({ opacity: projected.length ? 1 : 0, fillOpacity: projected.length ? 0.7 : 0 });
    if (projected.length) layersRef.current.end.setLatLng(projected.at(-1).coordinates);
    if (points.length > 1) mapRef.current.fitBounds(L.latLngBounds([[lat, lon], ...points]), { padding: [40, 40], maxZoom: 15 });
  }, [projected]);
  useEffect(() => {
    if (!layersRef.current) return;
    const point = flightState.currentTelemetry;
    const position = point ? projectDownrange(lat, lon, bearing, point.downrange) : [lat, lon];
    layersRef.current.vehicle.setLatLng(position);
    const elapsed = point?.time ?? 0;
    const every = Math.max(1, Math.ceil(projected.length / 600));
    layersRef.current.trail.setLatLngs([...projected.filter((p, i) => p.time <= elapsed && i % every === 0).map(p => p.coordinates), position]);
  }, [flightState.currentTelemetry, projected]);

  const applyCoordinates = event => {
    event.preventDefault();
    if (disabled) return;
    const latitudeValue = Number(latitude), longitudeValue = Number(longitude);
    if (!latitude.trim() || !longitude.trim() || !Number.isFinite(latitudeValue) || !Number.isFinite(longitudeValue) || Math.abs(latitudeValue) > 85 || Math.abs(longitudeValue) > 180) {
      setError('Vĩ độ từ -85 đến 85; kinh độ từ -180 đến 180.'); return;
    }
    setConfig(previous => ({ ...previous, launchLatitude: latitudeValue, launchLongitude: longitudeValue, environment: undefined, weatherSnapshot: undefined }));
  };
  const loadWeather = async () => {
    requestRef.current?.abort();
    const controller = new AbortController(); requestRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 12000);
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ latitude: String(lat), longitude: String(lon),
        current: 'temperature_2m,surface_pressure,wind_speed_10m,wind_direction_10m', wind_speed_unit: 'ms', timezone: 'auto' });
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal });
      if (!response.ok) throw new Error('Không tải được thời tiết.');
      const data = await response.json(), current = data.current;
      if (!current || ![current.temperature_2m, current.surface_pressure, current.wind_speed_10m, current.wind_direction_10m].every(Number.isFinite)) throw new Error('Dữ liệu thời tiết không hợp lệ.');
      if (controller.signal.aborted || configRef.current.launchLatitude !== lat || configRef.current.launchLongitude !== lon) return;
      const snapshot = { temperatureC: current.temperature_2m, pressureHpa: current.surface_pressure,
        windSpeed: current.wind_speed_10m, windDirection: current.wind_direction_10m,
        elevation: data.elevation ?? 0, time: current.time, timezone: data.timezone, latitude: lat, longitude: lon };
      setWeather(snapshot);
      setConfig(previous => ({ ...previous, weatherSnapshot: snapshot,
        environment: { temperatureC: snapshot.temperatureC, pressureHpa: snapshot.pressureHpa, elevation: snapshot.elevation },
        windSpeed: Math.max(-20, Math.min(20, projectWind(snapshot.windSpeed, snapshot.windDirection, previous.launchBearing))) }));
    } catch (error) {
      if (requestRef.current === controller) setError(error.name === 'AbortError' ? 'Yêu cầu thời tiết đã dừng hoặc quá thời gian. Thông số thủ công vẫn dùng được.' : error.message);
    } finally { clearTimeout(timeout); if (requestRef.current === controller) setLoading(false); }
  };

  return <section className="h-full flex flex-col min-h-0 bg-slate-950">
    <div className="shrink-0 px-3 py-2 border-b border-slate-700 space-y-2 text-xs">
      <form onSubmit={applyCoordinates} className="flex flex-wrap items-end gap-2">
        <label className="text-slate-400">Vĩ độ<input aria-label="Vĩ độ bệ phóng" type="number" step="any" value={latitude} onChange={e => setLatitude(e.target.value)} disabled={disabled} className="block w-28 bg-slate-900 border border-slate-700 p-1.5 rounded text-white" /></label>
        <label className="text-slate-400">Kinh độ<input aria-label="Kinh độ bệ phóng" type="number" step="any" value={longitude} onChange={e => setLongitude(e.target.value)} disabled={disabled} className="block w-28 bg-slate-900 border border-slate-700 p-1.5 rounded text-white" /></label>
        <button disabled={disabled} className="rounded bg-cyan-800 px-3 py-2 disabled:opacity-40">Đặt bệ phóng</button>
        <button type="button" disabled={disabled || loading} onClick={loadWeather} className="rounded bg-slate-800 px-3 py-2 disabled:opacity-40">{loading ? 'Đang tải…' : 'Lấy thời tiết'}</button>
      </form>
      <label className="flex gap-2 items-center text-slate-400">Hướng bay minh họa
        <input aria-label="Hướng bay" type="number" min="0" max="359" value={bearing} disabled={disabled} onChange={e => {
          const value = Math.max(0, Math.min(359, Number(e.target.value)));
          setConfig(previous => ({ ...previous, launchBearing: value, ...(previous.weatherSnapshot ? { windSpeed: Math.max(-20, Math.min(20, projectWind(previous.weatherSnapshot.windSpeed, previous.weatherSnapshot.windDirection, value))) } : {}) }));
        }} className="w-16 bg-slate-900 border border-slate-700 rounded p-1 text-white" />° · 0° Bắc, 90° Đông
      </label>
      {weather && <p className="text-emerald-300">{weather.temperatureC} °C · {weather.pressureHpa} hPa · Gió {weather.windSpeed} m/s từ {weather.windDirection}° · {weather.time.replace('T', ' ')} ({weather.timezone}) · <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline">Open-Meteo</a></p>}
      {error && <p role="alert" className="text-amber-300">{error}</p>}
      <p className="text-[10px] text-slate-400">Bấm bản đồ để chọn bệ. Nét đứt: toàn quỹ đạo mô phỏng; nét xanh: đã bay. Thời tiết là dữ liệu mô hình tại mặt đất, không có gió theo tầng cao hoặc địa hình.</p>
    </div>
    <div className="relative flex-1 min-h-[140px] isolate">
      <div ref={containerRef} aria-label="Bản đồ chuyến bay" className="absolute inset-0" />
      {tileError && <div className="absolute top-2 left-12 right-2 z-[500] bg-slate-950/90 text-amber-200 text-[10px] rounded p-2 pointer-events-none">Không tải được một số ô bản đồ. Tọa độ và quỹ đạo vẫn hoạt động khi mất mạng.</div>}
      <div className="absolute bottom-6 left-2 z-[500] bg-slate-950/90 rounded p-2 text-[10px] text-cyan-200 pointer-events-none">
        Độ cao {((flightState.currentTelemetry?.altitude ?? 0) / 1000).toFixed(2)} km · Tầm ngang ước tính {((flightState.currentTelemetry?.downrange ?? 0) / 1000).toFixed(2)} km
      </div>
    </div>
    <p className="shrink-0 px-3 py-2 text-[10px] text-amber-200 bg-amber-950/30">Bản đồ thực, quỹ đạo mô phỏng giản lược. Không phải dự báo điểm rơi hay công cụ điều hành phóng ngoài thực địa.</p>
  </section>;
}

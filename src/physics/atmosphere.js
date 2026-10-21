/**
 * MÔ HÌNH KHÍ QUYỂN TIÊU CHUẨN (US STANDARD ATMOSPHERE 1976)
 * Tính mật độ không khí rho, áp suất p, nhiệt độ T và tốc độ âm thanh a theo độ cao h (m)
 */

import { G0, R_AIR, GAMMA_AIR, P0_SEA_LEVEL, T0_SEA_LEVEL } from './constants.js';

export function getAtmosphere(altitudeMeters, environment) {
  const elevation = environment?.elevation ?? 0;
  const h = Math.max(0, altitudeMeters + elevation);

  let T, p;

  if (h <= 11000.0) {
    // 1. Tầng đối lưu (Troposphere: 0 - 11 km)
    const lapseRate = -0.0065; // K/m
    T = T0_SEA_LEVEL + lapseRate * h;
    p = P0_SEA_LEVEL * Math.pow(T / T0_SEA_LEVEL, -G0 / (lapseRate * R_AIR));
  } else if (h <= 20000.0) {
    // 2. Tầng bình lưu dưới (Lower Stratosphere: 11 - 20 km) đẳng nhiệt
    const T11 = 216.65;
    const p11 = 22632.06;
    T = T11;
    p = p11 * Math.exp(-G0 * (h - 11000.0) / (R_AIR * T11));
  } else if (h <= 32000.0) {
    // 3. Tầng bình lưu giữa (Middle Stratosphere: 20 - 32 km)
    const T20 = 216.65;
    const p20 = 5474.89;
    const lapseRate = 0.001; // K/m
    T = T20 + lapseRate * (h - 20000.0);
    p = p20 * Math.pow(T / T20, -G0 / (lapseRate * R_AIR));
  } else if (h <= 80000.0) {
    // 4. Tầng trung lưu (32 - 80 km) suy giảm hàm mũ
    T = Math.max(180.0, 220.0 - 0.0015 * (h - 32000.0));
    p = 1000.0 * Math.exp(-(h - 32000.0) / 7200.0);
  } else {
    // 5. Cận chân không vũ trụ (> 80 km)
    T = 180.0;
    p = Math.max(1e-5, 0.01 * Math.exp(-(h - 80000.0) / 8000.0));
  }

  // Mật độ không khí lý tưởng p = rho * R * T
  // Local surface correction fades with altitude; not a weather-column model.
  if (environment) {
    const weight = Math.exp(-Math.max(0, altitudeMeters) / 8000);
    const standardSurface = getAtmosphere(elevation);
    if (Number.isFinite(environment.temperatureC)) T += (environment.temperatureC + 273.15 - standardSurface.T) * weight;
    if (Number.isFinite(environment.pressureHpa)) p *= 1 + (environment.pressureHpa * 100 / standardSurface.p - 1) * weight;
  }
  const safeT = Math.max(100.0, T);
  const rho = Math.max(1e-9, p / (R_AIR * safeT));

  // Tốc độ âm thanh cục bộ a = sqrt(gamma * R * T)
  const a = Math.sqrt(GAMMA_AIR * R_AIR * safeT);

  return { rho, p, T: safeT, a };
}

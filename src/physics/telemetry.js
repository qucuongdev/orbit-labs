import { getAtmosphere } from './atmosphere.js';

// Preset minh họa; không suy ra nhiệt độ thực từ màu ngọn lửa.
export const PLUME_ZONES = [
  { name: 'Lõi trắng xanh', color: '#e0f2fe', temperatureC: 3200 },
  { name: 'Vùng xanh', color: '#38bdf8', temperatureC: 2500 },
  { name: 'Vỏ cam', color: '#f97316', temperatureC: 1700 },
  { name: 'Rìa đỏ', color: '#ef4444', temperatureC: 900 },
];

export function getAirTelemetry(altitude, velocity, diameter, windSpeed = 0, vx = velocity, vz = 0, environment) {
  const { rho, a } = getAtmosphere(altitude, environment);
  const airspeed = Math.hypot(vx - windSpeed, vz);
  const dynamicPressurePa = 0.5 * rho * airspeed ** 2;
  return { airspeed, windSpeed, speedOfSound: a, airDensity: rho,
    airLoadN: dynamicPressurePa * Math.PI * (diameter / 2) ** 2 };
}

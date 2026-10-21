export function altitudeToVisualY(altitude) {
  return 36 * Math.asinh(Math.max(0, altitude) / 300);
}

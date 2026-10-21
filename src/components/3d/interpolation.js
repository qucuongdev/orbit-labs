// Nội suy vị trí và tiếp tuyến vận tốc để tránh giật tại mỗi mẫu 0,2 giây.
export function interpolatePosition(start, end, startVelocity, endVelocity, duration, alpha) {
  const a = Math.max(0, Math.min(1, alpha));
  const a2 = a * a;
  const a3 = a2 * a;
  return (2 * a3 - 3 * a2 + 1) * start + (a3 - 2 * a2 + a) * duration * startVelocity
    + (-2 * a3 + 3 * a2) * end + (a3 - a2) * duration * endVelocity;
}

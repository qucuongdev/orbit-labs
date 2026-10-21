const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Visual presets, not a combustion or six-degree-of-freedom solver.
export function getPlumeAppearance(bodyDiameter, thrustN) {
  const nozzleRadius = bodyDiameter * 0.425;
  const power = clamp(thrustN / 2800, 0.05, 8);
  return {
    radius: nozzleRadius * 0.95,
    length: clamp(nozzleRadius * 22 * Math.sqrt(power), nozzleRadius * 7, nozzleRadius * 55),
    intensity: clamp(0.65 + Math.sqrt(power) * 0.35, 0.65, 1.8),
  };
}

export function isRecoveryStage(stage) {
  return stage === 'DROGUE_DESCENT' || stage === 'MAIN_DESCENT';
}

export function getRocketAttitude(stage, time, vx, vz, windSpeed = 0) {
  if (stage === 'LANDED' || stage === 'READY') return 0;
  if (isRecoveryStage(stage)) {
    const amplitude = 0.035 + Math.min(Math.abs(windSpeed) * 0.004, 0.045);
    return clamp(Math.sin(time * 1.8) * amplitude + (vx - windSpeed) * 0.003, -0.15, 0.15);
  }
  return Math.hypot(vx, vz) > 1 ? Math.atan2(vz, vx) - Math.PI / 2 : 0;
}

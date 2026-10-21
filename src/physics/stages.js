import { G0 } from './constants.js';

export function getEngineThrottle(time, startTime, rampDuration) {
  if (time < startTime) return 0;
  if (rampDuration <= 0) return 1;
  const u = Math.max(0, Math.min(1, (time - startTime) / rampDuration));
  return u * u * (3 - 2 * u);
}

// Educational staging model. The shared airframe is apportioned to stage
// segments; event boundaries are integrated exactly before discarding mass.
export function getEngineStages(config) {
  if (config.stages?.length) return config.stages;
  return [{ thrust: config.thrustVac, burnTime: config.burnTime,
    propellantMass: config.propellantMass, dryMass: config.engineDryMass }];
}

export function getStagePlan(config, aero) {
  const engines = getEngineStages(config);
  if (engines.length < 1 || engines.length > 3) throw new Error('Chỉ hỗ trợ 1–3 tầng.');
  const engineMass = engines.reduce((sum, stage) => sum + stage.dryMass, 0);
  const sharedShell = Math.max(0, aero.dryMass - engineMass - config.payloadMass);
  let startTime = 0;
  return engines.map((engine, index) => {
    for (const [field, value] of Object.entries(engine)) {
      if (!Number.isFinite(value) || value <= 0) throw new Error(`Thông số tầng ${index + 1} không hợp lệ: ${field}`);
    }
    if (engine.thrust > 34500000 || engine.burnTime > 500 || engine.propellantMass > 2800000 || engine.dryMass > 200000) {
      throw new Error(`Tầng ${index + 1} vượt phạm vi thông số mô phỏng hỗ trợ.`);
    }
    const start = startTime;
    startTime += engine.burnTime;
    const rampDuration = Math.min(config.ignitionDuration ?? 2.5, engine.burnTime / 2);
    if (!Number.isFinite(rampDuration) || rampDuration < 0) throw new Error('Thời gian khởi động không hợp lệ.');
    // Integral of smoothstep ramp = rampDuration/2. Normalizing flow
    // preserves the entered fuel budget, with F = mdot * Isp * g0.
    const maximumMassFlow = engine.propellantMass / (engine.burnTime - rampDuration / 2);
    return { ...engine, index, startTime: start, endTime: startTime, rampDuration, maximumMassFlow,
      effectiveIsp: engine.thrust / (maximumMassFlow * G0),
      discardMass: index < engines.length - 1 ? engine.dryMass + sharedShell / engines.length : 0 };
  });
}

export function makeStageAssembly(config, count) {
  const current = getEngineStages(config);
  if (count === 1) return { ...config, stages: undefined, thrustVac: current[0].thrust,
    burnTime: current[0].burnTime, propellantMass: current[0].propellantMass, engineDryMass: current[0].dryMass };
  const totalFuel = current.reduce((sum, stage) => sum + stage.propellantMass, 0);
  const totalDry = current.reduce((sum, stage) => sum + stage.dryMass, 0);
  const stages = Array.from({ length: count }, (_, index) => ({
    thrust: current[index]?.thrust ?? Math.round(current[0].thrust * (index ? 0.65 : 1)),
    burnTime: current[index]?.burnTime ?? (index ? 3 : current[0].burnTime),
    propellantMass: totalFuel / count,
    dryMass: totalDry / count,
  }));
  return { ...config, stages };
}

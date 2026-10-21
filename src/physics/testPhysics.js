import { calculateAerodynamicsAndCG } from './barrowman.js';
import { analyzeStructuralIntegrity } from './structures.js';
import { simulateRocketFlight } from './rk4Solver.js';
import { DEFAULT_MATERIAL } from './materials.js';

const config = {
  noseLength: 0.6,
  noseShape: 'ogive',
  bodyDiameter: 0.15,
  bodyLength: 1.8,
  finCount: 4,
  finSpan: 0.12,
  finRootChord: 0.25,
  finTipChord: 0.10,
  finSweep: 0.15,
  wallThickness: 0.002, // 2mm
  propellantMass: 6.5,
  payloadMass: 1.2,
  engineDryMass: 2.0,
  thrustVac: 2200,      // 2200 N
  ispVac: 240,
  burnTime: 7.2,
  launchAngleDeg: 87.0
};

console.log('--- 1. TEST KHÍ ĐỘNG BARROWMAN & CG ---');
const aero = calculateAerodynamicsAndCG(config, DEFAULT_MATERIAL);
console.log('CP (Tâm áp suất):', aero.xCp.toFixed(3), 'm');
console.log('CG Initial:', aero.xCgInitial.toFixed(3), 'm');
console.log('Static Margin:', aero.staticMarginInitial.toFixed(2), 'calibers (Status:', aero.status, ')');

console.log('\n--- 2. TEST KẾT CẤU & BỀN VỎ MỎNG ---');
const struct = analyzeStructuralIntegrity(config, DEFAULT_MATERIAL, 2e6, 8000);
console.log('Von Mises Stress:', struct.vonMisesStressMPa.toFixed(1), 'MPa');
console.log('Yield SF:', struct.yieldSafetyFactor.toFixed(2));
console.log('Buckling SF:', struct.bucklingSafetyFactor.toFixed(2));
console.log('Status:', struct.statusText);

console.log('\n--- 3. TEST TÍCH PHÂN QUỸ ĐẠO RK4 ---');
const flight = simulateRocketFlight(config, aero);
console.log('Số điểm dữ liệu quỹ đạo:', flight.trajectory.length);
console.log('Độ cao đỉnh (Apogee):', flight.summary.maxAltitudeKm, 'km');
console.log('Vận tốc tối đa:', flight.summary.maxVelocityMs, 'm/s (Mach', flight.summary.maxMach, ')');
console.log('Max-Q:', flight.summary.maxDynamicPressureKPa, 'kPa tại độ cao', flight.summary.maxQAltitudeKm, 'km');
console.log('Vận tốc tiếp đất:', flight.summary.landingVelocityMs, 'm/s (An toàn:', flight.summary.isSafeLanding, ')');
console.log('Động năng va chạm:', flight.summary.impactEnergyJoules, 'Joules');

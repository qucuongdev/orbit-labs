import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_CONFIG } from './defaultConfig.js';
import { DEFAULT_MATERIAL } from './materials.js';
import { calculateAerodynamicsAndCG } from './barrowman.js';
import { simulateRocketFlight } from './rk4Solver.js';
import { getAirTelemetry } from './telemetry.js';
import { interpolatePosition } from '../components/3d/interpolation.js';
import { getPlumeAppearance, getRocketAttitude } from './flightVisuals.js';
import { makeStageAssembly, getEngineThrottle } from './stages.js';
import { sampleFlight } from './playback.js';
import { projectDownrange, projectWind } from './geography.js';
import { getAtmosphere } from './atmosphere.js';
import { getSeparatedStagePose, getSeparationFocus } from '../components/3d/separationMotion.js';
import { altitudeToVisualY } from '../components/3d/visualScale.js';

function simulate(overrides = {}) {
  const config = { ...INITIAL_CONFIG, ...overrides };
  return simulateRocketFlight(config, calculateAerodynamicsAndCG(config, DEFAULT_MATERIAL));
}

test('normal flight lands on the ground with finite telemetry and positive impact energy', () => {
  const { trajectory, summary } = simulate();
  assert.equal(summary.terminationReason, 'LANDED');
  assert.equal(summary.landed, true);
  assert.equal(trajectory.at(-1).altitude, 0);
  assert.equal(trajectory.at(-1).stage, 'LANDED');
  assert.ok(summary.landingVelocityMs > 0);
  assert.ok(summary.impactEnergyJoules > 0);
  for (const point of trajectory) {
    assert.ok(point.altitude >= 0);
    for (const value of Object.values(point)) if (typeof value === 'number') assert.ok(Number.isFinite(value));
  }
});

test('time limit never reports a safe landing or a fabricated impact velocity', () => {
  const { trajectory, summary } = simulate({ thrustVac: 8000, burnTime: 15, propellantMass: 1 });
  assert.equal(summary.terminationReason, 'TIME_LIMIT');
  assert.equal(summary.landed, false);
  assert.equal(summary.isSafeLanding, false);
  assert.equal(summary.landingVelocityMs, null);
  assert.equal(summary.impactEnergyJoules, null);
  assert.ok(trajectory.at(-1).altitude > 0);
});

test('insufficient vertical thrust is rejected before integration', () => {
  assert.throws(() => simulate({ bodyLength: 5, wallThickness: 0.008, thrustVac: 500 }), /rời bệ/);
});

test('nonfinite input is rejected', () => {
  assert.throws(() => simulate({ thrustVac: NaN }), /không hợp lệ/);
});

test('air load follows squared airspeed and vanishes at rest', () => {
  assert.equal(getAirTelemetry(0, 0, 0.16).airLoadN, 0);
  const slow = getAirTelemetry(0, 100, 0.16);
  const fast = getAirTelemetry(0, 200, 0.16);
  assert.equal(fast.airLoadN, 4 * slow.airLoadN);
  assert.ok(getAirTelemetry(10000, 100, 0.16).airLoadN < slow.airLoadN);
});

test('playback interpolation preserves constant acceleration during lift-off', () => {
  // x = 0.5 * 10 * t², sampled at t=0 and t=0.2.
  assert.ok(Math.abs(interpolatePosition(0, 0.2, 0, 2, 0.2, 0.5) - 0.05) < 1e-10);
  assert.equal(interpolatePosition(0, 0.2, 0, 2, 0.2, 0), 0);
  assert.equal(interpolatePosition(0, 0.2, 0, 2, 0.2, 1), 0.2);
});

test('rocket stays nose-up under either chute even with a downward velocity', () => {
  for (const stage of ['DROGUE_DESCENT', 'MAIN_DESCENT']) {
    for (let time = 0; time < 30; time += 0.1) {
      assert.ok(Math.abs(getRocketAttitude(stage, time, 10, -35, -12)) <= 0.15);
    }
  }
  assert.equal(getRocketAttitude('LANDED', 10, 5, -10), 0);
});

test('plume follows nozzle diameter and thrust without depending on vehicle mass', () => {
  const normal = getPlumeAppearance(0.16, 2800);
  const large = getPlumeAppearance(0.32, 2800);
  const powerful = getPlumeAppearance(0.16, 5600);
  assert.equal(large.radius, 2 * normal.radius);
  assert.equal(large.length, 2 * normal.length);
  assert.ok(powerful.length > normal.length);
  assert.ok(powerful.intensity > normal.intensity);
  assert.equal(powerful.radius, normal.radius);
});

test('airspeed uses velocity relative to the wind', () => {
  assert.equal(getAirTelemetry(0, 10, 0.16, 10, 10, 0).airspeed, 0);
  assert.equal(getAirTelemetry(0, 10, 0.16, -10, 10, 0).airspeed, 20);
});

test('wind drifts the suspended vehicle and a larger main chute slows descent', () => {
  const calm = simulate({ windSpeed: 0 });
  const windy = simulate({ windSpeed: 6 });
  const larger = simulate({ windSpeed: 0, mainDiameter: 3 });
  assert.ok(windy.trajectory.at(-1).downrange > calm.trajectory.at(-1).downrange + 100);
  assert.ok(Math.abs(windy.trajectory.at(-1).horizontalVelocity - 6) < 0.2);
  assert.ok(larger.summary.landingVelocityMs < calm.summary.landingVelocityMs);
  const stages = new Set(windy.trajectory.map(point => point.stage));
  assert.ok(stages.has('DROGUE_DESCENT'));
  assert.ok(stages.has('MAIN_DESCENT'));
});

for (const count of [2, 3]) test(`${count} stages conserve fuel and discarded mass at exact separation times`, () => {
  const config = makeStageAssembly(INITIAL_CONFIG, count);
  // Boundaries deliberately fall between regular 50 ms solver steps.
  config.stages[0].burnTime = 2.13;
  const aero = calculateAerodynamicsAndCG(config, DEFAULT_MATERIAL);
  const result = simulateRocketFlight(config, aero);
  assert.equal(result.events.length, count - 1);
  assert.equal(result.events[0].time, 2.13);
  for (const event of result.events) {
    assert.ok(Math.abs(event.beforeMass - event.afterMass - event.discardedMass) < 1e-9);
    const before = sampleFlight(result.trajectory, event.time - 0.01, config).telemetry;
    const after = sampleFlight(result.trajectory, event.time + 0.01, config).telemetry;
    assert.equal(after.engineStage, event.stageIndex + 2);
    assert.ok(after.isEngineActive);
    assert.ok(Math.abs(before.velocity - after.velocity) < 15, 'separation must not add a velocity impulse');
  }
  const fuel = config.stages.reduce((sum, stage) => sum + stage.propellantMass, 0);
  const discarded = result.events.reduce((sum, event) => sum + event.discardedMass, 0);
  assert.ok(Math.abs(result.trajectory.at(-1).mass - (aero.initialMass - fuel - discarded)) < 1e-7);
});

test('map projection handles cardinal bearings and date-line wrapping', () => {
  const east = projectDownrange(0, 0, 90, 1000);
  const north = projectDownrange(0, 0, 0, 1000);
  assert.ok(Math.abs(east[0]) < 1e-6 && east[1] > 0);
  assert.ok(north[0] > 0 && Math.abs(north[1]) < 1e-6);
  assert.ok(projectDownrange(0, 179.999, 90, 1000)[1] < 0);
  assert.ok(Math.abs(projectWind(5, 90, 90) + 5) < 1e-8);
});

test('weather corrections affect surface density without replacing high-altitude ISA', () => {
  const standard = getAtmosphere(0);
  const warm = getAtmosphere(0, { temperatureC: 35, pressureHpa: 1000, elevation: 0 });
  assert.equal(warm.T, 308.15);
  assert.equal(warm.p, 100000);
  assert.ok(warm.rho < standard.rho);
  assert.ok(Math.abs(getAtmosphere(80000, { temperatureC: 35 }).T - getAtmosphere(80000).T) < 0.1);
});

test('detached stage starts at the attached segment pose and inherits visual velocity', () => {
  const config = makeStageAssembly(INITIAL_CONFIG, 3);
  const event = { time: 7, stageIndex: 0, downrange: 190, altitude: 2600, vx: 52, vz: 630 };
  const pose = getSeparatedStagePose(config, event, event.time);
  const total = config.bodyLength + config.noseLength;
  const slotY = -total / 2 + (config.bodyLength / 3 + 0.001) / 2;
  const angle = getRocketAttitude('POWERED_FLIGHT', 7, 52, 630);
  assert.equal(pose.rotation, angle);
  assert.ok(Math.abs(pose.x - (event.downrange * 0.05 - Math.sin(angle) * (slotY - total / 2))) < 1e-8);
  assert.ok(Math.abs(pose.y - (altitudeToVisualY(event.altitude) + total + 0.3 + Math.cos(angle) * (slotY - total / 2))) < 1e-8);
  const next = getSeparatedStagePose(config, event, event.time + 0.0001);
  assert.ok(Math.abs((next.x - pose.x) / 0.0001 - event.vx * 0.05) < 0.001);
  const visualVerticalVelocity = 36 / (300 * Math.sqrt(1 + (event.altitude / 300) ** 2)) * event.vz;
  assert.ok(Math.abs((next.y - pose.y) / 0.0001 - visualVerticalVelocity) < 0.01);
  assert.equal(getSeparatedStagePose(config, event, 6.9).visible, false);
  assert.equal(getSeparatedStagePose(config, event, 43).visible, true, 'must not disappear after 35 seconds');
  const landed = getSeparatedStagePose(config, event, 1000);
  const later = getSeparatedStagePose(config, event, 1100);
  assert.ok(Math.abs(landed.x - later.x) < 0.0001);
  assert.ok(Math.abs(landed.rotation - Math.PI / 2) < 0.0001);
});

test('follow camera includes the recent separated stage and eases back to the upper stack', () => {
  const config = makeStageAssembly(INITIAL_CONFIG, 2);
  const event = { time: 7, stageIndex: 0, downrange: 190, altitude: 2600, vx: 52, vz: 630 };
  const rocket = { x: 25, y: 120 };
  const focus = getSeparationFocus(config, [event], 10, rocket);
  const debris = getSeparatedStagePose(config, event, 10);
  assert.ok(Math.abs(debris.y - focus.y) <= focus.span / 2);
  assert.ok(Math.abs(rocket.y - focus.y) <= focus.span / 2);
  assert.deepEqual(getSeparationFocus(config, [event], 17.1, rocket), { x: 25, y: 120, span: 3 });
});

test('startup burns fuel on the pad and releases from rest only with positive lift margin', () => {
  const { trajectory, summary } = simulate();
  assert.ok(Math.abs(summary.liftoffTimeSec - INITIAL_CONFIG.ignitionDuration) < 1e-6);
  const pad = trajectory.filter(point => point.onPad);
  assert.ok(pad.length > 5);
  assert.equal(pad[0].thrust, 0);
  for (const point of pad) {
    assert.equal(point.altitude, 0);
    assert.equal(point.horizontalVelocity, 0);
    assert.equal(point.verticalVelocity, 0);
    assert.equal(point.stage, 'IGNITION');
  }
  assert.ok(pad.at(-1).mass < pad[0].mass, 'startup must consume fuel');
  const release = trajectory.find(point => !point.onPad);
  assert.ok(release.thrustToWeight > 1);
  assert.ok(release.velocity < 0.001);
  const rising = trajectory.find(point => point.altitude > 0);
  assert.ok(rising.altitude < 0.2);
  assert.ok(rising.velocity < 2);
  assert.ok(summary.initialThrustToWeight < 2, 'default preset must not be a high acceleration impulse');
});

test('startup curve joins zero and full thrust smoothly and fuel flow agrees with derived Isp', () => {
  assert.equal(getEngineThrottle(0, 0, 2.5), 0);
  assert.equal(getEngineThrottle(1.25, 0, 2.5), 0.5);
  assert.equal(getEngineThrottle(2.5, 0, 2.5), 1);
  const { stagePlan, trajectory } = simulate();
  const stage = stagePlan[0];
  assert.ok(Math.abs(stage.maximumMassFlow * stage.effectiveIsp * 9.80665 - stage.thrust) < 1e-8);
  const massAfter = trajectory.at(-1).mass;
  assert.ok(Math.abs(trajectory[0].mass - massAfter - INITIAL_CONFIG.propellantMass) < 1e-7);
});

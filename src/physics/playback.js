import { interpolatePosition } from './interpolation.js';
import { getAirTelemetry } from './telemetry.js';
import { getRocketAttitude } from './flightVisuals.js';
import { getEngineThrottle } from './stages.js';
import { MU_EARTH, R_EARTH } from './constants.js';

export function sampleFlight(trajectory, time, config, cursor = 0) {
  if (!trajectory.length) return { telemetry: null, cursor: 0 };
  while (cursor < trajectory.length - 2 && trajectory[cursor + 1].time <= time) cursor++;
  const p = trajectory[cursor], next = trajectory[Math.min(cursor + 1, trajectory.length - 1)];
  const span = Math.max(0.0001, next.time - p.time);
  const alpha = Math.max(0, Math.min(1, (time - p.time) / span));
  const lerp = key => p[key] + (next[key] - p[key]) * alpha;
  const altitude = Math.max(0, interpolatePosition(p.altitude, next.altitude, p.verticalVelocity, next.verticalVelocity, span, alpha));
  const vx = lerp('horizontalVelocity'), vz = lerp('verticalVelocity');
  const air = getAirTelemetry(altitude, Math.hypot(vx, vz), config.bodyDiameter, config.windSpeed ?? 0, vx, vz, config.environment);
  const throttle = p.isEngineActive ? getEngineThrottle(time, p.engineStartTime, p.rampDuration) : 0;
  const thrust = (p.nominalThrust ?? 0) * throttle;
  const mass = p.engineStage === next.engineStage ? lerp('mass') : p.mass;
  const localGravity = MU_EARTH / (R_EARTH + altitude) ** 2;
  const telemetry = { ...p, time, altitude, horizontalVelocity: vx, verticalVelocity: vz,
    velocity: Math.hypot(vx, vz), throttle, thrust, mass,
    thrustToWeight: thrust * Math.sin(config.launchAngleDeg * Math.PI / 180) / (mass * localGravity),
    downrange: interpolatePosition(p.downrange, next.downrange, p.horizontalVelocity, next.horizontalVelocity, span, alpha),
    mach: air.airspeed / air.speedOfSound, dynamicPressure: lerp('dynamicPressure'), gLoad: lerp('gLoad'),
    bodyTiltDeg: Math.abs(getRocketAttitude(p.stage, time, vx, vz, config.windSpeed ?? 0)) * 180 / Math.PI, ...air };
  return { telemetry, cursor };
}

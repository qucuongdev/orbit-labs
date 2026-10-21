import { altitudeToVisualY } from './visualScale.js';
import { getRocketAttitude } from '../../physics/flightVisuals.js';
import { getEngineStages } from '../../physics/stages.js';

// Visual recovery motion only; not a second impact prediction solver.
export function getSeparatedStagePose(config, event, time) {
  const elapsed = Math.max(0, time - event.time);
  const totalLength = config.bodyLength + config.noseLength;
  const scale = Math.min(1, 3 / totalLength);
  const segment = config.bodyLength / getEngineStages(config).length;
  const slotY = -totalLength / 2 + event.stageIndex * segment + (segment + 0.001) / 2;
  const angle = getRocketAttitude('POWERED_FLIGHT', event.time, event.vx, event.vz, config.windSpeed ?? 0);
  const offset = (slotY - totalLength / 2) * scale;
  const dragTime = 12;
  const heightAt = age => event.altitude + (event.vz + 9.81 * dragTime) * dragTime * -Math.expm1(-age / dragTime) - 9.81 * dragTime * age;
  let motionTime = elapsed;
  if (heightAt(elapsed) < 0) {
    let low = 0, high = elapsed;
    for (let i = 0; i < 32; i++) {
      const middle = (low + high) / 2;
      if (heightAt(middle) > 0) low = middle; else high = middle;
    }
    motionTime = (low + high) / 2;
  }
  const travel = dragTime * -Math.expm1(-motionTime / dragTime);
  const wind = config.windSpeed ?? 0;
  const downrange = event.downrange + wind * motionTime + (event.vx - wind) * travel;
  const altitude = Math.max(0, heightAt(motionTime));
  // Zero angular velocity at release, then gradually starts tumbling.
  const spin = 0.36 * (motionTime - 1.8 * -Math.expm1(-motionTime / 1.8));
  const settle = Math.max(0, Math.min(1, 1 - altitude / 20));
  const rotation = (angle + spin) * (1 - settle) + Math.PI / 2 * settle;
  const floor = scale * (Math.abs(Math.cos(rotation)) * segment / 2 + Math.abs(Math.sin(rotation)) * config.bodyDiameter / 2) + 0.03;
  return {
    visible: time >= event.time,
    x: downrange * 0.05 - Math.sin(angle) * offset,
    y: floor + Math.max(0, altitudeToVisualY(altitude) + totalLength * scale + 0.3 + Math.cos(angle) * offset - floor) * (1 - settle),
    z: 0,
    rotation,
    altitude,
    scale,
  };
}

export function getSeparationFocus(config, events, time, rocket) {
  let minX = rocket.x, maxX = rocket.x, minY = rocket.y - 1.5, maxY = rocket.y + 1.5;
  for (const event of events) {
    const age = time - event.time;
    if (age < 0 || age > 10) continue;
    const pose = getSeparatedStagePose(config, event, time);
    // Ease the camera back to the upper stack instead of snapping at timeout.
    const weight = age < 5 ? 1 : (1 + Math.cos(Math.PI * (age - 5) / 5)) / 2;
    const x = rocket.x + (pose.x - rocket.x) * weight;
    const y = rocket.y + (pose.y - rocket.y) * weight;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y - 0.5); maxY = Math.max(maxY, y + 0.5);
  }
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2, span: Math.max(maxX - minX, maxY - minY) };
}

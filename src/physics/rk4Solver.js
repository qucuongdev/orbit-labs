/**
 * BỘ TÍCH PHÂN QUỸ ĐẠO BAY RUNGE-KUTTA BẬC 4 (2D FLIGHT SIMULATION)
 * Tích hợp đầy đủ khí quyển ISA, lực cản phi tuyến theo Mach,
 * tiêu hao nhiên liệu, nghiêng trọng lực (Gravity Turn) và bung dù kép.
 */

import { G0, R_EARTH, MU_EARTH, MAX_SIM_STEPS, MAX_FLIGHT_TIME, EPSILON } from './constants.js';
import { getAtmosphere } from './atmosphere.js';
import { getAirTelemetry } from './telemetry.js';
import { getStagePlan, getEngineStages, getEngineThrottle } from './stages.js';

// Hệ số lực cản phi tuyến thực nghiệm theo số Mach
function getMachDragCoefficient(mach, baseCd = 0.32) {
  if (mach < 0.8) {
    return baseCd + 0.05 * mach;
  } else if (mach <= 1.2) {
    // Vùng xuyên âm: Sóng xung kích làm tăng vọt CD (Transonic Shock Wave)
    const factor = Math.sin((Math.PI * (mach - 0.8)) / 0.4);
    return baseCd + 0.04 + 0.42 * factor;
  } else {
    // Vùng siêu âm: Giảm dần theo 1/sqrt(M^2 - 1)
    const decay = 0.38 / Math.sqrt(Math.max(0.1, Math.pow(mach, 2) - 0.5));
    return baseCd * 0.75 + decay;
  }
}

export function simulateRocketFlight(config, aeroResults) {
  for (const [key, value] of Object.entries(config)) {
    if (typeof value === 'number' && !Number.isFinite(value)) throw new Error(`Thông số không hợp lệ: ${key}`);
  }
  for (const key of ['bodyDiameter', 'thrustVac', 'burnTime', 'propellantMass']) {
    if (!Number.isFinite(config[key]) || config[key] <= 0) throw new Error(`Thông số không hợp lệ: ${key}`);
  }
  if (!Number.isFinite(aeroResults.initialMass) || !Number.isFinite(aeroResults.dryMass) ||
      aeroResults.dryMass <= 0 || aeroResults.initialMass <= aeroResults.dryMass) {
    throw new Error('Khối lượng mô phỏng không hợp lệ.');
  }
  if (getEngineStages(config)[0].thrust * Math.sin((config.launchAngleDeg ?? 88) * Math.PI / 180) <= aeroResults.initialMass * G0) {
    throw new Error('Lực đẩy thẳng đứng chưa đủ để rời bệ. Hãy tăng lực đẩy hoặc giảm khối lượng.');
  }
  const {
    bodyDiameter,
    thrustVac,
    burnTime,
    launchAngleDeg = 88.0, // Góc phóng ban đầu so với phương ngang
    windSpeed = 0,
    drogueDiameter = 0.6,  // Dù con (m)
    mainDiameter = 2.4     // Dù chính (m)
  } = config;
  if (drogueDiameter <= 0 || mainDiameter <= 0 || Math.abs(windSpeed) > 20) {
    throw new Error('Đường kính dù phải dương và gió ngang trong khoảng -20 đến 20 m/s.');
  }

  const sRef = Math.PI * Math.pow(bodyDiameter / 2.0, 2);
  const mInitial = aeroResults.initialMass;
  const mDry = aeroResults.dryMass;
  const stagePlan = getStagePlan(config, aeroResults);
  const totalBurnTime = stagePlan.at(-1).endTime;
  let activeStage = 0;
  let dryFloor = mInitial - stagePlan[0].propellantMass;
  let engineBurning = true;
  let hasLiftedOff = false;
  let liftoffTime = null;
  const events = [];

  // Diện tích dù
  const sDrogue = Math.PI * Math.pow(drogueDiameter / 2.0, 2);
  const sMain = Math.PI * Math.pow(mainDiameter / 2.0, 2);

  const dt = 0.05; // Bước tích phân 50ms
  let t = 0.0;

  // Trạng thái ban đầu: [x, z, vx, vz, m]
  const initAngleRad = (launchAngleDeg * Math.PI) / 180.0;
  let state = [0.0, 0.0, 0.0, 0.0, mInitial];

  const trajectory = [];
  let maxAltitude = 0.0;
  let maxVelocity = 0.0;
  let maxMach = 0.0;
  let maxAcceleration = 0.0;
  let maxDynamicPressure = 0.0;
  let maxQAltitude = 0.0;
  let apogeeTime = 0.0;
  let landingVelocity = null;
  let landed = false;

  let hasBurnout = false;
  let hasApogee = false;
  let drogueDeployed = false;
  let mainDeployed = false;

  let step = 0;

  function derivative(time, [x, z, vx, vz, m]) {
    const v = Math.hypot(vx, vz);
    const relativeVx = vx - windSpeed;
    const airspeed = Math.hypot(relativeVx, vz);
    const r = R_EARTH + Math.max(0, z);
    const g = MU_EARTH / Math.pow(r, 2);

    const engine = stagePlan[activeStage];
    const isEngineActive = engineBurning;
    const throttle = isEngineActive ? getEngineThrottle(time, engine.startTime, engine.rampDuration) : 0;
    const actualThrust = engine.thrust * throttle;
    const dm = -engine.maximumMassFlow * throttle;

    const { rho, a } = getAtmosphere(z, config.environment);
    const mach = a > EPSILON ? airspeed / a : 0.0;
    const cdRocket = getMachDragCoefficient(mach);

    // Tính lực cản khí động học
    const q = 0.5 * rho * Math.pow(airspeed, 2);
    let totalDragArea = sRef * cdRocket;

    // Hiệu ứng dù khi đang rơi xuống (vz < 0)
    if (hasApogee && vz < 0) {
      if (z <= 400.0) {
        // Bung dù chính
        totalDragArea += sMain * 1.75;
      } else {
        // Bung dù con
        totalDragArea += sDrogue * 1.10;
      }
    }

    const fDrag = q * totalDragArea;
    const gamma = v > 1e-2 ? Math.atan2(vz, vx) : initAngleRad;

    const dragX = airspeed > EPSILON ? fDrag * relativeVx / airspeed : 0;
    const dragZ = airspeed > EPSILON ? fDrag * vz / airspeed : 0;

    // Hướng lực đẩy (Thrust Vector)
    let thrustX = 0.0;
    let thrustZ = 0.0;

    if (isEngineActive) {
      let pitchAngle = initAngleRad;
      if (z < 150.0) {
        // Giai đoạn thoát bệ phóng
        pitchAngle = initAngleRad;
      } else if (z < 1200.0) {
        // Giai đoạn bắt đầu nghiêng đầu chủ động (Pitch-over)
        const progress = (z - 150.0) / 1050.0;
        pitchAngle = initAngleRad - progress * (0.05); // Nghiêng nhẹ thêm ~3 độ
      } else {
        // Quỹ đạo Gravity turn tự nhiên: Lực đẩy trùng hướng vận tốc bay
        pitchAngle = gamma;
      }

      thrustX = actualThrust * Math.cos(pitchAngle);
      thrustZ = actualThrust * Math.sin(pitchAngle);
    }

    const ax = (thrustX - dragX) / Math.max(1.0, m);
    const az = (thrustZ - dragZ) / Math.max(1.0, m) - g;

    if (!hasLiftedOff) return [0, 0, 0, 0, dm, q, mach, 1, actualThrust, throttle];
    return [vx, vz, ax, az, dm, q, mach, Math.hypot(ax, az + g) / G0, actualThrust, throttle];
  }

  // VÒNG LẶP TÍCH PHÂN RUNGE-KUTTA 4
  while (step < MAX_SIM_STEPS && t < MAX_FLIGHT_TIME) {
    let separated = false;
    while (activeStage < stagePlan.length - 1 && t >= stagePlan[activeStage].endTime - EPSILON) {
      const previous = stagePlan[activeStage];
      state[4] = dryFloor;
      const beforeMass = state[4];
      state[4] -= previous.discardMass;
      events.push({ type: 'SEPARATION', time: previous.endTime, stageIndex: activeStage,
        discardedMass: previous.discardMass, beforeMass, afterMass: state[4],
        downrange: state[0], altitude: state[1], vx: state[2], vz: state[3] });
      activeStage++;
      dryFloor = state[4] - stagePlan[activeStage].propellantMass;
      separated = true;
    }
    engineBurning = t < totalBurnTime - EPSILON;
    const [x, z, vx, vz, m] = state;
    const v = Math.hypot(vx, vz);
    const engine = stagePlan[activeStage];
    const currentThrottle = engineBurning ? getEngineThrottle(t, engine.startTime, engine.rampDuration) : 0;
    const currentThrust = engine.thrust * currentThrottle;
    const localGravity = MU_EARTH / (R_EARTH + Math.max(0, z)) ** 2;
    // Ground reactions hold both axes until startup is complete and lift
    // exceeds weight. Release has zero initial velocity, never an impulse.
    if (!hasLiftedOff && t >= stagePlan[0].rampDuration - EPSILON && currentThrust * Math.sin(initAngleRad) > m * localGravity) {
      hasLiftedOff = true;
      liftoffTime = t;
    }
    if (!hasLiftedOff && !engineBurning) throw new Error('Startup completed without lift-off. Increase thrust or reduce mass.');

    // Thu thập các giá trị cực đại
    if (z > maxAltitude) {
      maxAltitude = z;
      apogeeTime = t;
    }
    if (v > maxVelocity) maxVelocity = v;

    // Phát hiện đỉnh quỹ đạo Apogee (vz đảo chiều từ dương sang âm)
    if (t >= totalBurnTime && vz <= 0.0 && !hasApogee) {
      hasApogee = true;
      drogueDeployed = true;
    }
    if (hasApogee && z <= 400.0 && !mainDeployed) {
      mainDeployed = true;
    }
    if (t >= totalBurnTime && !hasBurnout) {
      hasBurnout = true;
    }

    // Đánh giá đạo hàm
    const derivCurrent = derivative(t, state);
    const qCurrent = derivCurrent[5];
    const machCurrent = derivCurrent[6];
    const gLoadCurrent = derivCurrent[7];

    if (qCurrent > maxDynamicPressure) {
      maxDynamicPressure = qCurrent;
      maxQAltitude = z;
    }
    if (machCurrent > maxMach) maxMach = machCurrent;
    if (gLoadCurrent > maxAcceleration) maxAcceleration = gLoadCurrent;

    // Ghi lại dữ liệu (Lấy mẫu mỗi 0.2s để đồ thị nhẹ mượt)
    if (step % 4 === 0 || z <= 0.0 || separated) {
      trajectory.push({
        time: Number(t.toFixed(2)),
        downrange: x,
        altitude: Math.max(0, z),
        velocity: Number(v.toFixed(1)),
        verticalVelocity: vz,
        horizontalVelocity: vx,
        mach: Number(machCurrent.toFixed(2)),
        dynamicPressure: Number((qCurrent / 1000.0).toFixed(1)), // kPa
        gLoad: Number(gLoadCurrent.toFixed(1)),
        mass: m,
        engineStage: activeStage + 1,
        stageCount: stagePlan.length,
        thrust: currentThrust,
        throttle: currentThrottle,
        nominalThrust: engine.thrust,
        engineStartTime: engine.startTime,
        rampDuration: engine.rampDuration,
        effectiveIsp: engine.effectiveIsp,
        thrustToWeight: currentThrust * Math.sin(initAngleRad) / (m * localGravity),
        onPad: !hasLiftedOff,
        isEngineActive: engineBurning,
        ...getAirTelemetry(z, v, bodyDiameter, windSpeed, vx, vz, config.environment),
        stage: !hasLiftedOff ? 'IGNITION' : !hasBurnout ? (currentThrottle < 1 ? 'ENGINE_START' : 'POWERED_FLIGHT') : (!hasApogee ? 'COASTING' : (!mainDeployed ? 'DROGUE_DESCENT' : 'MAIN_DESCENT'))
      });
    }

    // Điều kiện dừng: Chạm đất sau khi bay lên
    if (z <= 0.0 && hasLiftedOff && t > liftoffTime + EPSILON) {
      landed = true;
      landingVelocity = v;
      trajectory[trajectory.length - 1].altitude = 0;
      trajectory[trajectory.length - 1].stage = 'LANDED';
      break;
    }

    // Thuật toán RK4
    let stepDt = engineBurning ? Math.min(dt, engine.endTime - t) : dt;
    const rampEnd = engine.startTime + engine.rampDuration;
    if (t < rampEnd - EPSILON) stepDt = Math.min(stepDt, rampEnd - t);
    const k1 = derivative(t, state);
    
    const s2 = state.map((val, i) => val + 0.5 * stepDt * k1[i]);
    const k2 = derivative(t + 0.5 * stepDt, s2);

    const s3 = state.map((val, i) => val + 0.5 * stepDt * k2[i]);
    const k3 = derivative(t + 0.5 * stepDt, s3);

    const s4 = state.map((val, i) => val + stepDt * k3[i]);
    const k4 = derivative(t + stepDt, s4);

    for (let i = 0; i < 5; i++) {
      state[i] += (stepDt / 6.0) * (k1[i] + 2.0 * k2[i] + 2.0 * k3[i] + k4[i]);
    }

    state[4] = Math.max(dryFloor, state[4]); // Khối lượng không bao giờ dưới khối lượng cạn
    if (!state.every(Number.isFinite)) throw new Error('Mô phỏng mất ổn định số. Hãy điều chỉnh cấu hình.');
    if (state[1] < 0 && z > 0) {
      const fraction = z / (z - state[1]);
      state = state.map((value, i) => [x, z, vx, vz, m][i] + fraction * (value - [x, z, vx, vz, m][i]));
      state[1] = 0;
      t += stepDt * fraction;
      step++;
      continue;
    }
    t += stepDt;
    step++;
  }

  // Động năng va chạm lúc chạm đất: Ek = 0.5 * m * v^2
  const impactKineticEnergyJoules = landed ? 0.5 * state[4] * landingVelocity ** 2 : null;

  return {
    trajectory,
    events,
    stagePlan,
    summary: {
      liftoffTimeSec: liftoffTime,
      initialThrustToWeight: stagePlan[0].thrust * Math.sin(initAngleRad) / (mInitial * MU_EARTH / R_EARTH ** 2),
      stageCount: stagePlan.length,
      separations: events.length,
      downrangeMeters: Number(state[0].toFixed(1)),
      terminationReason: landed ? 'LANDED' : 'TIME_LIMIT',
      landed,
      flightDurationSec: Number(t.toFixed(1)),
      maxAltitudeMeters: Number(maxAltitude.toFixed(1)),
      maxAltitudeKm: Number((maxAltitude / 1000.0).toFixed(2)),
      maxVelocityMs: Number(maxVelocity.toFixed(1)),
      maxMach: Number(maxMach.toFixed(2)),
      maxDynamicPressureKPa: Number((maxDynamicPressure / 1000.0).toFixed(1)),
      maxQAltitudeKm: Number((maxQAltitude / 1000.0).toFixed(2)),
      maxGLoad: Number(maxAcceleration.toFixed(1)),
      apogeeTimeSec: Number(apogeeTime.toFixed(1)),
      landingVelocityMs: landed ? Number(landingVelocity.toFixed(2)) : null,
      impactEnergyJoules: landed ? Number(impactKineticEnergyJoules.toFixed(0)) : null,
      isSafeLanding: landed && landingVelocity <= 6.5
    }
  };
}

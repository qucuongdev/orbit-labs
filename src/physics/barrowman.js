/**
 * PHƯƠNG PHÁP BARROWMAN (NASA 1966)
 * Tính toán vị trí tâm áp suất khí động (Center of Pressure - X_cp),
 * trọng tâm (Center of Gravity - X_cg) và biên ổn định tĩnh (Static Margin - S_m).
 */

import { EPSILON } from './constants.js';
import { getEngineStages } from './stages.js';

export function calculateAerodynamicsAndCG(config, material) {
  const {
    noseLength,      // Chiều dài mũi (m)
    noseShape,       // 'ogive' | 'conical'
    bodyDiameter,    // Đường kính thân (m)
    bodyLength,      // Chiều dài thân trụ (m)
    finCount,        // Số cánh (3 hoặc 4)
    finSpan,         // Sải cánh tính từ thân (m)
    finRootChord,    // Dây cánh gốc (m)
    finTipChord,     // Dây cánh đỉnh (m)
    finSweep,        // Chiều dài quét mép trước (m)
    wallThickness,   // Bề dày vỏ (m)
    propellantMass,  // Khối lượng thuốc phóng (kg)
    payloadMass,     // Khối lượng tải trọng đầu mũi (kg)
    engineDryMass    // Khối lượng động cơ rỗng (kg)
  } = config;

  const d = Math.max(0.01, bodyDiameter);
  const r = d / 2.0;
  const totalLength = noseLength + bodyLength;

  // ================= 1. TÍNH TÂM ÁP SUẤT BARROWMAN =================
  // 1.1. Chóp mũi (Nose cone)
  const cnaNose = 2.0;
  let xNose = 0.466 * noseLength; // Tangent Ogive
  if (noseShape === 'conical') {
    xNose = (2.0 / 3.0) * noseLength;
  }

  // 1.2. Cụm cánh đuôi (Fins)
  let cnaFins = 0;
  let xFins = totalLength - 0.1;

  if (finCount > 0 && finSpan > 0.001) {
    const s = finSpan;
    const cr = Math.max(0.01, finRootChord);
    const ct = Math.max(0.001, finTipChord);
    const gamma = Math.max(0, finSweep);

    // Vị trí mép trước gốc cánh đo từ đầu mũi
    const xb = totalLength - cr;

    // Chiều dài đường nối trung điểm dây cánh
    const lMid = Math.sqrt(Math.pow(gamma + (ct - cr) / 2.0, 2) + Math.pow(s, 2));

    // Hệ số tương tác thân-cánh (Fin-Body Interference Factor)
    const kfb = 1.0 + r / (s + r);

    // Hệ số lực pháp tuyến cụm cánh
    const denom = 1.0 + Math.sqrt(1.0 + Math.pow((2.0 * lMid) / (cr + ct), 2));
    cnaFins = (kfb * 4.0 * finCount * Math.pow(s / d, 2)) / Math.max(EPSILON, denom);

    // Tâm áp suất cụm cánh
    xFins = xb + (gamma / 3.0) * ((cr + 2.0 * ct) / (cr + ct)) +
            (1.0 / 6.0) * ((cr + ct) - (cr * ct) / (cr + ct));
  }

  // Tổng tâm áp suất CP bình quân gia quyền
  const cnaTotal = cnaNose + cnaFins;
  const xCp = (cnaNose * xNose + cnaFins * xFins) / Math.max(EPSILON, cnaTotal);

  // ================= 2. TÍNH KHỐI LƯỢNG VÀ TRỌNG TÂM CG =================
  const rhoMat = material.density;

  // 2.1. Khối lượng vỏ mũi (ước lượng diện tích mặt ngoài * bề dày * rho)
  const sWetNose = Math.PI * r * Math.hypot(noseLength, r);
  const mNose = sWetNose * wallThickness * rhoMat;
  const cgNose = 0.55 * noseLength;

  // 2.2. Khối lượng vỏ thân hình trụ
  const sWetBody = 2.0 * Math.PI * r * bodyLength;
  const mBody = sWetBody * wallThickness * rhoMat;
  const cgBody = noseLength + bodyLength / 2.0;

  // 2.3. Khối lượng các cánh
  const areaOneFin = 0.5 * (finRootChord + finTipChord) * finSpan;
  const mFins = finCount * areaOneFin * (wallThickness * 1.5) * rhoMat;
  const cgFins = xFins;

  // 2.4. Tải trọng (Payload) đặt tại 60% chiều dài mũi
  const mPayload = payloadMass;
  const cgPayload = 0.6 * noseLength;

  // 2.5. Động cơ và thuốc phóng đặt ở đuôi
  const engines = getEngineStages(config);
  const mEngine = engines.reduce((sum, stage) => sum + stage.dryMass, 0);
  const cgEngine = totalLength - 0.15;

  const mPropellant = engines.reduce((sum, stage) => sum + stage.propellantMass, 0);
  const cgPropellant = totalLength - 0.35; // Khoang nhiên liệu ở đuôi

  // Tổng khối lượng ban đầu và cạn
  const dryMass = mNose + mBody + mFins + mPayload + mEngine;
  const initialMass = dryMass + mPropellant;

  // Vị trí trọng tâm đầy nhiên liệu CG_initial
  const sumMomentInit = (mNose * cgNose) +
                        (mBody * cgBody) +
                        (mFins * cgFins) +
                        (mPayload * cgPayload) +
                        (mEngine * cgEngine) +
                        (mPropellant * cgPropellant);

  const xCgInitial = sumMomentInit / Math.max(EPSILON, initialMass);

  // Vị trí trọng tâm khi đốt hết nhiên liệu CG_burnout
  const sumMomentDry = (mNose * cgNose) +
                       (mBody * cgBody) +
                       (mFins * cgFins) +
                       (mPayload * cgPayload) +
                       (mEngine * cgEngine);

  const xCgBurnout = sumMomentDry / Math.max(EPSILON, dryMass);

  // ================= 3. BIÊN ĐỘ ỔN ĐỊNH TĨNH (STATIC MARGIN) =================
  // Tính theo Calibers = (X_cp - X_cg) / d
  const staticMarginInitial = (xCp - xCgInitial) / d;
  const staticMarginBurnout = (xCp - xCgBurnout) / d;

  // Đánh giá trạng thái ổn định
  let status = 'OPTIMAL'; // 1.0 <= Sm <= 2.5
  let statusMessage = 'Độ ổn định tối ưu (1.0 - 2.5 Calibers). Tên lửa an toàn khi phóng.';

  if (staticMarginInitial < 0.0) {
    status = 'UNSTABLE_SEVERE';
    statusMessage = 'NGUY HIỂM: Trọng tâm nằm sau Tâm áp suất (CG > CP). Tên lửa sẽ lật nhào ngay khi rời bệ!';
  } else if (staticMarginInitial < 1.0) {
    status = 'MARGINAL_UNSTABLE';
    statusMessage = 'CẢNH BÁO: Biên ổn định quá thấp (< 1.0 Caliber). Rất dễ mất hướng dưới gió giật.';
  } else if (staticMarginInitial > 3.0) {
    status = 'OVER_STABLE';
    statusMessage = 'CHÚ Ý: Tên lửa quá ổn định (> 3.0 Calibers), sẽ nhạy cảm bẻ lái đâm ngang vào hướng gió.';
  }

  return {
    xCp,
    xCgInitial,
    xCgBurnout,
    staticMarginInitial,
    staticMarginBurnout,
    cnaTotal,
    totalLength,
    dryMass,
    initialMass,
    status,
    statusMessage
  };
}

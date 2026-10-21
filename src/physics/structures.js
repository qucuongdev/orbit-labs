/**
 * CƠ HỌC KẾT CẤU & BÌNH ÁP LỰC VŨ TRỤ
 * Tính toán ứng suất màng mỏng, tiêu chuẩn mất ổn định uốn vỏ mỏng NASA SP-8007
 * và hệ số an toàn kết cấu (Safety Factor - SF).
 */

export function analyzeStructuralIntegrity(config, material, internalPressurePa = 3e6, axialCompressiveForceN = 15000) {
  const { bodyDiameter, wallThickness } = config;
  const r = bodyDiameter / 2.0;
  const t = Math.max(0.0005, wallThickness);

  // 1. Ứng suất màng bình áp lực (Thin-walled stress)
  const hoopStress = (internalPressurePa * r) / t; // sigma_h = p*r/t
  const longitudinalStress = (internalPressurePa * r) / (2.0 * t); // sigma_l = p*r/(2t)

  // Ứng suất nén dọc trục do gia tốc quán tính
  const axialCompressiveStress = axialCompressiveForceN / (2.0 * Math.PI * r * t);
  const netLongitudinalStress = longitudinalStress - axialCompressiveStress;

  // Ứng suất tương đương Von Mises
  const vonMisesStress = Math.sqrt(
    Math.pow(hoopStress, 2) - hoopStress * netLongitudinalStress + Math.pow(netLongitudinalStress, 2)
  );

  // Hệ số an toàn chảy dẻo (Yield Safety Factor)
  const yieldSafetyFactor = material.yieldStrength / Math.max(1.0, vonMisesStress);

  // 2. Mất ổn định nén vỏ mỏng theo tiêu chuẩn NASA SP-8007
  const rOverT = r / t;
  const E = material.youngsModulus;
  const nu = material.poissonRatio;

  // Knockdown factor hiệu chỉnh sai lệch chế tạo NASA
  const gammaBuckle = 1.0 - 0.901 * (1.0 - Math.exp(-(1.0 / 16.0) * Math.sqrt(rOverT)));
  
  // Ứng suất nén tới hạn gây sụp đổ vỏ mỏng
  const sigmaCritBuckling = gammaBuckle * (E / Math.sqrt(3.0 * (1.0 - Math.pow(nu, 2)))) * (t / r);

  // Hệ số an toàn chống sụp đổ uốn (Buckling SF)
  const bucklingSafetyFactor = sigmaCritBuckling / Math.max(1.0, axialCompressiveStress);

  // Đánh giá tổng quan
  const isPressureSafe = yieldSafetyFactor >= 1.25;
  const isBucklingSafe = bucklingSafetyFactor >= 1.40;

  return {
    hoopStressMPa: hoopStress / 1e6,
    vonMisesStressMPa: vonMisesStress / 1e6,
    yieldSafetyFactor,
    sigmaCritBucklingMPa: sigmaCritBuckling / 1e6,
    bucklingSafetyFactor,
    isPressureSafe,
    isBucklingSafe,
    statusText: (isPressureSafe && isBucklingSafe)
      ? 'KẾT CẤU AN TOÀN (Thỏa mãn tiêu chuẩn NASA)'
      : 'CẢNH BÁO: Bề dày vỏ quá mỏng hoặc áp suất quá tải!'
  };
}

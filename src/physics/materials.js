/**
 * CƠ SỞ DỮ LIỆU VẬT LIỆU HÀNG KHÔNG VŨ TRỤ
 * Bảng thông số cơ lý tính phục vụ tính khối lượng, ứng suất vỏ mỏng và hiển thị 3D
 */

export const MATERIALS = {
  AL_6061: {
    id: 'AL_6061',
    name: 'Hợp kim Nhôm 6061-T6',
    density: 2700,             // kg/m^3
    yieldStrength: 276e6,      // Pa (276 MPa)
    youngsModulus: 68.9e9,     // Pa (68.9 GPa)
    poissonRatio: 0.33,
    color: '#c0c5ce',
    metalness: 0.85,
    roughness: 0.25,
    description: 'Vật liệu kinh điển, gia công dễ, giá thành rẻ, phù hợp thân tên lửa tiêu chuẩn.'
  },
  AL_LI_2195: {
    id: 'AL_LI_2195',
    name: 'Nhôm - Liti 2195 (Cryogenic)',
    density: 2710,
    yieldStrength: 540e6,      // 540 MPa
    youngsModulus: 76e9,       // 76 GPa
    poissonRatio: 0.32,
    color: '#d4af37',
    metalness: 0.90,
    roughness: 0.20,
    description: 'Siêu nhẹ, độ dẻo dai cao ở nhiệt độ âm sâu (-183°C). Chuẩn cho bình chứa Falcon 9 & SLS.'
  },
  CFRP_CARBON: {
    id: 'CFRP_CARBON',
    name: 'Composite Sợi Carbon (T800)',
    density: 1550,             // Siêu nhẹ 1.55 g/cm^3
    yieldStrength: 850e6,      // 850 MPa
    youngsModulus: 135e9,      // 135 GPa
    poissonRatio: 0.28,
    color: '#1a1a1a',
    metalness: 0.30,
    roughness: 0.50,
    description: 'Tỷ số độ bền trên khối lượng cao nhất thế giới. Chuẩn cho bình áp lực quấn sợi COPV và tên lửa Electron.'
  },
  SS_304L: {
    id: 'SS_304L',
    name: 'Thép Không Gỉ 304L / 301',
    density: 7900,             // Nặng 7.9 g/cm^3
    yieldStrength: 290e6,      // 290 MPa (lạnh hóa có thể lên 600+)
    youngsModulus: 193e9,      // 193 GPa
    poissonRatio: 0.29,
    color: '#e5e7eb',
    metalness: 0.95,
    roughness: 0.15,
    description: 'Chịu nhiệt tái nhập bầu khí quyển xuất sắc, giá siêu rẻ. Chuẩn cho SpaceX Starship.'
  },
  TITANIUM_TI6AL4V: {
    id: 'TITANIUM_TI6AL4V',
    name: 'Hợp kim Titan Grade 5 (Ti-6Al-4V)',
    density: 4430,
    yieldStrength: 880e6,      // 880 MPa
    youngsModulus: 114e9,      // 114 GPa
    poissonRatio: 0.34,
    color: '#8b8e96',
    metalness: 0.80,
    roughness: 0.35,
    description: 'Chống ăn mòn tuyệt đối, độ bền cực cao ở nhiệt độ cao, dùng cho cánh lưới Grid Fins và khớp nối áp lực.'
  }
};

export const DEFAULT_MATERIAL = MATERIALS.AL_6061;

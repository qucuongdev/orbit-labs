/**
 * HẰNG SỐ VẬT LÝ VÀ ĐỊA CẦU TIÊU CHUẨN
 * Theo chuẩn US Standard Atmosphere 1976 và WGS84
 */

export const G0 = 9.80665;              // Gia tốc trọng trường chuẩn tại mặt biển (m/s^2)
export const R_EARTH = 6371000.0;       // Bán kính trung bình Trái Đất (m)
export const MU_EARTH = 3.986004418e14; // Hằng số hấp dẫn chuẩn GM (m^3/s^2)
export const J2_EARTH = 1.08263e-3;     // Hệ số làm dẹt cực Trái Đất (J2 perturbation)

// Hằng số nhiệt động khí quyển
export const P0_SEA_LEVEL = 101325.0;   // Áp suất mặt biển tiêu chuẩn (Pa)
export const T0_SEA_LEVEL = 288.15;     // Nhiệt độ mặt biển tiêu chuẩn (K)
export const R_AIR = 287.05287;         // Hằng số khí đặc trưng của không khí (J/kg.K)
export const GAMMA_AIR = 1.4;           // Tỷ số nhiệt dung riêng của không khí

// Hằng số tính toán an toàn
export const EPSILON = 1e-6;            // Ngưỡng chống chia cho 0
export const MAX_SIM_STEPS = 40000;     // Giới hạn bước lặp RK4 chống treo CPU
export const MAX_FLIGHT_TIME = 900;     // Giới hạn thời gian bay tối đa (15 phút)

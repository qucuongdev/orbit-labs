# TIÊU CHUẨN MÃ NGUỒN VÀ QUY TẮC PHÁT TRIỂN (CODE CONVENTIONS & STYLE GUIDE)

> **Áp dụng cho toàn bộ dự án:** Mô phỏng Chế tạo và Phóng Tên lửa 3D (React + Three.js + Vercel)  
> **Mục tiêu:** Đảm bảo mã nguồn nhất quán, thuần khiết về mặt toán học, tối ưu GPU/WebGL và sẵn sàng triển khai an toàn trên Vercel.

---

## 1. NGUYÊN TẮC KIẾN TRÚC PHẦN MỀM (ARCHITECTURE PRINCIPLES)

### 1.1. Tách biệt tuyệt đối giữa Lõi Vật lý (Physics Core) và Giao diện (UI/3D)
* **Quy tắc bất biến:** Toàn bộ công thức vật lý (Barrowman, RK4, ISA Atmosphere, Buckling, Netting COPV) phải được viết dưới dạng **Pure Functions (Hàm thuần khiết)** độc lập, đặt trong thư mục `src/physics/`.
* **Không được phép:** 
  * Không import React, Three.js, CSS hay hook (`useState`, `useEffect`) vào thư mục `src/physics/`.
  * Các hàm vật lý chỉ nhận số thực (hoặc mảng số thực) và trả về kết quả số thực.
  * **Lý do:** Giúp việc viết Unit Test tự động cho công thức toán đạt độ bao phủ 100% mà không cần khởi tạo DOM.

### 1.2. Phòng vệ Toán học (Defensive Numerical Computing)
Mô phỏng bay lặp hàng chục ngàn bước thời gian $dt$, sai số nhỏ có thể gây sụp đổ:
* **Chống chia cho 0:** Luôn có `EPSILON = 1e-6` hoặc `Math.max(EPSILON, denominator)`.
* **Kiểm tra NaN / Infinity:** Mọi đạo hàm và biến trạng thái sau mỗi bước RK4 phải được kiểm tra `!Number.isFinite(val)`. Nếu xuất hiện `NaN`, lập tức ngắt vòng lặp và ghi log cảnh báo.
* **Kẹp giá trị (Clamping):** Các tỷ số lượng giác hoặc căn bậc hai phải được kẹp an toàn (ví dụ: `Math.sqrt(Math.max(0, value))`).

---

## 2. QUY ƯỚC ĐẶT TÊN (NAMING CONVENTIONS)

| Đối tượng | Quy ước | Ví dụ minh họa |
| :--- | :--- | :--- |
| **Component React** | `PascalCase` | `RocketCanvas.jsx`, `MaterialSelector.jsx` |
| **Custom Hooks** | `camelCase` (bắt đầu bằng `use`) | `useRocketPhysics.js`, `useFlightSimulation.js` |
| **Hàm & Phương thức** | `camelCase` (động từ đứng đầu) | `calculateCenterOfPressure()`, `solveRungeKutta4()` |
| **Biến trạng thái & Đối tượng** | `camelCase` | `rocketConfig`, `isEngineRunning`, `dryMass` |
| **Hằng số vật lý bất biến** | `UPPER_SNAKE_CASE` | `G0 = 9.80665`, `EARTH_RADIUS = 6371000.0`, `R_AIR = 287.05` |
| **File CSS / Tailwind** | `kebab-case` | `custom-slider.css` |

---

## 3. QUY TẮC HIỆU NĂNG WEBGL & THREE.JS (MEMORY & PERFORMANCE)

Three.js chạy trực tiếp trên GPU, JavaScript Garbage Collector **không tự giải phóng bộ nhớ GPU**.

1. **Thu dọn tài nguyên (Resource Disposal):**
   * Mọi `geometry`, `material`, `texture` được tạo mới động phải gọi `.dispose()` khi component unmount.
   * Với `@react-three/fiber`, ưu tiên khai báo hình học dạng JSX khai báo sẵn (`<cylinderGeometry />`) thay vì tự tạo bằng `new THREE.CylinderGeometry()` để Fiber tự quản lý bộ nhớ.
2. **Khống chế số đa giác (Polygon Budget):**
   * Thân tên lửa dạng trụ: Đặt số cạnh tròn `radialSegments = 32` (hoặc tối đa `64` cho chóp mũi). Tránh dùng số lượng phân đoạn quá lớn $> 128$ gây tụt FPS trên thiết bị di động.
3. **Tách biệt vòng lặp tính toán (Decoupled Physics Tick):**
   * Khi người dùng bấm "Launch", giải toàn bộ dữ liệu quỹ đạo RK4 trước (hoặc tính toán trong `Web Worker`), sau đó cấp dữ liệu tọa độ theo thời gian $t$ cho `useFrame()` để render animation 60 FPS mượt mà.

---

## 4. QUY TẮC BẢO MẬT & KIỂM SOÁT ĐẦU VÀO (SECURITY RULES)

1. **Kiểm duyệt Input cực đoan (Sanitization & Range Clamping):**
   Mọi thanh trượt nhập số liệu của người dùng phải có `min`, `max`, `step` chặt chẽ ở cả giao diện HTML và trong logic JS:
   - Chiều dài tên lửa: $0.2\,\text{m} \le L \le 50.0\,\text{m}$.
   - Khối lượng: $0.1\,\text{kg} \le m \le 500\,000\,\text{kg}$.
   - Thời gian cháy: $0.5\,\text{s} \le t_{burn} \le 300\,\text{s}$.
2. **Chống treo trình duyệt (CPU Exhaustion / DoS):**
   - Vòng lặp mô phỏng RK4 phải có giới hạn bước lặp tối đa `MAX_STEPS = 50000` hoặc `t_max = 1200` giây để ngăn chặn trường hợp tên lửa không bao giờ chạm đất làm treo trình duyệt.
3. **Cấu hình Security Headers trên Vercel:**
   - Thiết lập `vercel.json` có đầy đủ các header an toàn: `X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy`.

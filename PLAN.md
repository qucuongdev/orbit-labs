# KẾ HOẠCH PHÁT TRIỂN DỰ ÁN (PROJECT IMPLEMENTATION PLAN)

> **Dự án:** Rocket Simulator 3D (Web mô phỏng thiết kế, chế tạo và tính toán quỹ đạo phóng tên lửa)  
> **Kiến trúc:** React 18 + Vite + Three.js (@react-three/fiber + drei) + ECharts + Vercel  
> **Cơ sở lý thuyết:** `BAO_CAO_MO_PHONG_CHE_TAO_VA_PHONG_TEN_LUA.md`  
> **Hệ thống điều hành:** 5 AI Subagents (`.agents/`)

---

## LỘ TRÌNH 5 GIAI ĐOẠN (5-PHASE ROADMAP)

### 📌 GIAI ĐOẠN 1: THIẾT LẬP DỰ ÁN & LÕI VẬT LÝ HÀNG KHÔNG VŨ TRỤ (PHASE 1 - CORE PHYSICS & FOUNDATION)
- [x] Tạo tài liệu chân lý lý thuyết chuyên sâu `BAO_CAO_MO_PHONG_CHE_TAO_VA_PHONG_TEN_LUA.md`.
- [x] Thiết lập hệ thống 5 AI Subagents (`.agents/`) và quy chuẩn `CODE_CONVENTIONS.md`.
- [x] Thiết lập `PLAN.md`, `WORKLOG.md`, `TROUBLESHOOTING.md`, `README.md`.
- [x] Khởi tạo bộ khung dự án Vite + React, file cấu hình `package.json`, `vite.config.js`, `vercel.json`.
- [x] Xây dựng các module vật lý thuần (Pure Functions) trong `src/physics/`:
  - `constants.js`: Hằng số vật lý tiêu chuẩn ($g_0, R_E, \mu, R_{air}, \gamma$).
  - `materials.js`: Cơ sở dữ liệu vật liệu vũ trụ (Al 6061, Al-Li 2195, SS 304L, Carbon Fiber CFRP, Titanium Gr5).
  - `atmosphere.js`: Khí quyển tiêu chuẩn ISA / US Standard Atmosphere 1976.
  - `barrowman.js`: Giải thuật tính tâm áp suất $X_{cp}$, trọng tâm $X_{cg}$ và biên ổn định $S_m$.
  - `structures.js`: Kiểm tra ứng suất vỏ mỏng và tiêu chuẩn mất ổn định uốn NASA SP-8007.
  - `rk4Solver.js`: Tích phân số Runge-Kutta bậc 4 giải chuyển động bay 3-DOF có lực cản phi tuyến và Gravity turn.

### 📌 GIAI ĐOẠN 2: DỰNG MÔ HÌNH 3D PARAMETRIC & HIỂN THỊ TRỰC QUAN (PHASE 2 - 3D RENDERING)
- [x] Xây dựng component `RocketCanvas.jsx`: Canvas R3F, camera phối cảnh, ánh sáng, sàn lưới `Grid`, la bàn `GizmoHelper`, bộ điều khiển xoay chuột `OrbitControls`.
- [x] Xây dựng component `RocketModel.jsx`: Render động chóp mũi (Nose cone), thân trụ (Cylinder body), loa phụt động cơ (Nozzle) và cụm 3 hoặc 4 cánh đuôi (Fins) theo tham số kích thước thời gian thực.
- [x] Xây dựng component `Markers.jsx`: Ghim trực tiếp 2 điểm chỉ thị 3D trên thân:
  - Chấm tròn xanh lá: **CG (Trọng tâm)**
  - Chấm tròn đỏ: **CP (Tâm áp suất)**
- [x] Hiệu ứng khói lửa đuôi động cơ `Plume.jsx` kích hoạt khi tên lửa bắt đầu bay.

### 📌 GIAI ĐOẠN 3: GIAO DIỆN TÙY BIẾN THIẾT KẾ & ĐỒ THỊ TELEMETRY (PHASE 3 - UI CONTROLS & CHARTS)
- [x] Xây dựng `ConfigPanel.jsx`: Các thanh trượt điều chỉnh chiều dài mũi, đường kính thân, chiều cao, sải cánh, chọn vật liệu và thông số động cơ.
- [x] Xây dựng `StabilityBadge.jsx`: Hiển thị biên ổn định tĩnh $S_m$ dạng Calibers với chỉ báo màu sắc (Xanh: Tối ưu / Đỏ: Nguy hiểm).
- [x] Xây dựng `FlightDashboard.jsx`: Nút bấm **"PHÓNG (LAUNCH)"**, **"DỪNG (PAUSE)"**, **"ĐẶT LẠI (RESET)"** và đồng hồ telemetry số.
- [x] Xây dựng `TelemetryCharts.jsx` dùng ECharts: Vẽ đồ thị độ cao $z(t)$, vận tốc $v(t)$, gia tốc $a(t)$ và áp suất động $q(t)$ (điểm Max-Q).

### 📌 GIAI ĐOẠN 4: LIÊN KẾT ĐỘNG LỰC HỌC BAY & ANIMATION CHUYẾN BAY (PHASE 4 - SIMULATION LOOP)
- [x] Kết nối nút "Launch" với bộ giải vi phân `rk4Solver.js`.
- [x] Tạo vòng lặp animation bay thời gian thực trong Three.js: Tên lửa rời bệ phóng, bay lên theo dữ liệu quỹ đạo RK4, nghiêng đầu Gravity turn, dập lửa động cơ và bung dù hạ cánh.
- [x] Đồng bộ con trỏ thời gian trên đồ thị Telemetry theo vị trí tức thời của tên lửa trên bầu trời 3D.
- [x] Hiển thị bảng tổng kết nhiệm vụ sau chuyến bay `MissionSummaryModal.jsx`: Độ cao cực đại (Apogee), vận tốc lớn nhất, điểm Max-Q, vận tốc tiếp đất và đánh giá an toàn.

### 📌 GIAI ĐOẠN 5: KIỂM THỬ ĐA ĐẶC VỤ, BẢO MẬT & DEPLOY VERCEL (PHASE 5 - AUDIT & DEPLOY)
- [ ] `@04_QA` chạy kiểm thử các ca biên: Nhập sải cánh $= 0$, khối lượng cực nhỏ, thời gian cháy cực lớn.
- [ ] `@05_SEC` kiểm toán chống treo trình duyệt (CPU DoS), làm sạch input, kiểm tra security headers trong `vercel.json`.
- [ ] Chạy `npm.cmd run build` kiểm tra tạo thư mục `dist` không lỗi.
- [ ] Đẩy lên Vercel và kiểm tra hoạt động trực tiếp trên web.

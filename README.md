# 🚀 ROCKET SIMULATOR 3D


## Global Rocket & Space Flight Simulator

Ứng dụng mở mặc định với Trái Đất 3D Cesium, ảnh vệ tinh/địa hình truyền theo tile,
16 phương tiện, tìm kiếm/lọc/so sánh, WGS84/ECEF, camera Global/Surface/Follow/Onboard/Free,
telemetry, timeline có tua lại và tốc độ 0.25×–128×. Không cần token Cesium ion cho
các dịch vụ Esri công khai đang cấu hình; có bản đồ nền cục bộ khi mất mạng.

Nút **Lưới 3D / Phòng thí nghiệm** mở lại toàn bộ simulator cũ (hoặc truy cập
`?mode=lab`). Mỗi thời điểm chỉ chạy một renderer.

**Phạm vi độ chính xác:** quỹ đạo hai vật thể và tái nhập tổng quát có tính toán vật lý;
pha phóng, lịch tách tầng và các chuyến bay nghiên cứu toàn cầu là minh họa.
Mô hình 3D giản lược, chưa phải CAD. Khí tượng lấy từ Open-Meteo để tham khảo,
chưa dùng trong quỹ đạo toàn cầu. Tên lửa quân sự chỉ có cung khái niệm chung.
Xem [kiến trúc, nguồn dữ liệu và các giả định](src/global/README.md).

Chạy `pnpm dev`, kiểm tra `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm build`.
Sinh lại mô hình bằng `pnpm models:generate` khi cập nhật kích thước/hình học.

## Phòng thí nghiệm tên lửa

### Cập nhật mô phỏng và kiểm thử

- Hai môi trường: **Khung lưới 3D** giữ nguyên bối cảnh cũ và **Thực tế · Bản đồ** dùng OpenStreetMap. Có thể đổi chế độ trong khi bay; đồng hồ phát lại chạy độc lập với Canvas.
- Phóng có đếm ngược **3–2–1**, có thể hủy bằng Đặt lại. Âm thanh được tổng hợp bằng Web Audio, định vị HRTF theo camera; có nút tắt. POV mô phỏng tiếng rung bên thân, không mô phỏng âm thanh truyền trong chân không.
- Số đếm nằm ở góc, giữ cảnh tên lửa rõ ràng. Sau đếm ngược, động cơ tăng lực từ 0, tiêu hao nhiên liệu trên bệ và chỉ rời bệ sau khi tăng lực xong, lực nâng thắng trọng lượng. Mẫu mặc định 350 N / 30 s có TWR ban đầu khoảng 1,84. Thời gian tăng lực 2,5 s là giả định chỉnh được; không phải đường đặc tính động cơ NASA. Xem [công thức và tài liệu chính thức](src/physics/PHYSICS_MODEL.md).
- Camera **Bám / Tự do / POV gắn thân**. Chế độ mặt cắt mở một phần vỏ, có bình chứa, nắp, đường ống, bo điều khiển, khung và cụm động cơ. Bề ngang được phóng đại riêng khi xem cấu tạo.
- Lắp 1–3 tầng; mỗi tầng chỉnh lực đẩy, nhiên liệu, khối lượng động cơ khô và thời gian cháy. Bộ giải chia bước đúng thời điểm tách tầng, trừ khối lượng bỏ đi, giữ vận tốc liên tục rồi đốt tầng kế. Khối lượng vỏ chung được chia đều theo số tầng. Rơi của tầng đã tách là hoạt ảnh minh họa, không phải một quỹ đạo RK4 độc lập.
- Bản đồ cho nhập tọa độ bệ, bấm chọn vị trí và chọn hướng hiển thị; có đường toàn chuyến và vệt đã bay. Nền bản đồ tải theo vùng nhìn, có ghi nguồn OpenStreetMap.
- Nút **Lấy thời tiết** dùng [Open-Meteo](https://open-meteo.com/en/docs): thời gian, nhiệt độ, áp suất mặt đất, tốc độ và hướng gió. Gió được chiếu lên mặt phẳng bay; hiệu chỉnh nhiệt độ và áp suất giảm dần theo độ cao. Mất mạng vẫn dùng thông số thủ công được. Chọn bệ mới sẽ bỏ bản chụp thời tiết của bệ cũ.
- Các trường số mở rộng cho phép cấu hình tự do trong phạm vi hỗ trợ. Mốc dân dụng tham khảo [Saturn V — NASA](https://www.nasa.gov/learning-resources/for-kids-and-students/what-was-the-saturn-v-grades-5-8/) không phải giới hạn tuyệt đối của mọi tên lửa trên thế giới, cũng không phải bộ thông số hiệu chuẩn quỹ đạo thực.

**Giới hạn:** bộ giải hiện là chuyển động tịnh tiến trong mặt phẳng 2D với khí động gần đúng; chưa giải quay sáu bậc tự do, thay đổi khí động sau tách tầng, quỹ đạo quanh Trái Đất, địa hình hoặc trường gió theo độ cao. Vị trí kết thúc trên bản đồ là hình chiếu của mô hình này, không phải dự báo điểm rơi chính xác ngoài thực địa. `VITE_MAP_TILE_URL` có thể thay nguồn ô bản đồ tương thích; mặc định dùng OpenStreetMap.

- Tính quỹ đạo trong Web Worker; phát lại bằng nội suy vị trí và vận tốc, camera bám mượt.
- Chỉ báo tiếp đất khi thực sự chạm đất. Hết giới hạn 900 giây hiển thị chuyến bay chưa hoàn tất.
- Chặn phóng khi lực đẩy thẳng đứng không thắng trọng lượng hoặc biên ổn định dưới 1 caliber.
- Bảng khí động hiển thị tốc độ so với mặt đất, tốc độ qua khí đã trừ gió ngang, Mach, áp suất động, tải tham chiếu q × A và góc nghiêng thân.
- Gió ngang đều có thể điều chỉnh từ -20 đến 20 m/s. Mô hình quỹ đạo hai chiều; đung đưa dưới dù là hoạt ảnh minh họa, chưa giải chuyển động xoay sáu bậc tự do.
- Dù con và dù chính có dây treo và hiệu ứng mở, dùng cùng đường kính với solver. Thân hạ xuống theo tư thế đầu lên, đuôi xuống. Camera lùi ra khi bung dù.
- Độ rộng lửa theo miệng phụt; chiều dài và độ sáng theo lực đẩy bằng preset hiển thị. Khối lượng tác động lên quỹ đạo, không trực tiếp đổi kích thước lửa.
- Bảng màu luồng phụt dùng preset nhiệt độ minh họa; chưa tính nhiệt hóa học theo nhiên liệu và không suy nhiệt độ từ màu lửa.
- Giao diện màn hình nhỏ dùng tab Thiết kế / Mô phỏng 3D / Chỉ số & đồ thị. Tailwind được build cục bộ.

```bash
pnpm test                  # Kiểm thử solver, khí động và nội suy
pnpm exec playwright install chromium
pnpm test:e2e              # Kiểm thử trình duyệt desktop và mobile
pnpm build
```

Có thể đặt biến `PLAYWRIGHT_CHROMIUM_EXECUTABLE` để dùng Chromium đã cài sẵn.

> **Web mô phỏng 3D thiết kế, chế tạo và tính toán quỹ đạo phóng tên lửa**  
> Xây dựng bằng React + Three.js + ECharts. Tích hợp hệ thống 5 AI Subagents phản biện lập trình. Triển khai 1-click lên Vercel.

---

## ⚡ KHỞI CHẠY NHANH (QUICKSTART VỚI PNPM)

Chạy 3 lệnh sau để khởi động dự án ngay lập tức:

```bash
# 1. Cài đặt thư viện siêu tốc với pnpm
pnpm install

# 2. Khởi chạy máy chủ phát triển (Dev Server)
pnpm dev
# Truy cập: http://localhost:5173

# 3. Đóng gói kiểm tra trước khi deploy
pnpm build
```

### 🌐 Deploy lên Vercel trong 1 phút
```bash
# Cài đặt Vercel CLI (nếu chưa có) và deploy
pnpm dlx vercel --prod
```

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG (TECH STACK)

* **Frontend:** React 18 + Vite (SPA - Không dùng SSR để tối ưu WebGL).
* **3D Graphics:** Three.js + `@react-three/fiber` + `@react-three/drei`.
* **Telemetry Charts:** `echarts-for-react` (Đồ thị thời gian thực 60 FPS).
* **Styling & UI:** Tailwind CSS + Lucide Icons.
* **Physics Engine:** Thuần JavaScript (Pure Functions, không phụ thuộc DOM).

---

## 📂 CẤU TRÚC DỰ ÁN

```
rocket/
├── README.md                                    # Tài liệu hướng dẫn này
├── BAO_CAO_MO_PHONG_CHE_TAO_VA_PHONG_TEN_LUA.md # Nguồn chân lý lý thuyết & công thức toán lý
├── .agents/                                     # Hệ thống 5 AI Subagents phản biện code
│   ├── CODE_CONVENTIONS.md                      # Chuẩn mực code, style, dọn rác WebGL
│   ├── AGENTS_WORKFLOW.md                       # Quy trình tranh luận & phê duyệt 5 bên
│   ├── 01_BA_Aerospace_Spec.md                  # Agent Nghiệp vụ & Toán lý vũ trụ
│   ├── 02_UIUX_Space_Designer.md                # Agent Thiết kế giao diện SpaceX 3D
│   ├── 03_Frontend_3D_Engineer.md               # Agent Lập trình viên React & Three.js
│   ├── 04_QA_Physics_Tester.md                  # Agent Kiểm thử phá hoại & Ca biên
│   └── 05_Security_DevSecOps.md                 # Agent Bảo mật input, chống DoS, Vercel
├── src/
│   ├── physics/                                 # Lõi thuật toán: Barrowman, RK4, ISA Atmosphere
│   └── components/                              # 3D Canvas, Thanh trượt, Đồ thị
├── package.json
└── vercel.json                                  # Cấu hình định tuyến & Security Headers Vercel
```

---

## 🤖 CÁCH RA LỆNH CHO AI LẬP TRÌNH BẰNG 5 SUBAGENTS

Copy đoạn prompt mẫu này gửi cho AI để bắt đầu code bất kỳ tính năng nào:

> *"Đọc file `BAO_CAO_MO_PHONG_CHE_TAO_VA_PHONG_TEN_LUA.md` và tuân thủ `CODE_CONVENTIONS.md`. Hãy cho `@01_BA` và `@02_UX` lập spec, `@03_FE` viết code, sau đó để `@04_QA` và `@05_SEC` kiểm tra ca biên (chia cho 0, NaN, DoS loop, rò rỉ WebGL) trước khi hoàn tất."*

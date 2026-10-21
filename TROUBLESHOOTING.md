# SỔ TAY XỬ LÝ SỰ CỐ VÀ LỖI DỰ ÁN (TROUBLESHOOTING & POST-MORTEM LOG)

> Tài liệu ghi lại các lỗi kỹ thuật, cạm bẫy (gotchas), nguyên nhân gốc rễ và cách khắc phục triệt để nhằm ngăn ngừa tái diễn.

---

## 1. MÔI TRƯỜNG & HỆ THỐNG (ENVIRONMENT & OS)

### 🚨 Lỗi 01: PowerShell chặn thực thi lệnh `npm` do chính sách ExecutionPolicy
* **Hiện tượng:** Chạy `npm -v` hoặc `npm install` báo lỗi:  
  `File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system. PSSecurityException`.
* **Nguyên nhân gốc rễ:** Windows PowerShell mặc định tắt tính năng chạy script `.ps1` chưa ký duyệt.
* **Cách khắc phục:**
  1. *Cách 1 (Tốt nhất & Khuyên dùng):* Chuyển sang dùng **`pnpm`** (`pnpm install`, `pnpm dev`, `pnpm build`). `pnpm` không bị chặn bởi PowerShell script policy và tốc độ nhanh gấp đôi npm!
  2. *Cách 2:* Gọi trực tiếp `npm.cmd` thay vì `npm`.

### 🚨 Lỗi 02: `pnpm` báo lỗi `ERR_PNPM_IGNORED_BUILDS` với `esbuild`
* **Hiện tượng:** Khi chạy `pnpm install` trên pnpm v10+ hoặc v12+, xuất hiện lỗi:  
  `Ignored build scripts: esbuild@0.21.5. help: Run "pnpm approve-builds"`.
* **Nguyên nhân:** Tính năng bảo mật chuỗi cung ứng (Supply-chain security) mới của pnpm mặc định chặn thực thi các postinstall script độc lập trừ khi được người dùng phê duyệt.
* **Cách khắc phục:** Chạy lệnh tự động phê duyệt:  
  `pnpm approve-builds --all`

---

## 2. WEBGL & THREE.JS / REACT THREE FIBER (3D RENDERING)

### 🚨 Lỗi 02: Lỗi "window is not defined" khi dùng Three.js trong React
* **Hiện tượng:** Ứng dụng bị sập màn hình trắng khi tải trang hoặc khi deploy lên Vercel.
* **Nguyên nhân:** Three.js và thư viện đồ thị Plotly/ECharts truy cập trực tiếp vào đối tượng `window` và DOM `canvas` của trình duyệt. Nếu cấu hình dự án theo dạng Server-Side Rendering (SSR) như Next.js thì server không có `window`.
* **Cách khắc phục:**
  - Sử dụng **Vite + React (SPA)** thuần client-side.
  - Cấu hình file `vercel.json` định tuyến toàn bộ request về `index.html`.

### 🚨 Lỗi 03: Rò rỉ bộ nhớ GPU (WebGL Context Lost) sau khi người dùng kéo thanh trượt nhiều lần
* **Hiện tượng:** Khung nhìn 3D biến thành màu đen hoặc trình duyệt hiện thông báo "WebGL context was lost".
* **Nguyên nhân:** Khi người dùng thay đổi kích thước cánh hoặc đổi vật liệu liên tục, mỗi lần render lại Three.js cấp phát vùng nhớ buffer mới trên card đồ họa (VRAM) mà không giải phóng hình học cũ.
* **Cách phòng ngừa:**
  - Khai báo hình học dạng JSX khai báo sẵn trong `@react-three/fiber` (`<cylinderGeometry />`, `<coneGeometry />`) để Fiber tự động thu hồi bộ nhớ.
  - Không tự tiện gọi `new THREE.BufferGeometry()` bên trong hàm render mà không có hàm dọn dẹp `.dispose()` trong `useEffect()`.

### 🚨 Lỗi 04: Màn hình đen thui (Blank Screen) do `echarts-for-react` và `<Environment />`
* **Hiện tượng:** Truy cập `localhost:5173` nhưng toàn bộ trang web chỉ có màu nền đen, không hiển thị bất kỳ giao diện nào.
* **Nguyên nhân gốc rễ 1:** Thư viện `echarts-for-react` đóng gói dạng CommonJS. Khi Vite import trong môi trường ESM, biến `ReactECharts` bị bọc 2 lớp default (`{ default: { default: [Function] } }`). Khi React gọi `<ReactECharts />`, React sẽ ném ngoại lệ: *"Element type is invalid: expected a string or a class/function but got: object"*, làm sụp đổ toàn bộ cây giao diện React!
* **Nguyên nhân gốc rễ 2:** Thẻ `<Environment preset="city" />` trong `@react-three/drei` tự động kích hoạt React Suspense để tải ảnh HDR qua mạng. Nếu không có `<Suspense fallback={null}>` hoặc mạng chặn GitHub raw, React sẽ sập ngay lập tức.
* **Cách khắc phục triệt để:**
  1. Thêm bộ giải mã an toàn trong `TelemetryCharts.jsx`:  
     `const ReactECharts = typeof ReactEChartsRaw === 'function' ? ReactEChartsRaw : (ReactEChartsRaw?.default?.default || ReactEChartsRaw?.default || ReactEChartsRaw);`
  2. Bọc toàn bộ không gian 3D trong `<Suspense fallback={null}>` và thay thế `<Environment />` bằng hệ thống ánh sáng Three.js đa chiều (`ambientLight`, `hemisphereLight`, `directionalLight`) để chạy 100% offline không phụ thuộc internet.
  3. Bọc các component quan trọng trong `<ErrorBoundary />` để nếu có lỗi cục bộ thì không làm sập cả trang web.

---

## 3. TOÁN - LÝ HÀNG KHÔNG VŨ TRỤ (PHYSICS NUMERICAL ERRORS)

### 🚨 Lỗi 04: Vận tốc hoặc góc bay sinh ra giá trị `NaN` tại thời điểm rời bệ
* **Hiện tượng:** Ngay khi bấm "Launch", độ cao nhảy thành `NaN` và tên lửa biến mất khỏi màn hình.
* **Nguyên nhân:** Tại thời điểm $t = 0$, vận tốc $v_x = 0$ và $v_z = 0$. Phép tính góc bay $\gamma = \arctan(v_z / v_x)$ hoặc chuẩn hóa véc-tơ $\frac{\mathbf{v}}{\|\mathbf{v}\|}$ bị chia cho $0$.
* **Cách phòng ngừa:**
  - Luôn kiểm tra điều kiện ngưỡng:
    ```javascript
    const speed = Math.hypot(vx, vz);
    const gamma = speed > 1e-3 ? Math.atan2(vz, vx) : Math.PI / 2.0; // Mặc định 90 độ khi đứng yên
    ```

### 🚨 Lỗi 05: Lỗi `body is not defined` trong component React (JSX Brace Gotcha)
* **Hiện tượng:** Cột trái `ConfigPanel` bị ErrorBoundary chặn lại và hiện dòng chữ đỏ: `body is not defined`.
* **Nguyên nhân gốc rễ:** Trong file `ConfigPanel.jsx`, nhãn tiêu đề viết theo định dạng LaTeX: `Chiều dài thân ($L_{body}$)`. Trong chuẩn JSX, cặp dấu ngoặc nhọn `{...}` được trình biên dịch hiểu là một biểu thức JavaScript. Do đó `{body}` bị xem như một biến JavaScript chưa được định nghĩa `body`, gây ra `ReferenceError: body is not defined`!
* **Cách phòng ngừa:** Trong JSX không viết ngoặc nhọn `{}` trần trong chuỗi text. Thay bằng ký hiệu an toàn: `(L_body)`, `(L_nose)`, `(t_burn)`.

### 🚨 Lỗi 06: Camera không theo tên lửa và animation bay quá nhanh
* **Hiện tượng:** Khi bấm "Phóng", tên lửa vọt lên biến mất khỏi màn hình và đồ thị nhảy vèo một cái đến điểm chạm đất.
* **Nguyên nhân:**
  1. `OrbitControls` có tâm ngắm cố định tại `[0, 1.5, 0]` ở bệ phóng, không tự động bám theo tọa độ $(x, y)$ của tên lửa.
  2. Vòng lặp phát lại cộng dồn chỉ số dữ liệu thô quá nhanh thay vì tính theo thời gian thực.
* **Cách khắc phục:**
  1. Thêm cơ chế **Smooth Camera Lerp**: Trong `useFrame()`, liên tục nội suy `controlsRef.current.target` và `state.camera.position` bám sát tọa độ tên lửa. Bổ sung nút bấm bật/tắt: `🎥 Camera: Bám Tên Lửa / Tự Do`.
  2. Bổ sung bộ điều tốc **Playback Speed (1x, 2x, 4x, 8x)**: Tại `1x`, 1 giây bay thực tế tương đương đúng 1 giây đời thực để người dùng xem rõ quá trình rời bệ, dập lửa và bung dù.

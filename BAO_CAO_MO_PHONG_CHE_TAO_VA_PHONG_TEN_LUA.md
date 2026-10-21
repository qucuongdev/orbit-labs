# TỔNG QUAN TOÀN DIỆN VỀ KIẾN THỨC VÀ CÔNG THỨC TOÁN - LÝ: MÔ PHỎNG, CHẾ TẠO VÀ PHÓNG TÊN LỬA (ROCKETRY HANDBOOK & SCIENTIFIC REPORT BLUEPRINT)

> **Tài liệu tham chiếu chuẩn khoa học kỹ thuật hàng không vũ trụ**  
> *Dành cho nghiên cứu, tính toán thiết kế, phân tích kết cấu - khí động học, mô phỏng số quỹ đạo 6-DOF và lập báo cáo khoa học theo chuẩn AIAA / IEEE.*

---

## MỤC LỤC TỔNG QUAN

1. [Ký hiệu và Danh pháp Vật lý (Nomenclature)](#1-k-hiu-v-danh-phap-vt-ly-nomenclature)
2. [Cơ sở Động lực học Đẩy và Động cơ Tên lửa (Propulsion Mechanics)](#2-c-s-ng-lc-hc-y-v-ng-c-ten-la-propulsion-mechanics)
   - 2.1. Phương trình Tsiolkovsky và phân tích tổn thất Delta-V
   - 2.2. Nhiệt động lực học buồng đốt và dòng khí qua loa phụt de Laval
   - 2.3. Động cơ nhiên liệu rắn (SRM - Solid Rocket Motor)
   - 2.4. Động cơ nhiên liệu lỏng (LRE) và chu trình cấp nhiên liệu
3. [Khí động học và Độ ổn định Tên lửa (Aerodynamics & Stability)](#3-khi-ng-hc-v-on-nh-ten-la-aerodynamics--stability)
   - 3.1. Mô hình khí quyển tiêu chuẩn (ISA / US Standard Atmosphere 1976)
   - 3.2. Lực cản khí động học (Drag) và các thành phần phân rã
   - 3.3. Phương pháp Barrowman: Xác định tâm áp suất khí động (Center of Pressure - CP)
   - 3.4. Trọng tâm (CG) và biên ổn định tĩnh (Static Margin)
   - 3.5. Phương pháp Mô phỏng Khí động học Số (CFD) và Mô hình Rối RANS
4. [Kết cấu, Cơ học Vật liệu và Kỹ thuật Chế tạo (Structures & Manufacturing)](#4-kt-cu-c-hc-vt-liu-v-k-thut-ch-to-structures--manufacturing)
   - 4.1. Phân tích tải trọng tác động (Load Cases & Max-Q)
   - 4.2. Ứng suất vỏ mỏng và bình chứa áp lực (Thin-Walled Pressure Vessels)
   - 4.3. Hiện tượng mất ổn định uốn vỏ mỏng (Shell Buckling - Tiêu chuẩn NASA SP-8007)
   - 4.4. Vật liệu chế tạo hàng không vũ trụ và công nghệ gia công
   - 4.5. Lý thuyết Netting trong cuốn sợi Composite bình COPV (Góc cuốn tối ưu 54.74°)
   - 4.6. Mô phỏng Phần tử Hữu hạn (FEA) và Tiêu chuẩn Bền Von Mises
   - 4.7. Phân tích Dao động Cấu trúc và Hiện tượng Cộng hưởng POGO
5. [Động lực học Bay và Mô phỏng Quỹ đạo 6 Bậc Tự do (6-DOF Flight Dynamics)](#5-ng-lc-hc-bay-v-mo-phng-qu-o-6-bc-t-do-6-dof-flight-dynamics)
   - 5.1. Các hệ quy chiếu không gian (ECI, ECEF, NED, Body, Wind)
   - 5.2. Chuyển đổi tọa độ: Ma trận Cosin chỉ hướng (DCM) và Quaternions
   - 5.3. Hệ phương trình vi phân chuyển động 6-DOF đầy đủ
   - 5.4. Các giai đoạn bay và điều khiển góc chúc ngẩng (Gravity Turn)
6. [Hệ thống Dẫn đường, Định vị và Điều khiển (GNC - Guidance, Navigation & Control)](#6-h-thng-dn-ng-nh-v-v-iu-khin-gnc)
   - 6.1. Định vị (Navigation) & Bộ lọc Kalman mở rộng (EKF)
   - 6.2. Dẫn đường (Guidance): Gravity Turn và Định luật Dẫn đường Tiếp tuyến PEG
   - 6.3. Điều khiển (Control): TVC, Canards, Reaction Control và Bộ điều khiển PID / LQR
7. [Cơ học Quỹ đạo và Đưa Vệ tinh vào Quỹ đạo (Orbital Mechanics & Insertion)](#7-c-hc-qu-o-v-a-v-tinh-vao-qu-o-orbital-mechanics--insertion)
   - 7.1. Bài toán hai vật thể và các tham số quỹ đạo Kepler (Classical Orbital Elements)
   - 7.2. Vận tốc quỹ đạo, năng lượng orbital và chuyển quỹ đạo Hohmann
8. [Mô phỏng Số và Thuật toán Tính toán (Numerical Simulation & Scientific Computing)](#8-mo-phng-s-v-thut-toan-tinh-toan-numerical-simulation--scientific-computing)
   - 8.1. Phương pháp tích phân số Runge-Kutta bậc 4 (RK4) thích ứng
   - 8.2. Phân tích phân tán Monte Carlo (Dispersion Analysis)
   - 8.3. Mã nguồn mô phỏng mẫu bằng Python (Full 3-DOF / 6-DOF Core Framework)
9. [Hệ thống Thu hồi (Recovery), Điện tử Hàng không (Avionics) và Phần mềm Mô phỏng](#9-h-thng-thu-hi-recovery-in-t-hang-khong-avionics-v-phn-mm-mo-phng)
   - 9.1. Động lực học bung dù và lực sốc mở dù (Parachute Opening Shock)
   - 9.2. Kiến trúc điện tử hàng không (Avionics) và mạch kích nổ E-Match
   - 9.3. Hệ sinh thái công cụ phần mềm mô phỏng chuyên dụng ngành hàng không vũ trụ
10. [Quy trình Thực nghiệm, Đốt Tĩnh và An toàn Bãi phóng (Testing & Range Safety)](#10-quy-trinh-thc-nghim-t-tnh-v-an-toan-bai-phong-testing--range-safety)
11. [Khung Đề cương Báo cáo Khoa học Hoàn chỉnh (AIAA/IEEE Scientific Paper Template)](#11-khung--cng-bao-cao-khoa-hc-hoan-chnh-aiaaieee-scientific-paper-template)
12. [Tài liệu Tham khảo Chuyên ngành Kinh điển (Classic Aerospace References)](#12-tai-liu-tham-khao-chuyen-nganh-kinh-in-classic-aerospace-references)

---

## 1. KÝ HIỆU VÀ DANH PHÁP VẬT LÝ (NOMENCLATURE)

| Ký hiệu | Ý nghĩa | Đơn vị SI |
| :--- | :--- | :--- |
| $m(t), m_0, m_f$ | Khối lượng tức thời, khối lượng cất cánh ban đầu, khối lượng cạn | $\text{kg}$ |
| $m_{dry}, m_p$ | Khối lượng cấu trúc khô, khối lượng thuốc phóng / nhiên liệu | $\text{kg}$ |
| $\dot{m}$ | Lưu lượng khối lượng tiêu hao ($-\frac{dm}{dt}$) | $\text{kg/s}$ |
| $F$ hoặc $T$ | Lực đẩy động cơ (Thrust) | $\text{N}$ |
| $I_{sp}$ | Xung lực riêng (Specific Impulse) | $\text{s}$ |
| $v_e, c$ | Vận tốc xả tại miệng loa, vận tốc xả hiệu dụng | $\text{m/s}$ |
| $p_c, T_c, \rho_c$ | Áp suất buồng đốt, nhiệt độ buồng đốt, mật độ khí cháy | $\text{Pa, K, kg/m}^3$ |
| $p_e, A_e, A_t$ | Áp suất miệng loa, diện tích miệng loa, diện tích mặt cắt họng | $\text{Pa, m}^2, \text{m}^2$ |
| $\gamma$ | Tỷ số nhiệt dung riêng ($C_p / C_v$) của khí cháy | Không thứ nguyên |
| $R_{spec}$ | Hằng số khí đặc trưng ($R_{spec} = R_u / M_w$) | $\text{J/(kg}\cdot\text{K)}$ |
| $M$ | Số Mach ($v / a$) | Không thứ nguyên |
| $q$ | Áp suất động ($q = \frac{1}{2}\rho v^2$) | $\text{Pa}$ |
| $C_D, C_L, C_{N\alpha}$ | Hệ số lực cản, hệ số lực nâng, đạo hàm lực pháp tuyến theo góc tấn | Không thứ nguyên |
| $X_{cg}, X_{cp}$ | Vị trí trọng tâm, vị trí tâm áp suất khí động (tính từ đỉnh mũi) | $\text{m}$ |
| $S_m$ | Biên độ ổn định tĩnh khí động (Static Margin) | $\text{Calibers}$ |
| $\mathbf{I}(t)$ | Tensor mô-men quán tính khối lượng của tên lửa | $\text{kg}\cdot\text{m}^2$ |
| $\boldsymbol{\omega}$ | Véc-tơ vận tốc góc thân tên lửa $[\omega_x, \omega_y, \omega_z]^T$ | $\text{rad/s}$ |
| $\mathbf{q}$ | Quaternion biểu diễn hướng góc thân $[q_0, q_1, q_2, q_3]^T$ | Không thứ nguyên |

---

## 2. CƠ SỞ ĐỘNG LỰC HỌC ĐẨY VÀ ĐỘNG CƠ TÊN LỬA (PROPULSION MECHANICS)

### 2.1. Phương trình Tsiolkovsky và Phân tích Tổn thất Vận tốc ($\Delta v$)

#### Phương trình Tsiolkovsky lý tưởng
Phương trình chuyển động cơ bản của hệ có khối lượng biến đổi (theo bảo toàn động lượng):

$$\Delta v_{ideal} = v_e \ln \left( \frac{m_0}{m_f} \right) = g_0 I_{sp} \ln \left( \frac{m_0}{m_f} \right)$$

Trong đó:
- $m_0 = m_{dry} + m_p + m_{payload}$
- $m_f = m_{dry} + m_{payload}$
- Tỷ số khối lượng (Mass Ratio): $R = \frac{m_0}{m_f}$
- Tỷ số khối lượng cấu trúc (Structural Coefficient): $\epsilon = \frac{m_{dry}}{m_{dry} + m_p}$
- Tỷ số tải trọng hữu ích (Payload Ratio): $\lambda = \frac{m_{payload}}{m_{dry} + m_p}$

#### Tên lửa đa tầng (Multi-stage Rocket)
Đối với tên lửa có $N$ tầng nối tiếp (Tandem staging):

$$\Delta v_{total} = \sum_{i=1}^N \Delta v_i = \sum_{i=1}^N g_0 I_{sp,i} \ln \left( \frac{m_{0,i}}{m_{f,i}} \right)$$

Khối lượng ban đầu của tầng thứ $i$ bao gồm khối lượng cấu trúc và nhiên liệu của tầng $i$ cộng với toàn bộ khối lượng các tầng phía trên ($i+1 \to N$):

$$m_{0,i} = m_{p,i} + m_{dry,i} + \sum_{k=i+1}^N (m_{p,k} + m_{dry,k}) + m_{payload}$$

$$m_{f,i} = m_{dry,i} + \sum_{k=i+1}^N (m_{p,k} + m_{dry,k}) + m_{payload}$$

#### Phương trình vi phân năng lượng và tổn thất thực tế
Vận tốc thực tế đạt được ở cuối quỹ đạo phóng chịu ảnh hưởng bởi các tổn thất:

$$\Delta v_{actual} = \Delta v_{ideal} - \Delta v_{grav} - \Delta v_{aero} - \Delta v_{steer}$$

Chi tiết các thành phần tổn thất:

1. **Tổn thất trọng trường (Gravity Loss):**
   $$\Delta v_{grav} = \int_0^{t_{burn}} g(h) \sin(\theta(t)) \, dt$$
   *(Với $\theta(t)$ là góc nghiêng quỹ đạo so với phương ngang. Bay thẳng đứng $\theta = 90^\circ$ tổn thất tối đa; chuyển sang bay ngang càng sớm thì $\Delta v_{grav}$ càng nhỏ).*

2. **Tổn thất khí động (Aerodynamic Drag Loss):**
   $$\Delta v_{aero} = \int_0^{t_{burn}} \frac{D(t)}{m(t)} \, dt = \int_0^{t_{burn}} \frac{\frac{1}{2}\rho(h) v^2(t) S_{ref} C_D(M)}{m(t)} \, dt$$

3. **Tổn thất lái / đổi hướng lực đẩy (Thrust Vector Steering Loss):**
   $$\Delta v_{steer} = \int_0^{t_{burn}} \frac{T(t)}{m(t)} [1 - \cos(\alpha(t))] \, dt$$
   *(Với $\alpha(t)$ là góc tấn công - Angle of Attack).*

---

### 2.2. Nhiệt động lực học Buồng đốt và Loa phụt Khí de Laval

#### Phương trình lực đẩy tổng quát (Thrust Equation)
Lực đẩy sinh ra từ biến thiên động lượng của dòng khí phụt và chênh lệch áp suất tại miệng loa:

$$F = \dot{m} v_e + (p_e - p_a) A_e$$

- Vận tốc xả hiệu dụng (Effective Exhaust Velocity):
  $$c_{eff} = v_e + \frac{(p_e - p_a) A_e}{\dot{m}}$$
- Xung lực riêng (Specific Impulse):
  $$I_{sp} = \frac{F}{\dot{m} g_0} = \frac{c_{eff}}{g_0}$$

#### Dòng khí đẳng entropy 1 chiều (1D Isentropic Flow) trong loa phụt de Laval
Giả thiết khí lý tưởng, dòng dừng đẳng entropy từ buồng đốt ($p_c, T_c, M \approx 0$) đến họng ($A_t, M=1$) và giãn nở ở loa ($A_e, M_e > 1$):

1. **Quan hệ tỷ số nén - nhiệt độ - mật độ theo Mach:**
   $$\frac{T_c}{T} = 1 + \frac{\gamma - 1}{2} M^2$$
   $$\frac{p_c}{p} = \left( 1 + \frac{\gamma - 1}{2} M^2 \right)^{\frac{\gamma}{\gamma - 1}}$$
   $$\frac{\rho_c}{\rho} = \left( 1 + \frac{\gamma - 1}{2} M^2 \right)^{\frac{1}{\gamma - 1}}$$

2. **Tại tiết diện họng (Throat, $M = 1$):**
   $$T^* = T_c \left( \frac{2}{\gamma + 1} \right)$$
   $$p^* = p_c \left( \frac{2}{\gamma + 1} \right)^{\frac{\gamma}{\gamma - 1}}$$
   $$\rho^* = \rho_c \left( \frac{2}{\gamma + 1} \right)^{\frac{1}{\gamma - 1}}$$

3. **Lưu lượng khối lượng tới hạn (Choked Mass Flow Rate):**
   $$\dot{m} = A_t \, p_c \sqrt{\frac{\gamma}{R_{spec} T_c}} \left( \frac{2}{\gamma + 1} \right)^{\frac{\gamma + 1}{2(\gamma - 1)}}$$

4. **Vận tốc xả lý thuyết tại miệng loa ($v_e$):**
   $$v_e = \sqrt{\frac{2\gamma}{\gamma - 1} R_{spec} T_c \left[ 1 - \left( \frac{p_e}{p_c} \right)^{\frac{\gamma - 1}{\gamma}} \right]}$$

5. **Tỷ số diện tích mở rộng (Expansion Area Ratio $\epsilon = A_e / A_t$):**
   $$\frac{A_e}{A_t} = \frac{1}{M_e} \left[ \frac{2}{\gamma + 1} \left( 1 + \frac{\gamma - 1}{2} M_e^2 \right) \right]^{\frac{\gamma + 1}{2(\gamma - 1)}}$$

6. **Các chỉ số hiệu năng chuẩn hóa:**
   - **Vận tốc đặc trưng (Characteristic Velocity $c^*$):** Thể hiện hiệu quả nhiệt và hóa học trong buồng đốt:
     $$c^* = \frac{p_c A_t}{\dot{m}} = \frac{\sqrt{R_{spec} T_c}}{\sqrt{\gamma} \left( \frac{2}{\gamma + 1} \right)^{\frac{\gamma + 1}{2(\gamma - 1)}}}$$
   - **Hệ số lực đẩy (Thrust Coefficient $C_F$):** Thể hiện hiệu quả giãn nở của loa:
     $$C_F = \frac{F}{p_c A_t} = \sqrt{\frac{2\gamma^2}{\gamma - 1} \left( \frac{2}{\gamma + 1} \right)^{\frac{\gamma + 1}{\gamma - 1}} \left[ 1 - \left( \frac{p_e}{p_c} \right)^{\frac{\gamma - 1}{\gamma}} \right]} + \frac{p_e - p_a}{p_c} \frac{A_e}{A_t}$$
   - Ta luôn có hệ thức liên hệ: $c_{eff} = c^* \cdot C_F$.

7. **Trạng thái làm việc của loa phụt:**
   - $p_e = p_a$: Giãn nở tối ưu (Optimal expansion) $\to C_F$ đạt cực đại.
   - $p_e < p_a$: Giãn nở quá mức (Over-expanded), sinh sóng kích kích ngược (oblique shocks), nguy cơ tách dòng (Flow Separation) theo tiêu chuẩn Summerfield ($p_{sep} \approx 0.35 \sim 0.40 \, p_a$).
   - $p_e > p_a$: Giãn nở thiếu (Under-expanded), khí tiếp tục giãn nở bên ngoài miệng loa.

---

### 2.3. Động cơ Nhiên liệu Rắn (Solid Rocket Motor - SRM)

#### Luật cháy Saint-Robert (Luật Vieille)
Tốc độ lùi bề mặt cháy ($r$) phụ thuộc vào áp suất tức thời trong buồng đốt:

$$r = a \cdot p_c^n$$

Trong đó:
- $a$: Hằng số tốc độ cháy phụ thuộc vào nhiệt độ hạt thuốc ban đầu ($T_{grain}$).
- $n$: Số mũ áp suất (Pressure exponent). Để động cơ vận hành ổn định an toàn, bắt buộc $n < 1.0$ (thông thường $0.2 \le n \le 0.6$). Nếu $n \ge 1.0$, phản hồi áp suất sẽ dẫn đến nổ buồng đốt.

#### Phương trình vi phân bảo toàn khối lượng buồng đốt SRM
Khối lượng khí sinh ra trừ đi khối lượng khí thoát qua họng bằng tốc độ tích tụ khối lượng khí tự do trong buồng đốt:

$$\rho_p A_b r - \frac{p_c A_t}{c^*} = \frac{d}{dt} (\rho_{gas} V_c) = \frac{V_c}{R_{spec} T_c} \frac{dp_c}{dt} + \rho_{gas} A_b r$$

Ở chế độ dừng cân bằng quasi-steady ($\frac{dp_c}{dt} \approx 0$, $V_c \gg 0$):

$$p_{c,eq} = \left( \rho_p \cdot a \cdot c^* \cdot \frac{A_b}{A_t} \right)^{\frac{1}{1 - n}} = \left( \rho_p \cdot a \cdot c^* \cdot K_n \right)^{\frac{1}{1 - n}}$$

Trong đó:
- $A_b$: Diện tích mặt cháy tức thời ($m^2$).
- $K_n = \frac{A_b}{A_t}$: Tỷ số diện tích Klemmung (Klemmung ratio).
- $\rho_p$: Khối lượng riêng của hạt thuốc phóng rắn ($\approx 1600 - 1800 \, \text{kg/m}^3$).

#### Hình học lõi cháy (Grain Geometries)
- **End-burning:** $A_b$ không đổi theo thời gian $\to$ Áp suất đều (Neutral burn), thời gian cháy dài, lực đẩy nhỏ.
- **Cylindrical core (lỗ tròn rỗng):** Bán kính $r(t)$ tăng dần $\to A_b(t)$ tăng dần $\to$ Cháy tăng tiến (Progressive burn).
- **Star grain (hình sao) / BATES grain:** Thiết kế trung hòa lực đẩy (Neutral thrust profile) hoặc phân đoạn boost-sustain.

---

### 2.4. Động cơ Nhiên liệu Lỏng (Liquid Rocket Engine - LRE)

#### Phương trình hòa trộn và tỷ số đương lượng
Tỷ lệ khối lượng chất oxy hóa trên nhiên liệu (Oxidizer-to-Fuel Ratio):

$$OF = \frac{\dot{m}_{ox}}{\dot{m}_{fuel}}$$

$$\dot{m}_{total} = \dot{m}_{ox} + \dot{m}_{fuel}$$

#### Chu trình động cơ (Engine Cycles)
1. **Pressure-Fed:** Dùng khí nén trơ (Helium) ở áp suất cao đẩy nhiên liệu trực tiếp vào buồng đốt. Kết cấu đơn giản, nhưng bình nhiên liệu phải dày $\to$ khối lượng cấu trúc lớn.
2. **Gas-Generator Cycle:** Một phần dòng $LOX/RP-1$ hoặc $LOX/CH_4$ được đốt trong buồng sinh khí để quay Turbopump, khí xả được thổi ra ngoài qua ống phụ.
3. **Staged Combustion (Đốt theo tầng khép kín):** Toàn bộ lưu lượng một chất phản ứng đi qua buồng tiền đốt (Preburner) giàu oxy hóa hoặc giàu nhiên liệu để chạy tuabin, sau đó toàn bộ khí xả tuabin được bơm thẳng vào buồng đốt chính. Hiệu suất cực đại, áp suất buồng đốt đạt $> 200 - 300 \, \text{bar}$ (ví dụ: RD-180, SpaceX Raptor).
4. **Expander Cycle:** Nhiên liệu cryogenic ($LH_2$ hoặc $LCH_4$) đi qua áo làm mát buồng đốt, nhận nhiệt hóa hơi và giãn nở để sinh công quay tuabin trước khi phun vào buồng đốt chính.

#### Phương trình truyền nhiệt làm mát tái sinh (Regenerative Cooling)
Nhiệt thông lượng từ khí cháy vào vách kim loại buồng đốt:

$$\dot{q}'' = h_g (T_{aw} - T_{wg}) = \frac{k_{wall}}{t_w} (T_{wg} - T_{wc}) = h_{cool} (T_{wc} - T_{cool})$$

- Hệ số truyền nhiệt khí nóng $h_g$ tính theo công thức thực nghiệm kinh điển Bartz:
  $$h_g = \left[ \frac{0.026}{D_t^{0.2}} \left( \frac{\mu^{0.2} C_p}{Pr^{0.6}} \right)_c \left( \frac{p_c}{c^*} \right)^{0.8} \left( \frac{D_t}{R_{curv}} \right)^{0.1} \right] \left( \frac{A_t}{A} \right)^{0.9} \sigma$$
  Trong đó $\sigma$ là hệ số hiệu chỉnh nhiệt độ lớp biên.

---

## 3. KHÍ ĐỘNG HỌC VÀ ĐỘ ỔN ĐỊNH TÊN LỬA (AERODYNAMICS & STABILITY)

### 3.1. Mô hình Khí quyển Tiêu chuẩn (US Standard Atmosphere 1976 / ISA)

Tên lửa bay qua các tầng khí quyển có nhiệt độ, áp suất và mật độ thay đổi liên tục:

#### Phương trình cân bằng thủy tĩnh và khí lý tưởng
$$\frac{dp}{dh} = -\rho(h) \cdot g(h)$$

$$p(h) = \rho(h) R_{air} T(h)$$

#### Tầng đối lưu (Troposphere: $h \le 11\,000 \, \text{m}$)
- Độ dốc nhiệt độ (Lapse rate): $\lambda = -0.0065 \, \text{K/m}$
- Nhiệt độ: $T(h) = T_0 + \lambda h$ ($T_0 = 288.15 \, \text{K}$)
- Áp suất:
  $$p(h) = p_0 \left( \frac{T(h)}{T_0} \right)^{-\frac{g_0}{\lambda R_{air}}} \quad (p_0 = 101\,325 \, \text{Pa})$$
- Mật độ không khí:
  $$\rho(h) = \frac{p(h)}{R_{air} T(h)} \quad (R_{air} = 287.05287 \, \text{J/(kg}\cdot\text{K)})$$
- Tốc độ âm thanh cục bộ:
  $$a(h) = \sqrt{\gamma_{air} R_{air} T(h)} \quad (\gamma_{air} = 1.4)$$

#### Tầng bình lưu dưới (Stratosphere: $11\,000 \, \text{m} < h \le 20\,000 \, \text{m}$)
- Nhiệt độ đẳng nhiệt: $T(h) = T_{11} = 216.65 \, \text{K}$
- Áp suất:
  $$p(h) = p_{11} \exp \left( -\frac{g_0 (h - 11000)}{R_{air} T_{11}} \right)$$

---

### 3.2. Lực Cản Khí động học (Aerodynamic Drag) và Phân rã $C_D$

Áp suất động của dòng khí (Dynamic Pressure):

$$q(t) = \frac{1}{2} \rho(h) v^2(t)$$

Lực cản tổng:

$$D = q \cdot S_{ref} \cdot C_D(M, \alpha)$$

Trong đó $S_{ref} = \frac{\pi d_{body}^2}{4}$ là diện tích cản tham chiếu quy ước theo đường kính thân tên lửa.

#### Phân rã hệ số cản tổng ($C_{D,total}$)
$$C_D = C_{D,friction} + C_{D,pressure} + C_{D,base} + C_{D,wave}$$

1. **Lực cản ma sát mặt ngoài (Skin Friction Drag $C_{D,friction}$):**
   Phụ thuộc vào số Reynolds $Re = \frac{\rho v L_{rocket}}{\mu}$.
   - Dòng chảy tầng (Laminar boundary layer): $C_f \approx \frac{1.328}{\sqrt{Re}}$
   - Dòng chảy rối (Turbulent boundary layer): $C_f \approx \frac{0.455}{(\log_{10} Re)^{2.58} (1 + 0.144 M^2)^{0.65}}$
   - $C_{D,friction} = C_f \cdot \frac{S_{wet}}{S_{ref}}$ (với $S_{wet}$ là tổng diện tích ướt bề mặt tiếp xúc không khí).

2. **Lực cản đáy (Base Drag $C_{D,base}$):**
   Do vùng áp suất thấp xoáy cuộn phía sau đuôi tên lửa tạo ra:
   - Cận âm ($M < 1$): $C_{D,base} \approx 0.12 + 0.13 M^2 \left( \frac{d_{base}}{d_{ref}} \right)^2$
   - Siêu âm ($M > 1$): $C_{D,base} \approx \frac{0.25}{M} \left( \frac{d_{base}}{d_{ref}} \right)^2$
   *(Khi động cơ đang hoạt động, hiệu ứng xả phản lực - plume - triệt tiêu một phần base drag).*

3. **Lực cản sóng va đập (Wave Drag $C_{D,wave}$ ở vùng $M \ge 0.8$):**
   Xuất hiện do sóng xung kích khi vượt tường âm thanh (Transonic & Supersonic). Đạt đỉnh nhọn tại $M \approx 1.05 - 1.2$, sau đó giảm dần tỉ lệ thuận với $1 / \sqrt{M^2 - 1}$.

---

### 3.3. Phương pháp Barrowman Xác định Tâm Áp Suất Khí Động ($X_{cp}$)

Phương pháp Barrowman (1966) là chuẩn mực tính toán vị trí tâm áp suất khí động ($X_{cp}$) cho tên lửa đối xứng trục ở góc tấn nhỏ ($\alpha \le 10^\circ$).

Tâm áp suất tổng thể được tính bằng công thức bình quân gia quyền theo hệ số lực pháp tuyến:

$$X_{cp} = \frac{\sum_{i} (C_{N\alpha})_i \cdot X_i}{\sum_{i} (C_{N\alpha})_i}$$

Với mỗi bộ phận $i$, $(C_{N\alpha})_i = \left. \frac{\partial C_N}{\partial \alpha} \right|_{\alpha=0}$ là đạo hàm hệ số lực pháp tuyến và $X_i$ là vị trí tâm áp suất riêng phần đo từ chóp mũi.

#### 1. Mũi tên lửa (Nose Cone)
- Chiều dài mũi $L_n$, đường kính đáy mũi $d$:
  $$(C_{N\alpha})_n = 2.0$$
- Vị trí tâm áp suất $X_n$:
  - Hình chóp nón (Conical): $X_n = \frac{2}{3} L_n$
  - Hình Ogive tròn (Tangent Ogive): $X_n = 0.466 L_n$
  - Hình Parabol: $X_n = 0.500 L_n$
  - Hình Von Kármán / Haack series: $X_n = 0.437 L_n$

#### 2. Phần chuyển tiếp đường kính (Conical Transition / Boattail)
- Đường kính đầu vào $d_1$, đường kính đầu ra $d_2$, chiều dài đoạn chuyển $L_{tr}$, vị trí bắt đầu đoạn $x_{tr}$:
  $$(C_{N\alpha})_{tr} = 2 \left[ \left( \frac{d_2}{d} \right)^2 - \left( \frac{d_1}{d} \right)^2 \right]$$
  $$X_{tr} = x_{tr} + \frac{L_{tr}}{3} \left[ 1 + \frac{1 - \frac{d_1}{d_2}}{1 - \left( \frac{d_1}{d_2} \right)^2} \right]$$

#### 3. Bộ cánh đuôi (Fins Set - gồm $N$ cánh phẳng)
Gọi:
- $N$: Số cánh (thường là 3 hoặc 4).
- $C_r$: Dây cánh gốc (Root chord).
- $C_t$: Dây cánh đỉnh (Tip chord).
- $s$: Sải cánh bán phần (Span - chiều cao cánh tính từ thân ra mút).
- $\Gamma$: Chiều dài mép trước quét về sau (Sweep length).
- $d_f$: Đường kính thân tại vị trí gắn cánh.
- $X_b$: Khoảng cách từ đỉnh mũi đến mép trước gốc cánh.

Hệ số lực pháp tuyến của riêng các cánh:
$$(C_{N\alpha})_{fins} = \frac{K_{fb} \cdot \frac{4 N \left(\frac{s}{d}\right)^2}{1 + \sqrt{1 + \left( \frac{2 L_{mid}}{C_r + C_t} \right)^2}}}$$

Trong đó:
- Chiều dài đường nối trung điểm dây cánh: $L_{mid} = \sqrt{\left( \Gamma + \frac{C_t - C_r}{2} \right)^2 + s^2}$
- Hệ số tương tác khí động giữa thân và cánh (Fin-Body Interference Factor):
  $$K_{fb} = 1 + \frac{\frac{d_f}{2}}{s + \frac{d_f}{2}} = 1 + \frac{R_f}{s + R_f}$$
- Tâm áp suất của cụm cánh $X_{fins}$:
  $$X_{fins} = X_b + \frac{\Gamma}{3} \frac{C_r + 2 C_t}{C_r + C_t} + \frac{1}{6} \left[ (C_r + C_t) - \frac{C_r C_t}{C_r + C_t} \right]$$

---

### 3.4. Trọng tâm (CG) và Biên Ổn định Tĩnh (Static Margin)

#### Tọa độ trọng tâm (Center of Gravity - $X_{cg}$)
Khối lượng tên lửa thay đổi liên tục khi động cơ đốt nhiên liệu:

$$X_{cg}(t) = \frac{\sum_j m_j \cdot x_j + m_p(t) \cdot x_p}{\sum_j m_j + m_p(t)} = \frac{\int_0^L x \cdot \rho_{lin}(x, t) \, dx}{m(t)}$$

Khi thuốc phóng cháy hết, trọng tâm tên lửa thường dịch chuyển lên phía trên (hoặc xuống tùy cấu hình bố trí bình oxy hóa/nhiên liệu).

#### Biên độ ổn định tĩnh khí động (Static Margin - $S_m$)
Biên ổn định tĩnh là khoảng cách không thứ nguyên giữa tâm áp suất ($X_{cp}$) và trọng tâm ($X_{cg}$), quy chuẩn theo đường kính thân lớn nhất ($d_{ref}$):

$$S_m(t) = \frac{X_{cp}(t) - X_{cg}(t)}{d_{ref}}$$

```
               Mũi                                                Đuôi
                |=========|================|=======================|
     Đầu mũi -> 0 -------> CG ----------> CP --------------------> L
                           \______  ______/
                                  \/
                      Biên ổn định: X_cp > X_cg
```

**Quy tắc an toàn động học:**
- $S_m > 0$ ($X_{cp}$ nằm sau $X_{cg}$): Tên lửa có độ ổn định tĩnh tự nhiên (khi có góc lệch $\alpha$, mô-men khí động tạo xu hướng đưa tên lửa quay về hướng vận tốc gió tới).
- **Phạm vi chuẩn thiết kế:**
  $$1.0 \le S_m \le 2.5 \quad [\text{Calibers}]$$
- Nếu $S_m < 1.0$: Tên lửa kém ổn định, dễ bị lật nhào dưới tác động của nhiễu loạn gió.
- Nếu $S_m > 3.0$: Hiện tượng quá ổn định (Over-stable) $\to$ Tên lửa phản ứng quá nhạy với gió ngang (Weather-cocking), tự động bẻ lái đâm ngang vào luồng gió thổi thay vì bay thẳng lên.

---

### 3.5. Phương pháp Mô phỏng Khí động học Số (CFD) và Mô hình Rối RANS

Đối với tên lửa bay ở dải vận tốc rộng từ cận âm ($M < 0.8$), xuyên âm ($0.8 \le M \le 1.2$) đến siêu âm cao ($M > 3$), phương pháp bán thực nghiệm Barrowman không còn nắm bắt được hiện tượng sóng xung kích chéo (Oblique shocks), tương tác sóng xung kích - lớp biên (Shock wave / Boundary layer interaction) và vùng bóc tách xoáy phía sau đuôi. Phương pháp mô phỏng số động lực học lưu chất (CFD) giải hệ phương trình Navier-Stokes trung bình Reynolds (RANS) là bắt buộc.

#### 1. Hệ phương trình RANS khả nén (Compressible RANS Equations)
- **Phương trình liên tục:**
  $$\frac{\partial \bar{\rho}}{\partial t} + \frac{\partial}{\partial x_j} (\bar{\rho} \tilde{u}_j) = 0$$
- **Phương trình động lượng:**
  $$\frac{\partial (\bar{\rho} \tilde{u}_i)}{\partial t} + \frac{\partial (\bar{\rho} \tilde{u}_i \tilde{u}_j)}{\partial x_j} = -\frac{\partial \bar{p}}{\partial x_i} + \frac{\partial}{\partial x_j} \left[ \bar{\tau}_{ij} - \overline{\rho u_i'' u_j''} \right]$$
  Trong đó ứng suất Reynolds $\tau_{ij}^R = -\overline{\rho u_i'' u_j''}$ được đóng kín theo giả thuyết Boussinesq:
  $$\tau_{ij}^R = 2 \mu_t \left( \tilde{S}_{ij} - \frac{1}{3} \tilde{S}_{kk} \delta_{ij} \right) - \frac{2}{3} \bar{\rho} k \delta_{ij}$$

#### 2. Mô hình rối 2 phương trình $k-\omega$ SST (Shear Stress Transport) của Menter
Mô hình chuẩn vàng trong khí động học tên lửa, kết hợp ưu điểm của $k-\omega$ ở sát thành vách (nắm bắt chính xác gradient áp suất nghịch và tách dòng) và $k-\epsilon$ ở dòng tự do xa thành:

$$\frac{\partial (\rho k)}{\partial t} + \frac{\partial (\rho u_j k)}{\partial x_j} = P_k - \beta^* \rho k \omega + \frac{\partial}{\partial x_j} \left[ (\mu + \sigma_k \mu_t) \frac{\partial k}{\partial x_j} \right]$$

$$\frac{\partial (\rho \omega)}{\partial t} + \frac{\partial (\rho u_j \omega)}{\partial x_j} = \frac{\gamma}{\nu_t} P_k - \beta \rho \omega^2 + \frac{\partial}{\partial x_j} \left[ (\mu + \sigma_\omega \mu_t) \frac{\partial \omega}{\partial x_j} \right] + 2 (1 - F_1) \frac{\rho \sigma_{\omega2}}{\omega} \frac{\partial k}{\partial x_j} \frac{\partial \omega}{\partial x_j}$$

- Độ nhớt xoáy rối (Eddy Viscosity):
  $$\mu_t = \frac{\rho a_1 k}{\max(a_1 \omega, \Omega F_2)}$$

#### 3. Tiêu chuẩn chia lưới lớp biên và khoảng cách lớp đầu tiên ($y^+$)
Để giải trực tiếp lớp biên dưới nhớt (Viscous sublayer) mà không dùng hàm vách (Wall functions), giá trị khoảng cách không thứ nguyên $y^+$ tại lớp lưới đầu tiên tiếp xúc bề mặt thân và cánh tên lửa phải thỏa mãn:

$$y^+ = \frac{u_\tau \cdot y_1}{\nu} \le 1.0$$

Công thức tính chiều cao lớp lưới đầu tiên $y_1$:
1. Tính hệ số ma sát bề mặt tấm phẳng: $C_f = [2 \log_{10}(Re_L) - 0.65]^{-2.3}$
2. Ứng suất cắt tại thành vách: $\tau_w = \frac{1}{2} C_f \rho_\infty v_\infty^2$
3. Vận tốc ma sát (Friction velocity): $u_\tau = \sqrt{\frac{\tau_w}{\rho_\infty}}$
4. Bề dày lớp thứ nhất:
   $$y_1 = \frac{y^+ \cdot \mu}{\rho_\infty \cdot u_\tau}$$

---

## 4. KẾT CẤU, CƠ HỌC VẬT LIỆU VÀ KỸ THUẬT CHẾ TẠO (STRUCTURES & MANUFACTURING)

### 4.1. Phân tích Tải trọng Thiết kế và Điểm Max-Q

Trong suốt hành trình bay, tên lửa chịu các tổ hợp tải trọng khắc nghiệt nhất:

1. **Tải trọng gia tốc tịnh tiến:**
   $$F_{axial} = m(t) \cdot [a(t) + g_0 \cos \theta]$$
   Hệ số tải trọng (Load factor): $n_z = \frac{a_z + g_0}{g_0}$ (thường từ $3g$ đến $8g$).

2. **Áp suất động cực đại (Maximum Dynamic Pressure - Max-Q):**
   Xảy ra tại thời điểm tích số $\rho(h) v^2(t)$ đạt cực trị:
   $$\left. \frac{dq}{dt} \right|_{t=t_{MaxQ}} = \frac{1}{2} \left( \dot{\rho} v^2 + 2 \rho v \dot{v} \right) = 0 \iff v \frac{d\rho}{dh} \dot{h} + 2 \rho \dot{v} = 0$$
   Tại điểm này, tải trọng khí động bẻ uốn và nén ép lên thân tên lửa đạt đỉnh cao nhất.

3. **Mô-men uốn do góc tấn gió giật ($Q\alpha$):**
   $$M_{bend}(x) = \int_x^L q \cdot C_{N\alpha}(x') \cdot \alpha \cdot (x' - x) \, dx'$$
   Chỉ số $Q\alpha = q \cdot \alpha$ là thông số kiểm soát giới hạn ứng suất uốn của tên lửa.

---

### 4.2. Ứng suất Vỏ Mỏng và Bình Chứa Áp lực (Thin-Walled Pressure Vessels)

Bình chứa nhiên liệu và buồng đốt được mô hình hóa theo lý thuyết vỏ mỏng ($t \ll r$, tỷ lệ bán kính trên bề dày $r/t > 10$):

#### Bình hình trụ tròn chịu áp suất trong $p_{int}$
- **Ứng suất tiếp tuyến / Ứng suất vòng (Hoop Stress):**
  $$\sigma_h = \frac{p_{int} \cdot r}{t}$$
- **Ứng suất dọc trục do áp suất (Longitudinal Stress):**
  $$\sigma_{l,p} = \frac{p_{int} \cdot r}{2t}$$
- **Ứng suất dọc trục tổng cộng (kết hợp lực nén gia tốc $P_{axial}$ và mô-men uốn $M$):**
  $$\sigma_{l,total} = \frac{p_{int} \cdot r}{2t} - \frac{P_{axial}}{2 \pi r t} \pm \frac{M \cdot r}{I_{area}} = \frac{p_{int} \cdot r}{2t} - \frac{P_{axial}}{2 \pi r t} \pm \frac{M}{\pi r^2 t}$$

#### Bề dày thiết kế an toàn
Theo tiêu chuẩn hệ số an toàn hàng không vũ trụ ($SF = 1.25 \sim 1.5$):

$$t_{req} = \frac{p_{burst} \cdot r}{\sigma_{yield}} = SF \cdot \frac{p_{work} \cdot r}{\sigma_{yield}}$$

---

### 4.3. Hiện tượng Mất Ổn định Uốn Vỏ Mỏng (Thin-Shell Compressive Buckling)

Dưới tác động của lực nén dọc trục và mô-men uốn do gia tốc và gió giật, vỏ tên lửa có nguy cơ sụp đổ đàn hồi trước khi kim loại đạt tới giới hạn chảy.

Theo tiêu chuẩn thiết kế cấu trúc vũ trụ **NASA SP-8007**:

Ứng suất nén giới hạn gây mất ổn định uốn vỏ trụ tròn:

$$\sigma_{crit} = \gamma_{buckle} \cdot \frac{E}{\sqrt{3(1 - \nu^2)}} \frac{t}{r}$$

Trong đó:
- $E$: Mô-đun đàn hồi Young của vật liệu ($\text{Pa}$).
- $\nu$: Hệ số Poisson ($\approx 0.33$ với nhôm, $0.28$ với thép).
- $\gamma_{buckle}$: Hệ số hiệu chỉnh thực nghiệm NASA (Knockdown factor) do sai số hình học chế tạo:
  $$\gamma_{buckle} = 1 - 0.901 \left( 1 - e^{-\frac{1}{16}\sqrt{\frac{r}{t}}} \right)$$

Nếu có áp suất trong hỗ trợ (Internal pressure stabilization $p_{int}$):

$$\sigma_{crit,pressurized} = \sigma_{crit} + \Delta \sigma_{p}$$

$$\Delta \sigma_p = \left[ 0.19 + 0.81 \left( \frac{p_{int}}{E} \right) \left( \frac{r}{t} \right)^2 \right] \cdot \left( \frac{p_{int} \cdot r}{t} \right)$$

---

### 4.4. Vật liệu Chế tạo Hàng không Vũ trụ và Công nghệ Gia công

| Bộ phận | Vật liệu tiêu chuẩn | Ưu điểm cơ lý tính | Phương pháp chế tạo |
| :--- | :--- | :--- | :--- |
| **Bình chứa Cryogenic** | Al-Li 2195, Thép 304L/301 | Mật độ thấp, dẻo dai ở nhiệt độ âm sâu ($-183^\circ\text{C}$) | Hàn ma sát xoay (FSW), uốn lốc cuốn mép |
| **Bình khí nén COPV** | Lõi Nhôm 6061 bọc sợi Carbon T800 | Chịu áp lực cực cao ($300 - 500 \, \text{bar}$), siêu nhẹ | Quấn sợi filament (Filament winding) |
| **Buồng đốt / Loa phụt** | Đồng hợp kim CuCrZr, Inconel 718 | Dẫn nhiệt cao, chịu nhiệt và chống rão ở $3000\,\text{K}$ | In 3D kim loại (DMLS/SLM) kết hợp phay CNC rãnh làm mát |
| **Cánh đuôi / Chóp bảo vệ** | Sợi Carbon Prepreg, Composite Phenolic | Kháng cắt, chịu lực uốn, chịu sốc nhiệt | Đóng rắn lò hấp Autoclave, gia công hút chân không |
| **Lớp bảo vệ nhiệt (TPS)** | Cork phenolic, PICA-X, Gốm Zirconia | Hệ số dẫn nhiệt siêu nhỏ ($k < 0.1\,\text{W/m}\cdot\text{K}$) | Dán nhiệt chịu co giãn, phun plasma nhiệt |

---

### 4.5. Lý thuyết Netting trong Chế tạo Cuốn Sợi Composite Bình COPV (Góc cuốn tối ưu $54.74^\circ$)

Bình áp lực composite quấn sợi kim loại lót trong (Composite Overwrapped Pressure Vessel - COPV) là công nghệ lưu trữ khí nén Helium/Nitơ ở áp suất $300 - 500 \, \text{bar}$ với tỷ số độ bền trên khối lượng cao nhất.

Theo lý thuyết mạng sợi chịu lực (Netting Theory), ma trận nhựa resin chỉ đóng vai trò truyền lực cắt và giữ kín khí, toàn bộ tải trọng áp suất do các bó sợi carbon liên tục gánh chịu.

1. **Lực màng tác dụng lên thành bình trụ:**
   - Lực màng theo chu vi (Hoop load): $N_\theta = p \cdot r = \sigma_f \cdot t_f \cdot \sin^2 \alpha$
   - Lực màng theo phương dọc trục (Axial load): $N_x = \frac{p \cdot r}{2} = \sigma_f \cdot t_f \cdot \cos^2 \alpha$
2. **Tỷ số cân bằng ứng suất:**
   $$\frac{N_\theta}{N_x} = \frac{\sin^2 \alpha}{\cos^2 \alpha} = \tan^2 \alpha = \frac{p \cdot r}{\frac{p \cdot r}{2}} = 2$$
3. **Góc quấn sợi tối ưu (Optimal Helical Winding Angle):**
   $$\tan \alpha = \sqrt{2} \implies \alpha = 54.7356^\circ \approx 54.74^\circ$$
   *(Nếu góc quấn nhỏ hơn $54.74^\circ$, bình sẽ bị nổ xé toạc theo đường sinh chu vi; nếu góc quấn lớn hơn $54.74^\circ$, bình sẽ bị kéo đứt văng nắp chỏm cầu).*

---

### 4.6. Mô phỏng Phần tử Hữu hạn (FEA) và Tiêu chuẩn Bền Von Mises

Khi tính toán thiết kế chi tiết trên phần mềm CAE/FEA (ANSYS Mechanical, Abaqus, Nastran), miền hình học được rời rạc hóa thành lưới phần tử (Solid 3D, Shell 2D).

#### 1. Phương trình cân bằng tĩnh phần tử hữu hạn
$$[K] \{u\} = \{F_{ext}\}$$

Trong đó $[K] = \sum_e \int_{V_e} [B]^T [D] [B] \, dV$ là ma trận độ cứng tổng thể của toàn bộ khung thân tên lửa, $\{u\}$ là véc-tơ chuyển vị các nút, $\{F_{ext}\}$ là tổ hợp tải trọng khí động $Max-Q$ và lực đẩy động cơ.

#### 2. Tiêu chuẩn chảy dẻo Von Mises (Von Mises Yield Criterion)
Đối với vật liệu đẳng hướng dẻo (Hợp kim Nhôm-Liti, Thép không gỉ), trạng thái ứng suất 3 chiều tại mỗi điểm nút được quy về ứng suất tương đương:

$$\sigma_v = \sqrt{\frac{1}{2} \left[ (\sigma_{xx} - \sigma_{yy})^2 + (\sigma_{yy} - \sigma_{zz})^2 + (\sigma_{zz} - \sigma_{xx})^2 + 6(\tau_{xy}^2 + \tau_{yz}^2 + \tau_{zx}^2) \right]}$$

Điều kiện an toàn kết cấu:

$$\sigma_v \le \frac{\sigma_{yield}}{SF} \quad (\text{với } SF \ge 1.25 \sim 1.5)$$

#### 3. Mô phỏng liên hợp Nhiệt - Cơ (Thermo-Mechanical Coupling)
Vách buồng đốt động cơ chịu gradien nhiệt cực lớn từ $3000\,\text{K}$ (khí cháy) xuống $100\,\text{K}$ (nhiên liệu lỏng làm mát). Biến dạng nhiệt gây ứng suất nhiệt cưỡng bức:

$$\{\varepsilon_{total}\} = \{\varepsilon_{elastic}\} + \{\varepsilon_{thermal}\} = [D]^{-1}\{\sigma\} + \alpha_{CTE} (T - T_{ref}) [1, 1, 1, 0, 0, 0]^T$$

---

### 4.7. Phân tích Dao động Cấu trúc và Hiện tượng Cộng hưởng POGO

#### 1. Bài toán dao động riêng (Modal Analysis)
Phương trình chuyển động tự do không cản của toàn bộ tên lửa:

$$[M] \{\ddot{u}\} + [K] \{u\} = \{0\}$$

Giải bài toán tìm giá trị riêng và véc-tơ riêng:

$$\det \left( [K] - \omega_n^2 [M] \right) = 0$$

Xuất ra các tần số dao động tự nhiên $f_n = \frac{\omega_n}{2\pi} \, \text{(Hz)}$ và các dạng mode uốn (Bending modes), mode dọc trục (Longitudinal modes), mode xoắn (Torsional modes).

#### 2. Hiện tượng cộng hưởng POGO (Pogo Instability)
Đây là thảm họa dao động tự kích nguy hiểm nhất trong tên lửa đẩy nhiên liệu lỏng (từng làm hỏng động cơ tên lửa Apollo-Saturn V và Ariane):

$$\begin{matrix}
\text{Dao động uốn/dọc thân} \xrightarrow{g_z(t)} & \text{Dao động áp suất cột chất lỏng trong đường ống} \\
\uparrow & \downarrow \\
\text{Kích động rung giật thân tên lửa} \xleftarrow{\Delta T(t)} & \text{Thay đổi lưu lượng và lực đẩy buồng đốt}
\end{matrix}$$

**Giải pháp kỹ thuật:** Thiết kế bình triệt xung thủy lực (Pogo Accumulator tích áp khí Heli) ngay trước cửa vào bơm Turbopump của đường ống oxy lỏng để giảm vận tốc sóng áp suất âm, đưa tần số riêng thủy lực thấp hơn nhiều so với tần số cấu trúc thân tên lửa: $f_{fluid} \ll f_{structural, 1st}$.

---

## 5. ĐỘNG LỰC HỌC BAY VÀ MÔ PHỎNG QUỸ ĐẠO 6 BẬC TỰ DO (6-DOF FLIGHT DYNAMICS)

### 5.1. Các Hệ Quy Chiếu Không Gian (Coordinate Frames)

```
        ECI (Gốc tâm Trái Đất, cố định trong không gian quán tính)
         |
         v
        ECEF (Gốc tâm Trái Đất, quay đồng bộ theo trục Trái Đất)
         |
         v
        NED (Hệ tọa độ phẳng địa phương: Bắc - Đông - Hướng xuống)
         |
         v
        BODY Frame (Gốc tại CG tên lửa, trục X dọc thân hướng lên đỉnh)
         |
         v
        WIND Frame (Trục X trùng hướng véc-tơ vận tốc tương đối v_rel)
```

1. **ECI ($I$ - Earth-Centered Inertial):** Gốc tại tâm Trái Đất, trục $Z$ hướng theo trục quay Bắc địa lý, trục $X$ hướng về điểm Xuân phân (Vernal Equinox). Dùng để tính toán quỹ đạo orbital và định luật Newton.
2. **ECEF ($E$ - Earth-Centered Earth-Fixed):** Quay cùng Trái Đất với tốc độ góc $\boldsymbol{\omega}_E = [0, 0, 7.292115 \times 10^{-5}]^T \, \text{rad/s}$.
3. **NED ($N$ - North-East-Down):** Tọa độ địa phương bệ phóng.
4. **Body Frame ($B$):** Gốc tại tâm khối lượng $CG(t)$. Trục $X_B$ trùng trục dọc thân (dương về phía mũi tên lửa), $Y_B$ hướng sang mạn phải, $Z_B$ hướng xuống đáy để tạo tam diện thuận.
5. **Wind Frame ($W$):** Trục $X_W$ hướng song song cùng chiều với véc-tơ vận tốc dòng khí tương đối $\mathbf{v}_{rel}$. Góc giữa Body và Wind định nghĩa góc tấn $\alpha$ (Angle of Attack) và góc trượt $\beta$ (Sideslip Angle).

---

### 5.2. Chuyển đổi Tọa độ: Quaternions Tránh Hiện Tượng Khóa Khớp (Gimbal Lock)

Góc Euler $(\phi, \theta, \psi)$ gặp kỳ dị toán học tại $\theta = \pm 90^\circ$ (bay thẳng đứng). Để mô phỏng số liên tục và chính xác tuyệt đối, toàn bộ hệ xoay được tham số hóa bằng Quaternion:

$$\mathbf{q} = \begin{bmatrix} q_0 \\ q_1 \\ q_2 \\ q_3 \end{bmatrix} = \begin{bmatrix} \cos(\theta_e / 2) \\ \mathbf{e} \sin(\theta_e / 2) \end{bmatrix}$$

Thỏa mãn điều kiện chuẩn hóa: $\|\mathbf{q}\| = q_0^2 + q_1^2 + q_2^2 + q_3^2 = 1$.

#### Ma trận chuyển đổi Cosin chỉ hướng (DCM: Body $\to$ Navigation)
$$\mathbf{C}_B^N(\mathbf{q}) = \begin{bmatrix}
q_0^2 + q_1^2 - q_2^2 - q_3^2 & 2(q_1 q_2 - q_0 q_3) & 2(q_1 q_3 + q_0 q_2) \\
2(q_1 q_2 + q_0 q_3) & q_0^2 - q_1^2 + q_2^2 - q_3^2 & 2(q_2 q_3 - q_0 q_1) \\
2(q_1 q_3 - q_0 q_2) & 2(q_2 q_3 + q_0 q_1) & q_0^2 - q_1^2 - q_2^2 + q_3^2
\end{bmatrix}$$

#### Phương trình vi phân động học Quaternion
Biến thiên của Quaternion theo vận tốc góc đo trong hệ Body $\boldsymbol{\omega}_B = [p, q, r]^T$:

$$\begin{bmatrix} \dot{q}_0 \\ \dot{q}_1 \\ \dot{q}_2 \\ \dot{q}_3 \end{bmatrix} = \frac{1}{2} \begin{bmatrix}
0 & -p & -q & -r \\
p & 0 & r & -q \\
q & -r & 0 & p \\
r & q & -p & 0
\end{bmatrix} \begin{bmatrix} q_0 \\ q_1 \\ q_2 \\ q_3 \end{bmatrix} = \frac{1}{2} \boldsymbol{\Omega}(\boldsymbol{\omega}_B) \mathbf{q}$$

---

### 5.3. Hệ Phương trình Vi phân Chuyển động 6 Bậc Tự do Đầy đủ (Full 6-DOF Equations of Motion)

#### 1. Động lực học tịnh tiến (Translational Dynamics)
Xét trong hệ quy chiếu quán tính ECI:

$$\frac{d\mathbf{r}_{ECI}}{dt} = \mathbf{v}_{ECI}$$

$$m(t) \frac{d\mathbf{v}_{ECI}}{dt} = \mathbf{F}_{thrust}^{ECI} + \mathbf{F}_{aero}^{ECI} + \mathbf{F}_{grav}^{ECI}$$

- **Lực hấp dẫn phi cầu (WGS84 Gravitational Model với hiệu ứng $J_2$ làm dẹt cực):**
  $$\mathbf{g}(\mathbf{r}) = -\frac{\mu}{r^3} \mathbf{r} + \mathbf{g}_{J_2}(\mathbf{r})$$
  $$\mathbf{g}_{J_2}(\mathbf{r}) = -\frac{3}{2} J_2 \frac{\mu R_E^2}{r^5} \begin{bmatrix} x \left( 1 - 5\frac{z^2}{r^2} \right) \\ y \left( 1 - 5\frac{z^2}{r^2} \right) \\ z \left( 3 - 5\frac{z^2}{r^2} \right) \end{bmatrix}$$
  Với $\mu = 3.986004418 \times 10^{14} \, \text{m}^3/\text{s}^2$, $R_E = 6378137 \, \text{m}$, $J_2 = 1.08263 \times 10^{-3}$.

- **Lực khí động trong hệ Body:**
  $$\mathbf{F}_{aero}^B = \begin{bmatrix} -C_A \cdot q \cdot S_{ref} \\ C_Y \cdot q \cdot S_{ref} \\ -C_N \cdot q \cdot S_{ref} \end{bmatrix}$$
  Chuyển sang hệ ECI: $\mathbf{F}_{aero}^{ECI} = \mathbf{C}_B^{ECI} \mathbf{F}_{aero}^B$.

- **Lực đẩy có điều khiển hướng lực đẩy TVC (góc lệch $\delta_y, \delta_z$):**
  $$\mathbf{F}_{thrust}^B = \begin{bmatrix} T \cos(\delta_y) \cos(\delta_z) \\ T \sin(\delta_y) \\ T \sin(\delta_z) \end{bmatrix} \approx \begin{bmatrix} T \\ T \delta_y \\ T \delta_z \end{bmatrix}$$

#### 2. Động lực học quay quanh trọng tâm (Rotational Dynamics - Phương trình Euler mở rộng)
Biến thiên mô-men động lượng của vật thể có khối lượng và mô-men quán tính biến thiên:

$$\mathbf{I}(t) \dot{\boldsymbol{\omega}}_B + \boldsymbol{\omega}_B \times (\mathbf{I}(t) \boldsymbol{\omega}_B) + \dot{\mathbf{I}}(t) \boldsymbol{\omega}_B = \mathbf{M}_{total}^B$$

Với tên lửa đối xứng trục ($I_{yy} = I_{zz} = I_\perp$ và $I_{xx} = I_\parallel$):

$$\begin{cases}
I_{xx} \dot{p} + \dot{I}_{xx} p = M_{roll} \\
I_{yy} \dot{q} - (I_{zz} - I_{xx}) p r + \dot{I}_{yy} q = M_{pitch} \\
I_{zz} \dot{r} - (I_{xx} - I_{yy}) p q + \dot{I}_{zz} r = M_{yaw}
\end{cases}$$

Tổng mô-men ngoại lực tác động:

$$\mathbf{M}_{total}^B = \mathbf{M}_{thrust} + \mathbf{M}_{aero} + \mathbf{M}_{damping} + \mathbf{M}_{jet\_damping}$$

- **Mô-men điều khiển lực đẩy TVC (với khoảng cách từ gimbal đến CG là $L_{tvc}$):**
  $$\mathbf{M}_{thrust}^B = \begin{bmatrix} 0 \\ -T \cdot L_{tvc} \cdot \delta_z \\ T \cdot L_{tvc} \cdot \delta_y \end{bmatrix}$$
- **Mô-men phục hồi khí động:**
  $$\mathbf{M}_{aero}^B = \mathbf{r}_{cp \to cg} \times \mathbf{F}_{aero}^B = \begin{bmatrix} 0 \\ q S_{ref} d_{ref} C_{m} \\ q S_{ref} d_{ref} C_{n} \end{bmatrix}$$
- **Mô-men cản giảm chấn dòng phụt (Jet Damping Moment do dòng khí tiêu tán động lượng quay):**
  $$\mathbf{M}_{jet\_damping} = -\dot{m} (l_{nozzle} - X_{cg})^2 \boldsymbol{\omega}_B$$

---

### 5.4. Các Giai đoạn Bay và Điều khiển Nghiêng Trọng lực (Gravity Turn)

```
        Quỹ đạo phóng:
         |       ... * (MECO - Hết thuốc phóng tầng 1 / Tách tầng)
         |     .
         |   . (Nghiêng trọng lực Gravity Turn tự nhiên: Alpha ~ 0)
         |  /
         | / (Pitch-over maneuver tại độ cao 100-500m)
         | |
         | | (Bay thẳng đứng rời bệ phóng Launch Cleared)
         +---------------------------------------------> Mặt đất
```

1. **Giai đoạn cất cánh thẳng đứng (Vertical Liftoff):** Duy trì góc $\theta = 90^\circ$ cho tới khi đạt độ cao an toàn ($h \approx 100 - 500\,\text{m}$) và vận tốc $v \approx 50 - 100\,\text{m/s}$ để triệt tiêu ảnh hưởng của cấu trúc bệ phóng.
2. **Kích hoạt nghiêng đầu (Pitch-Over Maneuver):** Xoay nhẹ góc chúi một lượng nhỏ $\Delta \theta \approx 1^\circ \sim 3^\circ$ về phía góc phương vị phóng (Launch Azimuth).
3. **Quỹ đạo Gravity Turn tự nhiên (Zero-Lift Trajectory):** Tên lửa duy trì góc tấn công $\alpha \approx 0$. Thành phần trọng lực vuông góc với vận tốc sẽ tự động kéo chúc đầu véc-tơ vận tốc xuống:
   $$\frac{d\gamma}{dt} = -\frac{g \cos \gamma}{v} + \frac{T \sin \alpha}{m v}$$
   Khi $\alpha = 0$, $\frac{d\gamma}{dt} = -\frac{g \cos \gamma}{v}$. Lợi ích: Lực nâng $L = 0$, triệt tiêu tải trọng uốn khí động $Q\alpha$, tiết kiệm tối đa tổn thất lái $\Delta v_{steer}$.

---

## 6. HỆ THỐNG DẪN ĐƯỜNG, ĐỊNH VỊ VÀ ĐIỀU KHIỂN (GNC)

### 6.1. Định vị (Navigation): Bộ lọc Kalman Mở rộng (Extended Kalman Filter - EKF)

Hệ thống kết hợp dữ liệu IMU tốc độ cao ($100 - 1000\,\text{Hz}$) với GPS và Cảm biến đo áp suất Barometer ($10 - 50\,\text{Hz}$).

Véc-tơ trạng thái mở rộng:

$$\mathbf{x} = \begin{bmatrix} \mathbf{p}_{NED} \\ \mathbf{v}_{NED} \\ \mathbf{q} \\ \mathbf{b}_{acc} \\ \mathbf{b}_{gyro} \end{bmatrix}_{16 \times 1}$$

- $\mathbf{b}_{acc}, \mathbf{b}_{gyro}$: Sai số dịch chuyển trôi (Bias) của gia tốc kế và con quay hồi chuyển.

#### Chu trình lọc EKF:
1. **Dự báo trạng thái (State Propagation):**
   $$\hat{\mathbf{x}}_{k|k-1} = f(\hat{\mathbf{x}}_{k-1|k-1}, \mathbf{u}_k)$$
   $$\mathbf{P}_{k|k-1} = \mathbf{F}_k \mathbf{P}_{k-1|k-1} \mathbf{F}_k^T + \mathbf{Q}_k$$
   Trong đó ma trận Jacobian $\mathbf{F}_k = \left. \frac{\partial f}{\partial \mathbf{x}} \right|_{\hat{\mathbf{x}}_{k-1}}$, $\mathbf{Q}_k$ là ma trận hiệp phương sai nhiễu quá trình.

2. **Cập nhật hiệu chỉnh (Measurement Update với GPS / Baro):**
   $$\mathbf{K}_k = \mathbf{P}_{k|k-1} \mathbf{H}_k^T (\mathbf{H}_k \mathbf{P}_{k|k-1} \mathbf{H}_k^T + \mathbf{R}_k)^{-1}$$
   $$\hat{\mathbf{x}}_{k|k} = \hat{\mathbf{x}}_{k|k-1} + \mathbf{K}_k (\mathbf{z}_k - h(\hat{\mathbf{x}}_{k|k-1}))$$
   $$\mathbf{P}_{k|k} = (\mathbf{I} - \mathbf{K}_k \mathbf{H}_k) \mathbf{P}_{k|k-1}$$

---

### 6.2. Dẫn đường Tiếp tuyến PEG (Powered Explicit Guidance)

Được phát triển cho tàu Apollo và tên lửa Saturn V, Space Shuttle. Định luật dẫn đường tiếp tuyến tuyến tính (Linear Tangent Steering Law) tối ưu hóa tiêu hao nhiên liệu đưa tên lửa vào quỹ đạo:

$$\tan \theta(t) = A - B \cdot t$$

$$\mathbf{u}_{thrust}(t) = \frac{\boldsymbol{\lambda}(t)}{\|\boldsymbol{\lambda}(t)\|} = \frac{\mathbf{A} + \mathbf{B} t}{\|\mathbf{A} + \mathbf{B} t\|}$$

Trong đó véc-tơ Lagrange multipliers $\boldsymbol{\lambda}(t)$ được giải lặp liên tục tại mỗi chu kỳ dẫn đường để thỏa mãn điều kiện biên: bán trục lớn $a$, độ lệch tâm $e$, và độ nghiêng $i$ mong muốn tại thời điểm dập tắt động cơ $t_{go}$.

---

### 6.3. Bộ Điều khiển Lực đẩy TVC bằng Vòng Lặp Phản Hồi PID / LQR

Mô hình hóa động học góc pitch gần điểm cân bằng ($\alpha \approx 0$):

$$I_{yy} \ddot{\theta} = C_{N\alpha} q S_{ref} (X_{cp} - X_{cg}) (\theta - \frac{\dot{z}}{v}) - T \cdot L_{tvc} \cdot \delta_y$$

Đặt $\mu_\alpha = \frac{C_{N\alpha} q S_{ref} (X_{cp} - X_{cg})}{I_{yy}}$ (Tần số riêng bất ổn khí động) và $\mu_\delta = \frac{T \cdot L_{tvc}}{I_{yy}}$ (Độ lợi cơ cấu chấp hành TVC):

$$\ddot{\theta} - \mu_\alpha \theta = -\mu_\delta \cdot \delta_y$$

Nếu $X_{cp} > X_{cg}$ (tên lửa tự ổn định), $\mu_\alpha < 0$. Nếu tên lửa không đuôi điều khiển chủ động hoàn toàn bằng TVC ($X_{cp} < X_{cg}$), $\mu_\alpha > 0$ (hệ hở không ổn định, nghiệm phân kỳ).

#### Luật điều khiển PID phản hồi:
$$\delta_y(t) = K_p (\theta_{cmd} - \theta) + K_d (\dot{\theta}_{cmd} - \dot{\theta}) + K_i \int (\theta_{cmd} - \theta) \, dt$$

Điều kiện ổn định Routh-Hurwitz cho hệ kín: $K_p > -\frac{\mu_\alpha}{\mu_\delta}$ và $K_d > 0$.

---

## 7. CƠ HỌC QUỸ ĐẠO VÀ ĐƯA VẬT THỂ VÀO QUỸ ĐẠO (ORBITAL MECHANICS & INSERTION)

### 7.1. Bài toán Hai Vật Thể và Bộ Tham số Quỹ đạo Kepler

Phương trình vi phân quỹ đạo:

$$\ddot{\mathbf{r}} = -\frac{\mu}{r^3} \mathbf{r}$$

Năng lượng cơ học riêng của quỹ đạo (Specific Orbital Energy):

$$\mathcal{E} = \frac{v^2}{2} - \frac{\mu}{r} = -\frac{\mu}{2a}$$

- $\mathcal{E} < 0$: Quỹ đạo Elip / Tròn (Elliptic/Circular - khép kín).
- $\mathcal{E} = 0$: Quỹ đạo Parabol (Vận tốc thoát ly $v_{esc} = \sqrt{\frac{2\mu}{r}}$).
- $\mathcal{E} > 0$: Quỹ đạo Hyperbol (Thoát ly lực hấp dẫn địa cầu).

#### Bộ 6 tham số quỹ đạo cổ điển (Keplerian Elements):
1. **$a$ (Semi-major Axis):** Bán trục lớn, xác định kích thước quỹ đạo.
2. **$e$ (Eccentricity):** Độ lệch tâm ($e = 0$: tròn; $0 < e < 1$: elip).
3. **$i$ (Inclination):** Độ nghiêng mặt phẳng quỹ đạo so với xích đạo ($0 \le i \le 180^\circ$).
4. **$\Omega$ (RAAN - Right Ascension of Ascending Node):** Kinh độ của điểm nút lên.
5. **$\omega$ (Argument of Periapsis):** Đối số cận điểm (góc từ điểm nút lên đến điểm cận địa).
6. **$\nu$ hoặc $M$ (True Anomaly / Mean Anomaly):** Vị trí tức thời của vật thể trên quỹ đạo.

---

### 7.2. Vận tốc Vũ trụ và Chuyển Quỹ đạo Hohmann

- **Vận tốc vũ trụ cấp 1 (Vận tốc quỹ đạo tròn thấp LEO tại độ cao $h$):**
  $$v_{c} = \sqrt{\frac{\mu}{R_E + h}}$$
  Tại $h = 200\,\text{km}$, $v_c \approx 7784 \, \text{m/s} \approx 7.8 \, \text{km/s}$.

- **Chuyển tiếp quỹ đạo Hohmann từ $r_1$ lên $r_2$:**
  $$a_{trans} = \frac{r_1 + r_2}{2}$$
  - Cú đốt tăng tốc lần 1 tại cận điểm:
    $$\Delta v_1 = \sqrt{\frac{\mu}{r_1}} \left( \sqrt{\frac{2r_2}{r_1 + r_2}} - 1 \right)$$
  - Cú đốt tăng tốc lần 2 tại viễn điểm:
    $$\Delta v_2 = \sqrt{\frac{\mu}{r_2}} \left( 1 - \sqrt{\frac{2r_1}{r_1 + r_2}} \right)$$
  - Tổng xung lực chuyển tiếp: $\Delta v_{Hohmann} = \Delta v_1 + \Delta v_2$.

---

## 8. MÔ PHỎNG SỐ VÀ THUẬT TOÁN TÍNH TOÁN (NUMERICAL SIMULATION)

### 8.1. Phương pháp Tích phân Số Runge-Kutta Bậc 4 (RK4)

Hệ vi phân phi tuyến: $\frac{d\mathbf{y}}{dt} = \mathbf{f}(t, \mathbf{y})$.

Tại mỗi bước thời gian $\Delta t$:

$$\mathbf{k}_1 = \mathbf{f}(t_n, \mathbf{y}_n)$$

$$\mathbf{k}_2 = \mathbf{f}\left(t_n + \frac{\Delta t}{2}, \mathbf{y}_n + \frac{\Delta t}{2} \mathbf{k}_1\right)$$

$$\mathbf{k}_3 = \mathbf{f}\left(t_n + \frac{\Delta t}{2}, \mathbf{y}_n + \frac{\Delta t}{2} \mathbf{k}_2\right)$$

$$\mathbf{k}_4 = \mathbf{f}(t_n + \Delta t, \mathbf{y}_n + \Delta t \, \mathbf{k}_3)$$

$$\mathbf{y}_{n+1} = \mathbf{y}_n + \frac{\Delta t}{6} (\mathbf{k}_1 + 2\mathbf{k}_2 + 2\mathbf{k}_3 + \mathbf{k}_4)$$

---

### 8.2. Kỹ thuật Phân tích Phân tán Monte Carlo (Dispersion Analysis)

Mô phỏng ngẫu nhiên hàng ngàn chuyến bay lặp lại với các phân phối sai số thống kê Gaussian $\mathcal{N}(\mu, \sigma^2)$:
- Sai số lực đẩy động cơ: $\Delta T \sim \mathcal{N}(0, (0.02 T)^2)$ ($2\%$).
- Hướng gió và vận tốc gió giật (Gust): Phân phối gió Weibull.
- Sai số vị trí khối tâm $\Delta X_{cg} \sim \mathcal{N}(0, (0.015 d)^2)$.
- Sai số góc căn chỉnh bệ phóng ban đầu $\Delta \theta_0, \Delta \phi_0 \sim \mathcal{N}(0, (0.5^\circ)^2)$.

Kết quả xuất ra Ellipse phân tán điểm rơi (Landing / Impact Dispersion Ellipse) với độ tin cậy $99.73\%$ ($3\sigma$).

---

### 8.3. Mã Nguồn Mô phỏng Số Hoàn Chỉnh Mẫu bằng Python (Full 3-DOF Simulation Engine)

Đoạn mã Python khoa học hoàn chỉnh dưới đây có thể chạy độc lập, giải hệ phương trình vi phân quỹ đạo bay có xét khí quyển tiêu chuẩn, tổn thất trọng lực, khí động học phụ thuộc số Mach, biến thiên khối lượng và quá trình nghiêng trọng lực (Gravity Turn):

```python
"""
=============================================================================
CHUONG TRINH MO PHONG QUY DAO TEN LUA 3-DOF (FLIGHT SIMULATION CORE)
Tac gia: Ban bien soan Khoa hoc Hieu nang cao
Phuong phap: Tich phan Runge-Kutta bac 4 (RK4)
Khi quyen: US Standard Atmosphere 1976 rut gon
=============================================================================
"""

import numpy as np
import matplotlib.pyplot as plt

# ----------------- HANG SO VAT LY CO BAN -----------------
G0 = 9.80665              # Gia toc trong truong chuan (m/s^2)
R_EARTH = 6371000.0       # Ban kinh Trai Dat (m)
MU_EARTH = 3.986004418e14 # Hang so hap dan tieu chuan GM (m^3/s^2)
R_AIR = 287.05287         # Hang so khi dac trung khong khi (J/kg.K)
GAMMA_AIR = 1.4           # Ty so nhiet dung rieng

# ----------------- THONG SO THIET KE TEN LUA -------------
M_DRY = 1200.0            # Khoi luong kho (kg)
M_PROP = 6800.0           # Khoi luong thuoc phong/nhien lieu (kg)
M_PAYLOAD = 300.0         # Khoi luong tai trong (kg)
M_TOTAL_INIT = M_DRY + M_PROP + M_PAYLOAD

THRUST_VAC = 145000.0     # Luc day trong chan khong (N)
ISP_VAC = 285.0           # Xung luc rieng chan khong (s)
MDOT = THRUST_VAC / (ISP_VAC * G0) # Luu luong khoi luong (kg/s)
BURN_TIME = M_PROP / MDOT # Thoi gian dot chay dong co (s)

D_REF = 0.8               # Duong kinh than ten lua (m)
S_REF = np.pi * (D_REF / 2.0)**2 # Dien tich can tham chieu (m^2)

# ----------------- MO HINH KHI QUYEN ----------------------
def atmosphere(h):
    """Tra ve (mat do rho, ap suat p, nhiet do T, toc do am thanh a) theo do cao h"""
    if h < 0.0:
        h = 0.0
    if h <= 11000.0: # Tang doi luu
        T0 = 288.15
        p0 = 101325.0
        lapse = -0.0065
        T = T0 + lapse * h
        p = p0 * (T / T0)**(-G0 / (lapse * R_AIR))
    elif h <= 20000.0: # Tang binh luu duoi
        T11 = 216.65
        p11 = 22632.06
        T = T11
        p = p11 * np.exp(-G0 * (h - 11000.0) / (R_AIR * T11))
    elif h <= 32000.0:
        T20 = 216.65
        p20 = 5474.89
        lapse = 0.001
        T = T20 + lapse * (h - 20000.0)
        p = p20 * (T / T20)**(-G0 / (lapse * R_AIR))
    else: # Mo hinh suy giam ham mu o tang cao
        T = 220.0
        p = 1000.0 * np.exp(-(h - 32000.0) / 7000.0)

    rho = p / (R_AIR * T)
    a = np.sqrt(GAMMA_AIR * R_AIR * T)
    return rho, p, T, a

# ----------------- HE SO LUC CAN CD THEO MACH ------------
def get_cd(mach):
    """He so luc can phi tuyen phu thuoc van toc Mach"""
    if mach < 0.8:
        return 0.28 + 0.04 * mach
    elif mach <= 1.2: # Vung xuyen am (Transonic peak)
        return 0.31 + 0.45 * np.sin(np.pi * (mach - 0.8) / 0.8)
    else: # Vung sieu am (Supersonic decay)
        return 0.22 + 0.40 / np.sqrt(mach**2 - 0.2)

# ----------------- DAO HAM TRANG THAI DONG HOC ------------
def rocket_dynamics(t, state):
    """
    state = [x, z, vx, vz, m]
    x: cu ly ngang (m), z: do cao (m)
    vx, vz: thanh phan van toc (m/s)
    m: khoi luong tuc thoi (kg)
    """
    x, z, vx, vz, m = state
    v = np.hypot(vx, vz)
    r = R_EARTH + z
    g = MU_EARTH / (r**2)

    # Kiem tra dong co
    is_burning = t < BURN_TIME and m > (M_DRY + M_PAYLOAD)
    dm = -MDOT if is_burning else 0.0

    # Khong khi va khi dong
    rho, p, T, a = atmosphere(z)
    mach = v / a if a > 0.0 else 0.0
    cd = get_cd(mach)
    q = 0.5 * rho * v**2
    f_drag = q * S_REF * cd

    # Huong van toc bay
    gamma = np.arctan2(vz, vx) if v > 1e-3 else np.pi / 2.0

    # Luc can phan ra thanh phan
    d_x = f_drag * np.cos(gamma)
    d_z = f_drag * np.sin(gamma)

    # Chuong trinh dieu khien huong luc day (Gravity Turn Profile)
    if is_burning:
        if z < 300.0:
            # Bay thang dung thoat be phong
            pitch = np.pi / 2.0
        elif z < 1500.0:
            # Kich hoat pitch-over chu dong
            progress = (z - 300.0) / 1200.0
            pitch = np.pi / 2.0 - np.radians(3.5) * progress
        else:
            # Gravity turn: can chinh luc day theo huong van toc (alpha ~ 0)
            pitch = gamma
        thrust = THRUST_VAC
        t_x = thrust * np.cos(pitch)
        t_z = thrust * np.sin(pitch)
    else:
        t_x = 0.0
        t_z = 0.0

    # Phuong trinh vi phan Newton
    ax = (t_x - d_x) / m
    az = (t_z - d_z) / m - g

    # Tranh roi xuong duoi mat dat
    if z < 0.0 and az < 0.0:
        vz = 0.0
        az = 0.0

    return np.array([vx, vz, ax, az, dm])

# ----------------- TICH PHAN RUNGE-KUTTA BAC 4 -----------
def simulate():
    dt = 0.05
    t_max = 600.0
    time = np.arange(0.0, t_max, dt)

    state = np.array([0.0, 0.0, 0.0, 0.0, M_TOTAL_INIT]) # [x, z, vx, vz, m]
    history = []

    for t in time:
        history.append([t, *state])
        if state[1] < 0.0 and t > 5.0:
            break # Cham dat

        k1 = rocket_dynamics(t, state)
        k2 = rocket_dynamics(t + 0.5 * dt, state + 0.5 * dt * k1)
        k3 = rocket_dynamics(t + 0.5 * dt, state + 0.5 * dt * k2)
        k4 = rocket_dynamics(t + dt, state + dt * k3)

        state += (dt / 6.0) * (k1 + 2*k2 + 2*k3 + k4)
        state[4] = max(state[4], M_DRY + M_PAYLOAD)

    return np.array(history)

# Chay thu nghiem
data = simulate()
t = data[:, 0]
x = data[:, 1]
z = data[:, 2]
v = np.hypot(data[:, 3], data[:, 4])

print(f"--- KET QUA MO PHONG BAN DAU ---")
print(f"Do cao cuc dai (Apogee): {np.max(z)/1000.0:.2f} km")
print(f"Van toc cuc dai (Max Velocity): {np.max(v):.2f} m/s (Mach {np.max(v)/300.0:.2f})")
print(f"Tam xa dat duoc (Downrange): {x[-1]/1000.0:.2f} km")
```

---

## 9. HỆ THỐNG THU HỒI (RECOVERY), ĐIỆN TỬ HÀNG KHÔNG (AVIONICS) VÀ PHẦN MỀM MÔ PHỎNG

### 9.1. Động lực học Bung Dù và Lực Sốc Mở Dù (Dual-Deployment Recovery)

Chiến lược thu hồi hai giai đoạn (Dual-deployment) là tiêu chuẩn an toàn bắt buộc để tránh gió tầng cao thổi tên lửa dạt xa ngoài tầm kiểm soát:

```
        Apogee (Đỉnh quỹ đạo)
               *
              / \
  Bung dù con/   \ (Rơi nhanh ổn định v ~ 30 m/s với Drogue Chute)
  (Drogue)  /     \
                   * Độ cao h ~ 400 m: Bung dù chính (Main Chute)
                    \
                     \ (Hạ cánh êm v <= 6 m/s)
                      \
                     ===== Mặt đất =====
```

#### 1. Phương trình vận tốc rơi cân bằng (Terminal Descent Velocity)
Khi lực cản của dù cân bằng với trọng lượng:

$$v_{term} = \sqrt{\frac{2 m_{land} \, g}{\rho(h) \cdot S_{chute} \cdot C_{D,chute}}}$$

Trong đó:
- Dù hãm con (Drogue Chute): Đường kính nhỏ, $C_{D,chute} \approx 0.97 \sim 1.2$, duy trì vận tốc rơi $v_{drogue} \approx 25 - 35 \, \text{m/s}$ để rơi nhanh qua tầng gió đối lưu.
- Dù chính (Main Chute): Thiết kế dạng chỏm cầu hoặc Toroidal, $C_{D,chute} \approx 1.5 - 2.2$, diện tích vòm dù $S_{chute} = \frac{\pi D_{chute}^2}{4}$, vận tốc tiếp đất an toàn $v_{land} \le 5 - 6.5 \, \text{m/s}$ để bảo vệ thiết bị điện tử và cảm biến.

#### 2. Lực giật tức thời khi mở dù (Opening Shock Force theo tiêu chuẩn Knacke)
Lực giật xung kích lớn nhất tác dụng lên dây dù và thân tên lửa:

$$F_{shock} = C_x \cdot q_{deploy} \cdot S_{chute} \cdot C_k$$

Trong đó:
- $q_{deploy} = \frac{1}{2} \rho v_{deploy}^2$ là áp suất động tại thời điểm bung.
- $C_k$: Hệ số sốc xung lực mở dù ($C_k \approx 1.05 - 1.4$ cho dù vải dệt thoi có lỗ thoát đỉnh).
- Dây giật chịu lực (Shock Cord bằng sợi Kevlar hoặc Tubular Nylon) phải có chiều dài gấp $3 - 5$ lần chiều dài thân và hệ số an toàn chịu lực $SF \ge 10$ so với trọng lượng tên lửa.

#### 3. Tính toán liều lượng thuốc phóng bung chốt nilon (Ejection Charge Sizing)
Sử dụng thuốc nổ đen FFFFg (Black Powder) sinh khí nén đẩy tách khoang chứa dù:

$$m_{BP} = \frac{\Delta p \cdot V_{bay}}{R_{gas} \cdot T_{comb}} \quad (\text{kg})$$

Quy đổi thực nghiệm:

$$m_{BP} \, [\text{gam}] \approx \frac{\Delta p \, [\text{psi}] \cdot V_{bay} \, [\text{inch}^3]}{1000} \cdot 0.175$$

Trong đó chênh áp yêu cầu $\Delta p$ thường chọn từ $10 - 15 \, \text{psi}$ ($70 - 100 \, \text{kPa}$) đủ để cắt đứt $2 - 4$ chốt chẻ nilon (Shear pins $2-56$ hoặc $4-40$) ngăn việc nắp chóp bị tuột sớm do áp suất chân không tầng cao.

---

### 9.2. Kiến trúc Điện tử Hàng không (Avionics) và Mạch Kích Nổ E-Match

Hệ thống điều khiển trung tâm trên tên lửa (Flight Avionics Stack) được thiết kế theo cấu trúc mô-đun hóa có dự phòng:

```
+-------------------------------------------------------------------------+
|                              FLIGHT COMPUTER                            |
|                                                                         |
|  [Nguồn LiPo kép] ---> [Bảo vệ ngược cực / Buck DC-DC 3.3V & 5V]        |
|                                |                                        |
|  [Dual IMU: 6-DOF & High-G] -> |                                        |
|  [Dual Barometer: MS5611] ---> | ---> ARM Cortex-M7 RTOS (1 kHz)        |
|  [GPS / GNSS 10 Hz Module] -> |        |                     |          |
|                                        v                     v          |
|                       [Mạch kích nổ E-Match]        [Telemetry LoRa]    |
|                       (MOSFET Kênh N + Safety Pin)  (433/915 MHz 1W)    |
|                                |                             |          |
|                       Drogue / Main Pyro             Trạm Mặt Đất (GCS) |
+-------------------------------------------------------------------------+
```

1. **Thuật toán phát hiện đỉnh quỹ đạo (Apogee Detection):**
   - Đọc áp suất Barometer liên tục với tần số $50 - 100 \, \text{Hz}$, lọc nhiễu bằng bộ lọc Kalman 1D.
   - Điều kiện kích hoạt dù Drogue: Đạo hàm vận tốc thẳng đứng đảo chiều ($\hat{v}_z \le 0$) liên tiếp trong $N = 5$ mẫu đo, hoặc áp suất khí quyển bắt đầu tăng liên tục sau khi chạm cực tiểu.
2. **Mạch lái kích nổ ngòi điện (Pyrotechnic Firing Circuit):**
   - Sử dụng transistor MOSFET công suất kênh N (Logic-level như IRLZ44N hoặc SI2302) chịu dòng tức thời $> 5 - 10 \, \text{A}$.
   - Thiết kế cầu kiểm tra thông mạch (Continuity Sense Circuit) dùng dòng điện siêu nhỏ ($< 5 \, \text{mA}$, thấp hơn nhiều dòng bắt cháy ngòi $I_{fire} \approx 500 \, \text{mA}$) đưa vào chân ADC để báo trạng thái an toàn trước khi bấm nút phóng.

---

### 9.3. Hệ Sinh thái Công cụ Phần mềm Mô phỏng Chuyên dụng Hàng không Vũ trụ

Bảng tổng hợp các phần mềm công nghiệp và học thuật chuẩn quốc tế được sử dụng để xây dựng dữ liệu cho báo cáo khoa học:

| Phân hệ chuyên môn | Phần mềm tiêu chuẩn | Phương pháp tính toán / Ứng dụng |
| :--- | :--- | :--- |
| **Nhiệt động buồng đốt** | **NASA CEA** (Chemical Equilibrium), **RPA** | Cân bằng hóa nhiệt Gibss tự do, xuất các thông số khí cháy $T_c, M_w, \gamma, c^*, I_{sp}$. |
| **Khí động học nhanh** | **OpenRocket**, **RASAero II** | Phương pháp Barrowman, mở rộng dải sóng xung kích xuyên âm/siêu âm, tính $C_D(M), X_{cp}$. |
| **Mô phỏng CFD cao cấp** | **ANSYS Fluent**, **OpenFOAM** | Giải RANS $k-\omega$ SST 3D, phân tích phân bố áp suất, dòng tách sau đáy (Base drag) và luồng phụt (Plume). |
| **Kết cấu & Ứng suất FEA** | **ANSYS Mechanical**, **Abaqus**, **Nastran** | Rời rạc hóa phần tử hữu hạn, phân tích bền Von Mises, ổn định uốn Eigenvalue Buckling, rung lắc Modal. |
| **Quỹ đạo bay & GNC** | **RocketPy**, **NASA POST II**, **MATLAB/Simulink** | Tích phân chuyển động 6-DOF, điều khiển TVC, mô phỏng ngẫu nhiên phân tán Monte Carlo. |
| **Phân tích cơ học quỹ đạo** | **GMAT** (NASA), **Poliastro**, **Tudat** | Bài toán truyền quỹ đạo không gian sâu, nhiễu loạn J2, chuyển quỹ đạo Hohmann. |
| **Thiết kế điện tử** | **KiCAD**, **EasyEDA** | Thiết kế sơ đồ nguyên lý Schematic, Layout mạch in PCB 4 lớp chống nhiễu vô tuyến cao tần. |

---

## 10. QUY TRÌNH THỰC NGHIỆM, THỬ NGHIỆM TĨNH VÀ AN TOÀN BÃI PHÓNG

### 9.1. Quy trình Thử nghiệm Mặt đất Bắt buộc

```
Kiểm tra thành phần (Sensors, Valves)
        |
        v
Thử nghiệm thủy tĩnh bình áp lực (Hydrostatic Proof Test: 1.5x P_work)
        |
        v
Thử nghiệm nguội dòng chảy (Cold Flow Test: Đo lưu lượng, tổn thất áp)
        |
        v
Thử nghiệm đốt tĩnh trên bệ (Static Hot-Fire Test: Đo đường cong Thrust-Time)
        |
        v
Thử nghiệm tích hợp toàn hệ thống & Rung lắc (Vibration & Avionics HIL)
        |
        v
Cấp phép phóng (Flight Readiness Review - FRR)
```

1. **Thử nghiệm Thủy tĩnh (Hydrostatic Proof Pressure Test):** Bơm đầy nước vào bình áp lực đến áp suất thử nghiệm $P_{proof} = 1.5 \cdot P_{working}$. Dùng nước để tránh tích lũy năng lượng nén nổ như khí nén. Duy trì đo độ dãn dài vật liệu bằng điện trở dán biến dạng (Strain Gauges).
2. **Thử nghiệm Đốt Tĩnh (Static Fire Test):**
   - Động cơ được ngàm cứng trên giá đỡ thử nghiệm có cảm biến tải lực (Load Cell 6 bậc tự do).
   - Đo đạc tốc độ tăng áp $\frac{dp_c}{dt}$, áp suất định thường $p_c$, độ rung chấn (Piezoelectric Accelerometers) để phát hiện dao động cháy cao tần (Combustion Instability / POGO).
3. **Mô phỏng Phần cứng trong Vòng lặp (Hardware-in-the-Loop - HIL):** Kết nối máy tính bay (Flight Computer) thực tế vào môi trường mô phỏng không gian ảo, kích hoạt cơ cấu servo TVC chuyển động theo quỹ đạo giả lập.

---

### 9.2. Tiêu chuẩn An toàn Bãi phóng (Range Safety & Flight Termination System)

- **Hành lang bay (Launch Corridor):** Giới hạn góc phương vị đảm bảo mảnh vỡ khi xảy ra sự cố không bao giờ rơi vào khu dân cư.
- **Dấu chân phân tán mảnh vỡ (Debris Footprint Analysis):**
  $$R_{debris} = v_{explosion} \sqrt{\frac{2h}{g_0}} + v_{wind} \cdot t_{fall}$$
- **Hệ thống Tự hủy / Chấm dứt Chuyến bay (Flight Termination System - FTS):** Cơ chế độc lập nhận lệnh mã hóa từ mặt đất hoặc kích hoạt tự động khi góc nghiêng tên lửa lệch khỏi quỹ đạo an toàn quá $\Delta \theta_{abort} > 15^\circ$, kích nổ dây nổ cắt dưa (Linear Shaped Charge) xé rách bình chứa giải phóng áp suất tức thì.

---

## 11. KHUNG ĐỀ CƯƠNG BÁO CÁO KHOA HỌC HOÀN CHỈNH (AIAA / IEEE PAPER BLUEPRINT)

Dưới đây là cấu trúc khung chuẩn của một báo cáo khoa học hoặc đồ án kỹ thuật hàng không vũ trụ cấp cao:

```
TIÊU ĐỀ BÁO CÁO (In hoa, rõ ràng, mang tính học thuật cao)
  |-- TÓM TẮT (ABSTRACT): Bối cảnh, mục tiêu, phương pháp, kết quả chính, ý nghĩa.
  |-- TỪ KHÓA (KEYWORDS): 4-6 từ khóa chuyên ngành.
  |
  |-- 1. GIỚI THIỆU (INTRODUCTION)
  |     1.1. Bối cảnh nghiên cứu và nhu cầu kỹ thuật
  |     1.2. Tổng quan các nghiên cứu trước đây (Literature Review)
  |     1.3. Mục tiêu và phạm vi của đề tài
  |
  |-- 2. YÊU CẦU NHIỆM VỤ VÀ KIẾN TRÚC HỆ THỐNG (MISSION & SYSTEM ARCHITECTURE)
  |     2.1. Đề bài nhiệm vụ (Độ cao cực đại Apogee, tải trọng mang theo, độ nghiêng quỹ đạo)
  |     2.2. Ngân sách khối lượng và phân bổ Delta-V từng tầng (Mass Budget & Delta-V Breakdown)
  |
  |-- 3. MÔ HÌNH HÓA ĐỘNG LỰC HỌC ĐẨY (PROPULSION SYSTEM MODELING)
  |     3.1. Phân tích nhiệt động học buồng đốt và lưu chất qua loa phụt Laval
  |     3.2. Tính toán diện tích mặt cháy và áp suất cân bằng buồng đốt
  |     3.3. Dựng đường cong đặc tính lực đẩy theo thời gian T(t)
  |
  |-- 4. PHÂN TÍCH KHÍ ĐỘNG HỌC VÀ ĐỘ ỔN ĐỊNH TĨNH (AERODYNAMICS & STABILITY)
  |     4.1. Lựa chọn dạng hình học mũi, thân và cánh đuôi
  |     4.2. Tính toán tâm áp suất khí động (X_cp) theo phương pháp Barrowman
  |     4.3. Xác định trọng tâm biến thiên (X_cg(t)) và biên độ ổn định (Static Margin)
  |     4.4. Mô hình hóa hệ số lực cản C_D theo số Mach
  |
  |-- 5. THIẾT KẾ KẾT CẤU VÀ TÍNH TOÁN CƠ HỌC VẬT LIỆU (STRUCTURAL INTEGRITY)
  |     5.1. Phân tích tải trọng nguy hiểm nhất (Gia tốc nén + Max-Q bending)
  |     5.2. Tính toán bền vỏ mỏng chịu áp lực và kiểm tra mất ổn định uốn (Buckling)
  |     5.3. Lựa chọn vật liệu và quy trình công nghệ chế tạo
  |
  |-- 6. THIẾT KẾ HỆ THỐNG DẪN ĐƯỜNG, ĐỊNH VỊ VÀ ĐIỀU KHIỂN (GNC DESIGN)
  |     6.1. Thiết kế bộ lọc trạng thái EKF tích hợp cảm biến IMU/GPS
  |     6.2. Thiết lập quy luật bay nghiêng trọng lực (Gravity Turn Profile)
  |     6.3. Thiết kế bộ điều khiển phản hồi TVC / Khí động
  |
  |-- 7. THUẬT TOÁN MÔ PHỎNG SỐ VÀ KẾT QUẢ QUỸ ĐẠO (NUMERICAL SIMULATION RESULTS)
  |     7.1. Cài đặt thuật toán tích phân vi phân RK4 / 6-DOF
  |     7.2. Kết quả quỹ đạo danh định (Độ cao, vận tốc, áp suất động Max-Q theo thời gian)
  |     7.3. Đánh giá sai số và mô phỏng ngẫu nhiên Monte Carlo
  |
  |-- 8. KẾT QUẢ THỰC NGHIỆM VÀ ĐỐI CHIẾU MÔ PHỎNG (EXPERIMENTAL VALIDATION)
  |     8.1. Kết quả thử nghiệm đốt tĩnh mặt đất (Static Test Data)
  |     8.2. So sánh đối chiếu giữa đường cong mô phỏng và thực tế đo đạc
  |     8.3. Thảo luận các nguồn sai số và biện pháp tối ưu hóa
  |
  |-- 9. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN (CONCLUSION & FUTURE WORK)
  |
  |-- LỜI CẢM ƠN (ACKNOWLEDGMENTS)
  |-- TÀI LIỆU THAM KHẢO (REFERENCES - Định dạng chuẩn IEEE/AIAA)
  |-- PHỤ LỤC (APPENDIX: Mã nguồn tính toán, bản vẽ kỹ thuật CAD, bảng số liệu thực nghiệm)
```

---

## 12. TÀI LIỆU THAM KHẢO CHUYÊN NGÀNH KINH ĐIỂN (CLASSIC AEROSPACE REFERENCES)

1. **George P. Sutton & Oscar Biblarz**, *Rocket Propulsion Elements*, 9th Edition, John Wiley & Sons. *(Cuốn sách kinh điển số 1 thế giới về nhiệt động buồng đốt và hệ thống đẩy tên lửa).*
2. **Howard D. Curtis**, *Orbital Mechanics for Engineering Students*, Butterworth-Heinemann. *(Giáo trình chuẩn về bài toán 2 vật thể, chuyển quỹ đạo và tọa độ vệ tinh).*
3. **James S. Barrowman**, *The Theoretical Prediction of the Center of Pressure*, NASA Technical Report, 1966. *(Cơ sở toán học tính tâm áp suất khí động học tên lửa).*
4. **David K. Barton**, *Radar System Analysis and Modeling*, Artech House.
5. **NASA SP-8007**, *Buckling of Thin-Walled Circular Cylinders*, NASA Space Vehicle Design Criteria (Structures). *(Tiêu chuẩn tính toán bền ổn định vỏ mỏng tên lửa).*
6. **Zipfel, Peter H.**, *Modeling and Simulation of Aerospace Vehicle Dynamics*, AIAA Education Series. *(Tài liệu toàn diện nhất về toán học 6-DOF và Quaternions).*
7. **Frank J. Regan & Satya M. Anandakrishnan**, *Dynamics of Atmospheric Re-Entry*, AIAA Education Series.

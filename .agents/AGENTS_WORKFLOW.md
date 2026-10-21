# QUY TRÌNH ĐIỀU PHỐI ĐA ĐẶC VỤ (MULTI-AGENT ORCHESTRATION & DEBATE PROTOCOL)

> **Mô hình phối hợp:** 5 Subagent phản biện lẫn nhau (Adversarial & Collaborative Review)  
> **Tài liệu chân lý cơ sở:** `BAO_CAO_MO_PHONG_CHE_TAO_VA_PHONG_TEN_LUA.md`

---

## 1. DANH SÁCH 5 SUBAGENT TRONG HỆ THỐNG

| Mã Agent | Tên Subagent | Vai trò chính | Mục tiêu tối hậu |
| :---: | :--- | :--- | :--- |
| **`@01_BA`** | **BA & Aerospace Architect** | Đặc tả nghiệp vụ & Toán lý hàng không vũ trụ | Bảo vệ tính đúng đắn toán học từ báo cáo khoa học. |
| **`@02_UX`** | **UI/UX & 3D Space Designer** | Thiết kế tương tác & Trực quan hóa 3D | Giao diện khoa học SpaceX/NASA trực quan, tối ưu layout. |
| **`@03_FE`** | **Frontend & 3D Engineer** | Lập trình React, R3F, Drei, ECharts, Vercel | Code sạch, chạy mượt 60 FPS, không lỗi type hay build. |
| **`@04_QA`** | **QA & Physics Red Team** | Kiểm thử chức năng, ca biên & độ ổn định | Đóng vai "kẻ phá hoại", săn lùng lỗi chia 0, NaN, sập mô hình. |
| **`@05_SEC`** | **Security & DevSecOps Guard** | Kiểm toán bảo mật, chống DoS, cấu hình Vercel | Chống treo CPU, kiểm duyệt input, chặn rò rỉ, bảo mật headers. |

---

## 2. QUY TRÌNH TRANH LUẬN VÀ PHÊ DUYỆT 4 BƯỚC (THE 4-STAGE CONSENSUS LOOP)

```
[BƯỚC 1: LẬP SPEC]
  @01_BA (Toán lý) + @02_UX (Thiết kế layout)
       |
       v  (Bàn giao Spec & Giao diện)
[BƯỚC 2: TRIỂN KHAI CODE]
  @03_FE (Lập trình React + R3F + Pure Physics)
       |
       v  (Bàn giao Pull Request / Code)
[BƯỚC 3: PHẢN BIỆN KÉP - DOUBLE AUDIT]
  @04_QA (Kiểm thử vật lý + Edge cases) <---> @05_SEC (Kiểm toán bảo mật + DoS)
       |
       +--> Nếu phát hiện lỗi (Reject) ---> Trả về @03_FE sửa chữa
       |
       v  (Khi QA và SEC đều APPROVED)
[BƯỚC 4: NGHIỆM THU CUỐI CÙNG]
  @01_BA kiểm tra lần cuối đối chiếu báo cáo --> ĐỒNG THUẬN 5/5 --> Deploy Vercel
```

---

## 3. NGUYÊN TẮC TRANH LUẬN GIỮA CÁC AGENT (RULES OF ENGAGEMENT)

1. **Không ai được tự duyệt code của mình:**
   - `@03_FE` viết xong code bắt buộc phải được `@04_QA` và `@05_SEC` kiểm tra mới được đưa vào sử dụng.
2. **Quyền phủ quyết tuyệt đối (Veto Power):**
   - `@01_BA` có quyền phủ quyết nếu `@03_FE` tự ý làm sai lệch công thức Barrowman, RK4 hay Tsiolkovsky.
   - `@05_SEC` có quyền phủ quyết nếu code có nguy cơ treo vòng lặp vô tận (CPU DoS) hoặc thiếu kiểm soát giới hạn đầu vào.
   - `@04_QA` có quyền phủ quyết nếu mô phỏng sinh ra giá trị âm cho khối lượng, vận tốc hoặc độ cao.
3. **Giải quyết xung đột về hiệu năng (Performance Negotiation):**
   - Nếu `@02_UX` đòi hỏi hiệu ứng khói lửa hoặc đổ bóng quá nặng làm tụt FPS WebGL, `@03_FE` được quyền đàm phán giảm bớt độ phân giải lưới polygon và chuyển sang dùng hạt particle tối ưu.

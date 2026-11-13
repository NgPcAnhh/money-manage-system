# MMS - Quản Lý Tài Chính & Danh Mục Đầu Tư Cá Nhân (Mobile First)

Ứng dụng web tĩnh (HTML5, CSS3, JavaScript ES6) quản lý chi tiêu ngân sách và danh mục đầu tư cá nhân, được thiết kế tối ưu chuẩn giao diện **iPhone 15 Pro Max** và hỗ trợ triển khai miễn phí 100% trên **GitHub Pages**.

---

## 🌟 Tính Năng Nổi Bật

1. **Chuẩn giao diện iPhone 15 Pro Max (iOS 17/18 Neo-Fintech)**:
   - Dynamic Island & Status bar chân thực.
   - Thanh điều hướng Bottom Bar chuẩn Native iOS.
   - Bo góc mềm mại, hiệu ứng làm mờ nền kính (Backdrop Blur), hỗ trợ chuyển đổi Dark / Light Theme.
   - Trên di động (iPhone/Android): Tự động tràn viền full-screen.
   - Trên máy tính: Hiển thị khung iPhone 15 Pro Max sang trọng.

2. **Cơ chế lưu trữ dữ liệu tĩnh trên GitHub Pages (Không cần Database)**:
   - **Tự động lưu vào `LocalStorage`**: Mọi thao tác thêm/sửa/xóa tháng lương, dòng tiền, rỏ đầu tư đều được lưu tức thì vào bộ nhớ trình duyệt của điện thoại/máy tính.
   - **Sao lưu & Phục hồi JSON (1-Click Backup & Restore)**: Tải file `mms_finance_backup_<ngay>.json` về máy để lưu trữ hoặc chuyển đổi dữ liệu dễ dàng giữa iPhone và Laptop.
   - **Copy chuỗi JSON vào Clipboard**: Chia sẻ hoặc lưu nhanh vào Ghi chú (Notes).
   - **Dữ liệu mẫu ban đầu**: Đã cấu hình sẵn chính xác bản ghi Tháng 9/2026 từ file Excel gốc của bạn (`MB - IT Risk - CV lv1`).

3. **Màn hình Dashboard Tổng Quan (KPIs & Biểu Đồ Trực Quan)**:
   - **Thẻ số lớn**: Thu nhập thực nhận, Tổng chi phí & phân bổ, Tiết kiệm & Đầu tư, Tiền tiêu còn lại & Số dư thực tế.
   - **Biểu đồ tròn (Doughnut Chart)**: Phân bổ chi tiêu chi tiết (Học tập, Gửi bố mẹ, Nhu cầu thiết yếu, Tiền tiêu, Tiết kiệm, Đầu tư).
   - **Biểu đồ đường (Line Chart)**: Lịch sử và xu hướng thu nhập, tiền tiết kiệm và chi tiêu qua các tháng.
   - **Danh sách chi tiết nhu cầu thiết yếu**: ChatGPT, Cắt tóc, Old Spice, Tiền mạng, BCS...

4. **Khai báo Kì Lương & Công Thức Tự Động Tính Toán**:
   - `Thực nhận` = `Lương (Gross)` - `Thuế & Khấu trừ` + `Thưởng & thêm`
   - `Tổng nhu cầu thiết yếu` = Tổng các khoản chi tiết (có thể thêm bớt mục tùy ý)
   - `Tiền tiêu còn lại` = `Thực nhận` - (`Học` + `Gửi bố mẹ` + `Tiết kiệm` + `Đầu tư` + `Nhu cầu thiết yếu`)
   - `Tỷ lệ tích lũy` = `((Tiết kiệm + Đầu tư) / Thực nhận) * 100%`

5. **Sổ Thu Chi Linh Hoạt (Cashflow Tracker)**:
   - Dành cho các khoản chi tiêu / thu nhập phát sinh hàng ngày ngoài bảng lương cố định (Ăn uống, Cafe, Mua sắm, Di chuyển...).
   - Lọc nhanh theo Khoản Chi, Khoản Thu hoặc Tất cả.
   - Thống kê chênh lệch dòng tiền.

6. **Quản Lý Danh Mục Đầu Tư (Portfolio & Baskets)**:
   - Khai báo các rỏ đầu tư: Cổ phiếu MBB, Quỹ mở/ETF, Crypto (BTC/ETH), Vàng, Tiết kiệm sinh lời...
   - Theo dõi: Vốn đã bỏ vào, Giá trị hiện tại, Lợi nhuận/Lỗ (P&L bằng số tiền và %).
   - Biểu đồ phân bổ tài sản (Asset Allocation).

---

## 🚀 Hướng Dẫn Triển Khai Lên GitHub Pages (2 Phút)

### Bước 1: Khởi tạo Git và Commit
Mở terminal tại thư mục dự án và chạy các lệnh sau:

```bash
git init
git add .
git commit -m "feat: Khoi tao ung dung quan ly tai chinh va dau tu MMS"
```

### Bước 2: Tạo Repository trên GitHub
1. Truy cập [GitHub](https://github.com) và tạo một Repository mới (ví dụ đặt tên là `mms` hoặc `my-finance`).
2. Chọn chế độ **Public** (để dùng GitHub Pages miễn phí).

### Bước 3: Đẩy mã nguồn lên GitHub
```bash
git branch -M main
git remote add origin https://github.com/<tai-khoan-cua-ban>/<ten-repo>.git
git push -u origin main
```

### Bước 4: Kích hoạt GitHub Pages
1. Vào repository trên GitHub &rarr; Chọn tab **Settings**.
2. Ở thanh bên trái, chọn **Pages**.
3. Tại mục **Build and deployment**:
   - **Source**: Chọn `Deploy from a branch`.
   - **Branch**: Chọn `main` và thư mục `/(root)`.
   - Nhấn **Save**.
4. Chờ khoảng 1-2 phút, GitHub sẽ tạo link trang web của bạn:
   `https://<tai-khoan-cua-ban>.github.io/<ten-repo>/`

---

## 📱 Cài Đặt Vào iPhone 15 Pro Max Như Một Ứng Dụng Native

1. Mở trình duyệt **Safari** trên iPhone và truy cập vào đường link GitHub Pages của bạn.
2. Nhấn vào nút **Chia sẻ (Share)** (biểu tượng hình vuông có mũi tên hướng lên ở giữa thanh công cụ Safari).
3. Cuộn xuống và chọn **"Thêm vào Màn hình chính" (Add to Home Screen)**.
4. Nhấn **Thêm (Add)**.
5. Biểu tượng ứng dụng MMS sẽ xuất hiện trên màn hình iPhone, khi mở sẽ chạy toàn màn hình (Standalone) không có thanh địa chỉ của trình duyệt, mượt mà như app tải từ App Store!

---

## 🔒 Bảo Mật & Riêng Tư Dữ Liệu
- Toàn bộ dữ liệu tài chính của bạn được lưu trữ trên thiết bị cá nhân (trình duyệt) thông qua `localStorage`.
- Không gửi bất kỳ thông tin nào lên máy chủ bên thứ ba.
- Hãy sử dụng tính năng **"Tải về file dữ liệu (.json)"** trong mục **Cài đặt** định kỳ để sao lưu an toàn!

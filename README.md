# MMS - Quản Lý Tài Chính & Danh Mục Đầu Tư Cá Nhân (Mobile First)

Ứng dụng web tĩnh (HTML5, CSS3, JavaScript ES6) quản lý chi tiêu ngân sách và danh mục đầu tư cá nhân, được thiết kế tối ưu chuẩn giao diện **iPhone 15 Pro Max** và hỗ trợ triển khai miễn phí 100% trên **GitHub Pages**.

---

## 🌟 Tính Năng Mới & Cải Tiến Vượt Trội

1. **Thao Tác Lướt Vuốt (Swipe Navigation) Giữa Các Tab**:
   - Vuốt màn hình sang trái/phải để chuyển tab mượt mà theo thời gian thực (hỗ trợ cả chạm vuốt trên iPhone và kéo chuột trên máy tính).
   - Click trực tiếp vào tên tab ở thanh điều hướng để nhảy nhanh đến màn hình mong muốn.

2. **Thanh Tab Bar Tối Giản (Slim Dynamic Bar)**:
   - Thanh điều hướng mỏng nhẹ, tinh tế (chỉ 50px) không che khuất nội dung.
   - Hiển thị tên tab dạng thanh: **Đang ở tab nào thì tên tab đó phóng to nổi bật** (13.5px, in đậm, đèn tín hiệu sáng bên dưới), các tab khác thu nhỏ lại (10.5px, mờ nhẹ) giúp tập trung tầm nhìn.

3. **Dashboard Mới - Chống Tràn Chữ Trên Điện Thoại**:
   - Tối ưu kích thước chữ với `clamp()` và bo viền thông minh, cam kết **không bị đè chữ, tràn số hay vỡ giao diện** trên màn hình điện thoại.
   - **Mặc định 2 nút chọn nhanh**:
     - `[ Kì mới nhất (T9/26) ]`: Xem ngay kì lương gần nhất.
     - `[ Tổng các kì ]`: Thống kê tổng hợp lũy kế tất cả các kì (tổng thu nhập, tổng chi, tổng tích lũy, cơ cấu chi).
   - **Nút lọc thông minh (Icon Filter)**: Mở danh sách chọn nhanh kì cụ thể bất kỳ kèm nút xóa lọc quay về tức thì.

4. **Chức Năng Mới: "Truy Vấn Số Liệu" (Thay thế mục Cài đặt)**:
   - Bộ lọc thời gian linh hoạt:
     - *Toàn bộ thời gian*
     - *Năm 2026*
     - *Tùy chọn khoảng thời gian* (Từ kì... Đến kì...)
   - 4 chỉ số thống kê chuyên sâu: Tổng thu nhập, Chi phí bình quân/tháng, Tổng tích lũy & đầu tư, Tiền tiêu tự do.
   - Biểu đồ thanh xếp hạng các khoản chi tiêu lớn nhất trong kì truy vấn.
   - Bảng tổng hợp chi tiết thu nhập & tích lũy từng tháng trong khoảng lọc.
   - Tích hợp sẵn công cụ **Sao Lưu (Export) / Khôi Phục (Import) File JSON**.

5. **Khai Báo Kì Lương & Công Thức Tự Động Tính Toán**:
   - Dữ liệu khởi đầu: Giữ chuẩn duy nhất bản ghi **Tháng 9/2026** từ file Excel của bạn (`MB - IT Risk - CV lv1`).
   - Công thức tự động:
     $$\text{Thực nhận} = \text{Lương Gross} - \text{Thuế \& Khấu trừ} + \text{Thưởng \& Thêm}$$
     $$\text{Nhu cầu thiết yếu} = \sum \text{Các mục con (ChatGPT, Cắt tóc, Mạng, BCS...)}$$
     $$\text{Tiền tiêu còn lại} = \text{Thực nhận} - (\text{Học} + \text{Bố mẹ} + \text{Tiết kiệm} + \text{Đầu tư} + \text{Thiết yếu})$$

6. **Danh Mục Đầu Tư & Sổ Thu Chi Khởi Đầu Sạch Sẽ**:
   - Danh mục đầu tư ban đầu để trống hoàn toàn, sẵn sàng để bạn tự do khai báo các rỏ tài sản thực tế và số vốn của mình.

---

## 🚀 Hướng Dẫn Triển Khai Lên GitHub Pages (2 Phút)

### Bước 1: Khởi tạo Git và Commit
Mở terminal tại thư mục dự án và chạy các lệnh sau:

```bash
git add .
git commit -m "feat: Nang cap giao dien vuot swipe, tab bar dong va tinh nang truy van so lieu"
```

### Bước 2: Đẩy lên GitHub
```bash
git branch -M main
git remote add origin https://github.com/<tai-khoan-cua-ban>/<ten-repo>.git
git push -u origin main
```

### Bước 3: Bật GitHub Pages
1. Vào repository trên GitHub &rarr; Chọn tab **Settings** &rarr; **Pages**.
2. Tại mục **Build and deployment**:
   - **Source**: Chọn `Deploy from a branch`.
   - **Branch**: Chọn `main` và thư mục `/(root)` &rarr; Nhấn **Save**.
3. Chờ khoảng 1 phút, GitHub sẽ cung cấp link truy cập:
   `https://<tai-khoan-cua-ban>.github.io/<ten-repo>/`

---

## 📱 Cài Đặt Vào iPhone 15 Pro Max Như Một Ứng Dụng Native

1. Mở link GitHub Pages trên trình duyệt **Safari** của iPhone.
2. Bấm nút **Chia sẻ (Share)** ở thanh công cụ dưới Safari.
3. Chọn **"Thêm vào Màn hình chính" (Add to Home Screen)** &rarr; Bấm **Thêm (Add)**.
4. Mở app trực tiếp từ màn hình chính để tận hưởng cảm giác vuốt lướt toàn màn hình như ứng dụng native iOS!

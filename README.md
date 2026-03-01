# SWD392_Group3 — Frontend

Mô tả ngắn: Frontend của project SWD392 (Vite + React + TypeScript + Tailwind).

## Mục đích file này
Tại đây bạn có thể dán các lệnh `npm install` cần thiết để setup môi trường lần đầu (nếu bạn muốn cài từng package riêng). Nếu không, chỉ cần chạy `npm install` để cài theo `package.json`.

## Cách sử dụng
1. Clone repo:

```bash
git clone <repo-url>
cd SWD392_Group3
```

2. (Tùy chọn) Dán các lệnh cài thư viện vào mục `Cài thư viện` bên dưới và chạy chúng. Ví dụ:

```bash
# Ví dụ (bạn có thể thay / thêm các lệnh ở đây):
# npm install lucide-react
# npm install recharts
# npm install lines-and-columns
```

3. Hoặc chỉ chạy (cách chuẩn):

```bash
npm install
```

4. Chạy dev server:

```bash
npm run dev
```

## Ghi chú
- `node_modules/` thường được ignore bởi git. Bạn có thể thêm hoặc chỉnh `.gitignore` tùy ý nhưng hiện mình sẽ không thay đổi file đó.
- Nếu gặp lỗi plugin PostCSS (ví dụ thiếu `lines-and-columns`), bạn có thể cài riêng:

```bash
npm install lines-and-columns
```

- Nếu có lỗi dependency hỏng, thử xoá `node_modules` và `package-lock.json`, sau đó chạy `npm install` lại.

---

Bạn muốn mình chèn sẵn danh sách các lệnh `npm install` dựa trên gói đang có trong project không (mình có thể liệt kê những package thường thiếu)?
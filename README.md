# HỆ THỐNG QUẢN LÝ SỰ KIỆN (EVENT MANAGEMENT SYSTEM)
- **Sinh viên thực hiện:** Khoàng Tuấn Hùng
- **Mã số sinh viên (MSSV):** dtc245200378
- **Lớp / Khóa:** CNTT K23G / K23

## 1. Cấu trúc hệ thống
Hệ thống triển khai bằng Docker Compose gồm các dịch vụ:
- **Web App:** Node.js (Cổng nội bộ 8000)
- **Database:** PostgreSQL + pgAdmin (Cổng 5050)
- **Reverse Proxy:** Nginx (Cổng 80/443) có áp dụng Security Headers
- **Monitoring:** Prometheus + Grafana (Cổng 3000)
- **Logging:** Loki (Cổng 3100) + Promtail

## 2. Hướng dẫn khởi chạy


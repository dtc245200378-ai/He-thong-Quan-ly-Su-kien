# 🎪 Event Management System (Hệ thống Quản lý Sự kiện)
> Hệ thống quản lý sự kiện Full-Stack đóng gói tự động dưới dạng **8 Containers Docker** tích hợp hạ tầng giám sát tập trung **Observability Stack** (Prometheus, Grafana, Loki, Promtail).

---

## 📐 Kiến trúc Hệ thống (8-Container Stack)

Hệ thống được chia thành 3 nhóm dịch vụ chính:

| Tầng chức năng | Container Name | Image | Cổng Mở (Port) | Vai trò & Chức năng |
| :--- | :--- | :--- | :--- | :--- |
| **Web & Proxy** | `event_management_system-nginx-1` | `nginx:alpine` | `80:80` | Reverse Proxy tiếp nhận request và chuyển tiếp tới WebApp |
| | `event_management_system-webapp-1` | `node:18-alpine` | `3000` (Internal) | Core Application (Node.js/Express) xử lý logic nghiệp vụ |
| **Database** | `event_management_system-postgres-1` | `postgres:15` | `5432:5432` | Cơ sở dữ liệu chính (Sử dụng Named Volume `pgdata` lưu trữ bền vững) |
| | `event_management_system-pgadmin-1` | `dpage/pgadmin4` | `5050:80` | Giao diện Web GUI quản trị cơ sở dữ liệu PostgreSQL |
| **Monitoring & Logs**| `event_management_system-prometheus-1` | `prom/prometheus` | `9090:9090` | Thu thập metrics hiệu năng hệ thống định kỳ |
| | `event_management_system-grafana-1` | `grafana/grafana` | `3000:3000` | Trực quan hóa Metrics & Logs trên Dashboard chung |
| | `event_management_system-loki-1` | `grafana/loki:2.9.0` | `3100:3100` | Hệ thống lưu trữ và quản lý nhật ký tập trung (Log Aggregator) |
| | `event_management_system-promtail-1` | `grafana/promtail:2.9.0` | N/A | Gom log từ các Container và đẩy về Loki theo thời gian thực |

---

## 📁 Cấu trúc Thư mục Dự án

```text
Event_Management_System/
├── app/
│   ├── server.js              # Mã nguồn ứng dụng Node.js/Express (Port 3000)
│   └── package.json           # Danh sách phụ thuộc (Express, PG, v.v.)
├── nginx/
│   └── nginx.conf             # Cấu hình Reverse Proxy chuyển hướng sang webapp:3000
├── prometheus/
│   └── prometheus.yml         # Cấu hình thu thập Metrics từ các node
├── loki/
│   └── loki-config.yaml       # Cấu hình lưu trữ log cho Loki
├── promtail/
│   └── promtail-config.yaml   # Cấu hình gom log từ Docker containers
├── docker-compose.yml         # File định nghĩa & orchestrate toàn bộ 8 containers
└── README.md                  # Tài liệu hướng dẫn đồ án
```
---

## 🚀 Hướng dẫn Triển khai & Khởi chạy

### 1. Yêu cầu Tiền đề (Prerequisites)
- **OS:** Ubuntu 20.04/22.04 LTS (hoặc các hệ điều hành Linux tương đương)
- **Engine:** Docker `v20.10+` và Docker Compose `v2.0+`
- **Git**

### 2. Khởi chạy Hệ thống
```bash
# Clone repository về máy
git clone [https://github.com/dtc245200378-ai/He-thong-Quan-ly-Su-kien.git](https://github.com/dtc245200378-ai/He-thong-Quan-ly-Su-kien.git)
cd He-thong-Quan-ly-Su-kien

# Tái tạo image và khởi chạy toàn bộ 8 containers dưới dạng background
sudo docker compose up -d --build
3. Kiểm tra Trạng thái Vận hành
Bash
# Kiểm tra trạng thái 8 containers
sudo docker compose ps

# Kiểm tra phản hồi kết nối từ Nginx
curl -I http://localhost/
# Kết quả kỳ vọng: HTTP/1.1 200 OK
🔗 Truy cập các Dịch vụ (Endpoints)
(Lưu ý: Thay localhost bằng địa chỉ IP máy chủ ảo Ubuntu của bạn, ví dụ: 192.168.240.129)

🌐 Website Quản lý Sự kiện: http://localhost/ (qua Nginx Proxy)

🗄️ Quản trị Database (PgAdmin): http://localhost:5050 (User: admin@admin.com | Pass: admin)

Thông số kết nối Database: Host: postgres, Port: 5432, DB: event_db, User: user, Pass: password

📊 Grafana Dashboard: http://localhost:3000 (User: admin | Pass: admin)

📈 Prometheus Server: http://localhost:9090

🪵 Loki Log Engine: http://localhost:3100

🛡️ Điểm nổi bật về Hạ tầng & Bảo mật (Hardening)
Data Persistence: Dữ liệu PostgreSQL không bị mất khi hạ container nhờ Docker Volume pgdata.

Network Isolation: WebApp không mở cổng trực tiếp ra ngoài Internet mà chỉ giao tiếp nội bộ qua lớp Reverse Proxy Nginx.

Security Headers: Cấu hình Nginx bổ sung các HTTP headers chống tấn công web phổ biến.

Real-time Observability: Mọi log lỗi và thông số RAM/CPU/Request Rate đều được giám sát thời gian thực trên Grafana.

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('<h1>Chào mừng đến với Hệ thống Quản lý Sự kiện</h1><p>Hệ thống Web, DB, Nginx và Giám sát đã hoạt động!</p>');
});

app.listen(port, () => {
  console.log(`Event WebApp đang chạy ở cổng ${port}`);
});

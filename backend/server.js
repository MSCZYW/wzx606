/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：后端入口，Express + CORS + 静态资源托管，端口 8606
 */
const express = require('express');
const cors = require('cors');
const path = require('path');

const wzx_indexRoutes = require('./routes/wzx_indexRoutes');
const wzx_dbTestRoutes = require('./routes/wzx_dbTestRoutes');
const wzx_newsRoutes = require('./routes/wzx_newsRoutes');
const wzx_galleryRoutes = require('./routes/wzx_galleryRoutes');
const wzx_chatRoutes = require('./routes/wzx_chatRoutes');

const app = express();

// 开放全部跨域（仅用于课程作业）
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 托管前端静态资源目录
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// 所有接口以 /api/ 为前缀
app.use('/api', wzx_indexRoutes);
app.use('/api', wzx_dbTestRoutes);
app.use('/api', wzx_newsRoutes);
app.use('/api', wzx_galleryRoutes);
app.use('/api', wzx_chatRoutes);

// 统一 404（JSON 格式）
app.use((req, res) => {
  res.status(404).json({ code: 404, msg: '接口不存在', data: null });
});

// 统一错误处理
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
});

const PORT = 8606;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

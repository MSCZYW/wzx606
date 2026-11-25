/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：图像识别路由：上传图片返回描述
 */
const express = require('express');
const multer = require('multer');
const wzx_visionController = require('../controllers/wzx_visionController');

const router = express.Router();

// 内存存储，限制 10MB
const wzxUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// POST /api/vision/describe 上传图片（表单字段名：wzx_image）返回描述
router.post('/vision/describe', wzxUpload.single('wzx_image'), wzx_visionController.wzx_describe);

module.exports = router;

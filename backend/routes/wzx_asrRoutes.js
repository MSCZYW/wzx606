/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：语音识别路由：上传音频转文字
 */
const express = require('express');
const multer = require('multer');
const wzx_asrController = require('../controllers/wzx_asrController');

const router = express.Router();

// 内存存储，限制 20MB
const wzxUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }
});

// POST /api/asr/recognize 上传音频（表单字段名：wzx_audio）返回转写文字
router.post('/asr/recognize', wzxUpload.single('wzx_audio'), wzx_asrController.wzx_recognize);

module.exports = router;

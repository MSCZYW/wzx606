/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：知识库路由（RAG）：文件上传/列表/删除 + 基于知识库问答
 */
const express = require('express');
const multer = require('multer');
const wzx_kbController = require('../controllers/wzx_kbController');

const router = express.Router();

// 内存存储，限制 10MB
const wzxUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// POST /api/kb/upload 上传知识库文件（表单字段名：wzx_file）
router.post('/kb/upload', wzxUpload.single('wzx_file'), wzx_kbController.wzx_upload);

// GET /api/kb/files 知识库文件列表
router.get('/kb/files', wzx_kbController.wzx_listFiles);

// DELETE /api/kb/files/:id 删除知识库文件
router.delete('/kb/files/:id', wzx_kbController.wzx_deleteFile);

// POST /api/kb/ask 基于知识库的 RAG 问答
router.post('/kb/ask', wzx_kbController.wzx_ask);

module.exports = router;

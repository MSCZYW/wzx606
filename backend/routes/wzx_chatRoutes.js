/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：在线客服路由
 */
const express = require('express');
const wzx_chatController = require('../controllers/wzx_chatController');

const router = express.Router();

// POST /api/chat 发送消息获取 AI 客服回复
router.post('/chat', wzx_chatController.wzx_sendMessage);

module.exports = router;

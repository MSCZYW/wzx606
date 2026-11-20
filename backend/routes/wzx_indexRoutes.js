/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：站点信息接口路由，/api/ 前缀
 */
const express = require('express');
const router = express.Router();
const wzx_indexController = require('../controllers/wzx_indexController');

// GET /api/wzx_info 站点基本信息
router.get('/wzx_info', wzx_indexController.wzx_getSiteInfo);

module.exports = router;

/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：新闻路由，/api/ 前缀
 */
const express = require('express');
const router = express.Router();
const wzx_newsController = require('../controllers/wzx_newsController');

// GET /api/news 获取全部新闻（按发布时间倒序）
router.get('/news', wzx_newsController.wzx_getNewsList);

module.exports = router;

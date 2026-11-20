/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：数据库连接测试路由，/api/ 前缀
 */
const express = require('express');
const router = express.Router();
const wzx_dbTestController = require('../controllers/wzx_dbTestController');

// POST /api/db-test 测试 MySQL 连接
router.post('/db-test', wzx_dbTestController.wzx_testConnection);

module.exports = router;

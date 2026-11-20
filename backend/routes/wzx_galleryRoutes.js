/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：图文路由，/api/ 前缀
 */
const express = require('express');
const router = express.Router();
const wzx_galleryController = require('../controllers/wzx_galleryController');

// GET /api/gallery 获取全部图文数据（按创建时间倒序）
router.get('/gallery', wzx_galleryController.wzx_getGalleryList);

module.exports = router;

/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：图文控制器
 */
const wzx_galleryModel = require('../models/wzx_galleryModel');

const wzx_galleryController = {
  // GET /api/gallery
  async wzx_getGalleryList(req, res) {
    try {
      const wzx_list = await wzx_galleryModel.wzx_getAllGallery();
      res.json({
        code: 0,
        msg: '获取图文列表成功',
        data: wzx_list
      });
    } catch (err) {
      console.error('查询图文失败：', err.message);
      res.json({
        code: 1,
        msg: '获取图文列表失败：' + err.message,
        data: null
      });
    }
  }
};

module.exports = wzx_galleryController;

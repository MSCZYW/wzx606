/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：图文数据模型，封装 wzx_gallery 表查询
 */
const wzx_pool = require('./wzx_db');

const wzx_galleryModel = {
  // 查询全部图文数据，按创建时间倒序
  async wzx_getAllGallery() {
    const [rows] = await wzx_pool.query(
      'SELECT id, title, description, img_url, category, create_time FROM wzx_gallery ORDER BY create_time DESC'
    );
    return rows;
  }
};

module.exports = wzx_galleryModel;

/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：新闻数据模型，封装 wzx_news 表查询
 */
const wzx_pool = require('./wzx_db');

const wzx_newsModel = {
  // 查询全部新闻，按发布时间倒序
  async wzx_getAllNews() {
    const [rows] = await wzx_pool.query(
      'SELECT id, title, summary, content, source, publish_time, cover_img FROM wzx_news ORDER BY publish_time DESC'
    );
    return rows;
  }
};

module.exports = wzx_newsModel;

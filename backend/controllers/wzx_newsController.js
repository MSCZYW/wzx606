/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：新闻控制器
 */
const wzx_newsModel = require('../models/wzx_newsModel');

const wzx_newsController = {
  // GET /api/news
  async wzx_getNewsList(req, res) {
    try {
      const wzx_list = await wzx_newsModel.wzx_getAllNews();
      res.json({
        code: 0,
        msg: '获取新闻列表成功',
        data: wzx_list
      });
    } catch (err) {
      console.error('查询新闻失败：', err.message);
      res.json({
        code: 1,
        msg: '获取新闻列表失败：' + err.message,
        data: null
      });
    }
  }
};

module.exports = wzx_newsController;

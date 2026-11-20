/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：站点信息控制器
 */
const wzx_indexController = {
  // GET /api/wzx_info
  wzx_getSiteInfo(req, res) {
    res.json({
      code: 0,
      msg: '获取站点信息成功',
      data: {
        wzx_student_name: '王治贤',
        wzx_student_id: '24002120606',
        wzx_project_name: '拾光集市（校园二手交易平台）',
        wzx_project_type: '自选'
      }
    });
  }
};

module.exports = wzx_indexController;

/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：图像识别 Controller：接收上传的图片，调用视觉模型返回描述
 */
const wzx_visionService = require('../services/wzx_visionService');

// 允许上传的图片类型
const wzxAllowedTypes = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/bmp': 'bmp'
};

const wzx_visionController = {
  /** POST /api/vision/describe 上传图片并返回描述 */
  async wzx_describe(req, res) {
    try {
      if (!req.file) {
        return res.json({ code: 1, msg: '请选择要识别的图片', data: null });
      }
      if (!wzxAllowedTypes[req.file.mimetype]) {
        return res.json({
          code: 1,
          msg: '暂不支持该类型：' + req.file.mimetype + '，请上传 png / jpg / webp / gif / bmp 图片',
          data: null
        });
      }

      console.log(`[图像识别] 收到图片：${req.file.mimetype}，${req.file.size} 字节`);

      const wzxDescription = await wzx_visionService.describeImage({
        base64: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype
      });

      return res.json({
        code: 0,
        msg: '识别成功',
        data: {
          wzx_description: wzxDescription,
          wzx_model: process.env.SILICONFLOW_VISION_MODEL || 'Qwen/Qwen3-VL-8B-Instruct',
          wzx_file_type: wzxAllowedTypes[req.file.mimetype],
          wzx_file_size: req.file.size
        }
      });
    } catch (err) {
      console.error('[图像识别] 识别失败：', err.message);
      return res.json({ code: 1, msg: '图像识别失败：' + err.message, data: null });
    }
  }
};

module.exports = wzx_visionController;

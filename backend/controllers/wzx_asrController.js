/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：语音识别 Controller：接收上传的音频，转写为文字
 */
const wzx_asrService = require('../services/wzx_asrService');

// 允许上传的音频扩展名
const wzxAllowedExts = ['wav', 'mp3', 'm4a', 'webm', 'ogg', 'opus', 'aac', 'flac'];

const wzx_asrController = {
  /** POST /api/asr/recognize 上传音频返回转写文字 */
  async wzx_recognize(req, res) {
    try {
      if (!req.file) {
        return res.json({ code: 1, msg: '请上传音频文件或录制一段语音', data: null });
      }
      const wzxExt = (req.file.originalname || '').toLowerCase().split('.').pop() || 'wav';
      if (wzxAllowedExts.indexOf(wzxExt) === -1) {
        return res.json({
          code: 1,
          msg: '暂不支持 .' + wzxExt + ' 音频格式，请使用 wav / mp3 / m4a / webm / ogg / flac',
          data: null
        });
      }
      if (req.file.size < 100) {
        return res.json({ code: 1, msg: '音频内容为空或过短', data: null });
      }

      console.log(`[语音识别] 收到音频：${wzxExt}，${req.file.size} 字节`);

      const wzxResult = await wzx_asrService.recognize(req.file.buffer, wzxExt);

      return res.json({
        code: 0,
        msg: '识别成功',
        data: {
          wzx_text: wzxResult.wzx_text,
          wzx_provider: wzxResult.wzx_provider,
          wzx_model: wzxResult.wzx_model,
          wzx_language: wzxResult.wzx_language || '',
          wzx_file_size: req.file.size
        }
      });
    } catch (err) {
      console.error('[语音识别] 识别失败：', err.message);
      return res.json({ code: 1, msg: '语音识别失败：' + err.message, data: null });
    }
  }
};

module.exports = wzx_asrController;

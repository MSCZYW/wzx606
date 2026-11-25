/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：在线客服 Controller，POST /api/chat 接收用户消息，
 *       保存记录 -> 拼接上下文 -> 调用硅基流动 -> 保存并返回 AI 回复
 */
const wzx_chatModel = require('../models/wzx_chatModel');
const wzx_customerService = require('../services/wzx_customerService');

const wzx_chatController = {
  /** 发送消息并获取 AI 客服回复 */
  async wzx_sendMessage(req, res) {
    try {
      const wzxMessage = (req.body && req.body.wzx_message || '').trim();
      let wzxSessionId = (req.body && req.body.wzx_session_id || '').trim();
      const wzxProvider = (req.body && req.body.wzx_provider || '').trim();

      if (!wzxMessage) {
        return res.json({ code: 1, msg: '消息内容不能为空', data: null });
      }
      if (wzxMessage.length > 500) {
        return res.json({ code: 1, msg: '消息内容过长（最多500字）', data: null });
      }
      // 未传会话ID则自动生成
      if (!wzxSessionId) {
        wzxSessionId = 'wzx_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      }

      // 1. 保存用户消息
      await wzx_chatModel.saveMessage(wzxSessionId, 'user', wzxMessage);

      // 2. 取最近 10 条记录作为上下文（已含当前消息）
      const wzxHistory = await wzx_chatModel.getRecentMessages(wzxSessionId, 10);

      // 3. 调用指定服务商获取 AI 回复（硅基流动 / 七牛 热切换）
      const wzxReply = await wzx_customerService.getReply(wzxHistory, wzxProvider);
      const wzxUsedProvider = wzx_customerService.wzx_resolveProvider(wzxProvider);

      // 4. 保存 AI 回复
      await wzx_chatModel.saveMessage(wzxSessionId, 'assistant', wzxReply);

      console.log(`[客服] 会话 ${wzxSessionId} -> 回复成功`);
      return res.json({
        code: 0,
        msg: '回复成功',
        data: {
          wzx_reply: wzxReply,
          wzx_session_id: wzxSessionId,
          wzx_provider: wzxUsedProvider
        }
      });
    } catch (err) {
      console.error('[客服] 回复失败：', err.message);
      return res.json({ code: 1, msg: '客服暂时开小差了：' + err.message, data: null });
    }
  }
};

module.exports = wzx_chatController;

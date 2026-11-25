/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：硅基流动 AI 客服 Service，调用 Qwen2.5-7B-Instruct 生成客服回复。
 *       API Key 等凭据全部从 backend/.env 读取，不写死在代码里。
 */
const wzx_customerService = {
  /** 客服人设：校园二手交易平台"拾光集市"的在线客服 */
  wzx_systemPrompt:
    '你是"拾光集市"校园二手交易平台的在线客服，名叫小拾。' +
    '平台业务：学生发布和购买二手商品（数码、图书、运动、生活用品），支持当面交易和站内沟通。' +
    '回答要求：1）友好简洁，每次回复不超过150字；2）只回答与平台业务、二手交易相关的问题；' +
    '3）交易安全提醒：建议当面验货、选择校内交易；4）遇到无法回答的问题，引导用户联系平台管理员。',

  /** 调用硅基流动 Chat Completions 接口，返回 AI 回复文本 */
  async getReply(wzxHistory) {
    const wzxApiKey = process.env.SILICONFLOW_API_KEY;
    const wzxBaseUrl = process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1';
    const wzxModel = process.env.SILICONFLOW_MODEL || 'Qwen/Qwen2.5-7B-Instruct';

    if (!wzxApiKey) {
      throw new Error('缺少 SILICONFLOW_API_KEY 配置，请在 backend/.env 中填写');
    }

    const wzxMessages = [
      { role: 'system', content: this.wzx_systemPrompt },
      ...wzxHistory.map(m => ({
        role: m.wzx_role === 'assistant' ? 'assistant' : 'user',
        content: m.wzx_content
      }))
    ];

    const wzxResp = await fetch(wzxBaseUrl + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + wzxApiKey
      },
      body: JSON.stringify({
        model: wzxModel,
        messages: wzxMessages,
        temperature: 0.7,
        max_tokens: 512,
        stream: false
      }),
      signal: AbortSignal.timeout(60000)
    });

    if (!wzxResp.ok) {
      const wzxText = await wzxResp.text();
      throw new Error(`硅基流动接口返回 ${wzxResp.status}：${wzxText}`);
    }

    const wzxData = await wzxResp.json();
    const wzxReply =
      wzxData && wzxData.choices && wzxData.choices[0] && wzxData.choices[0].message
        ? wzxData.choices[0].message.content
        : '';
    if (!wzxReply) {
      throw new Error('硅基流动返回内容为空');
    }
    return wzxReply.trim();
  }
};

module.exports = wzx_customerService;

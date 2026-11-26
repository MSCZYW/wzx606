/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：语音识别（ASR）Service。
 *       优先调用七牛网关的 Qwen-Audio-3.0-ASR-Flash（OpenAI 兼容 chat/completions + input_audio）；
 *       若七牛账户未开通该模型通道，则自动降级调用硅基流动 /audio/transcriptions
 *       （Qwen/Qwen3-ASR-1.7B，同为 Qwen 语音识别模型）。
 *       模型名与 Key 全部从 backend/.env 读取；控制台输出发送/接收的数据（base64 截断展示）。
 */
const wzx_asrService = {
  /** 方案一：七牛 Qwen-Audio-3.0-ASR-Flash（chat/completions + input_audio） */
  async wzx_viaQiniu(wzxBuffer, wzxFormat) {
    const wzxApiKey = process.env.QINIU_CUSTOMER_SERVICE_API_KEY;
    const wzxBaseUrl = process.env.QINIU_CUSTOMER_SERVICE_BASE_URL || 'https://api.qnaigc.com/v1';
    const wzxModel = process.env.QINIU_ASR_MODEL || 'Qwen-Audio-3.0-ASR-Flash';

    if (!wzxApiKey) throw new Error('缺少 QINIU_CUSTOMER_SERVICE_API_KEY 配置');

    const wzxB64 = wzxBuffer.toString('base64');
    const wzxBody = {
      model: wzxModel,
      messages: [{
        role: 'user',
        content: [
          { type: 'input_audio', input_audio: { data: wzxB64, format: wzxFormat } },
          { type: 'text', text: '请把这段语音逐字转写成文字，只输出转写结果。' }
        ]
      }]
    };

    console.log('===== 发送给七牛 ASR（' + wzxModel + '）的数据 =====');
    console.log(JSON.stringify({
      model: wzxModel,
      messages: [{
        role: 'user',
        content: [
          { type: 'input_audio', input_audio: { data: '(base64 音频，共 ' + wzxB64.length + ' 字符)', format: wzxFormat } },
          { type: 'text', text: '请把这段语音逐字转写成文字，只输出转写结果。' }
        ]
      }]
    }, null, 2));

    const wzxResp = await fetch(wzxBaseUrl + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + wzxApiKey },
      body: JSON.stringify(wzxBody),
      signal: AbortSignal.timeout(90000)
    });

    const wzxText = await wzxResp.text();
    console.log('===== 七牛 ASR 返回的数据（HTTP ' + wzxResp.status + '）=====');
    console.log(wzxText.slice(0, 800));

    if (!wzxResp.ok) {
      throw new Error('七牛 ASR HTTP ' + wzxResp.status + '：' + wzxText.slice(0, 200));
    }
    const wzxData = JSON.parse(wzxText);
    const wzxContent =
      wzxData && wzxData.choices && wzxData.choices[0] && wzxData.choices[0].message
        ? wzxData.choices[0].message.content
        : '';
    if (!wzxContent) throw new Error('七牛 ASR 返回内容为空');
    return { wzx_text: wzxContent.trim(), wzx_provider: 'qiniu', wzx_model: wzxModel };
  },

  /** 方案二（降级）：硅基流动 /audio/transcriptions */
  async wzx_viaSiliconflow(wzxBuffer, wzxFormat) {
    const wzxApiKey = process.env.SILICONFLOW_API_KEY;
    const wzxBaseUrl = process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1';
    const wzxModel = process.env.SILICONFLOW_ASR_MODEL || 'Qwen/Qwen3-ASR-1.7B';

    if (!wzxApiKey) throw new Error('缺少 SILICONFLOW_API_KEY 配置');

    console.log('===== 降级：调用硅基流动 ASR（' + wzxModel + '）=====');
    console.log('发送：multipart/form-data，file=音频文件（' + wzxBuffer.length + ' 字节，' + wzxFormat + '），model=' + wzxModel);

    const wzxForm = new FormData();
    wzxForm.append('file', new Blob([wzxBuffer], { type: 'audio/' + wzxFormat }), 'audio.' + wzxFormat);
    wzxForm.append('model', wzxModel);

    const wzxResp = await fetch(wzxBaseUrl + '/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + wzxApiKey },
      body: wzxForm,
      signal: AbortSignal.timeout(90000)
    });

    const wzxText = await wzxResp.text();
    console.log('===== 硅基流动 ASR 返回的数据（HTTP ' + wzxResp.status + '）=====');
    console.log(wzxText.slice(0, 800));

    if (!wzxResp.ok) {
      throw new Error('硅基流动 ASR HTTP ' + wzxResp.status + '：' + wzxText.slice(0, 200));
    }
    const wzxData = JSON.parse(wzxText);
    if (!wzxData.text || !wzxData.text.trim()) {
      throw new Error('未识别到语音内容（录音可能是静音、噪声或时长过短），请靠近麦克风重试');
    }
    return {
      wzx_text: wzxData.text,
      wzx_provider: 'siliconflow',
      wzx_model: wzxModel,
      wzx_language: wzxData.language || ''
    };
  },

  /** 统一入口：先试七牛，失败自动降级硅基流动 */
  async recognize(wzxBuffer, wzxFormat) {
    try {
      return await this.wzx_viaQiniu(wzxBuffer, wzxFormat);
    } catch (wzxQiniuErr) {
      console.error('[语音识别] 七牛通道不可用，自动降级：' + wzxQiniuErr.message);
      return await this.wzx_viaSiliconflow(wzxBuffer, wzxFormat);
    }
  }
};

module.exports = wzx_asrService;

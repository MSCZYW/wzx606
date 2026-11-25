/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：图像识别 Service：调用硅基流动视觉模型（Qwen/Qwen3-VL-8B-Instruct，
 *       模型名与 Key 均从 backend/.env 读取）描述上传的图片。
 *       在控制台输出发送给大模型的数据（base64 截断展示）和大模型返回的数据。
 */
const wzx_visionService = {
  wzx_prompt:
    '你是图像识别助手。请用中文简洁描述这张图片的内容：' +
    '先一句话概括图片主体，再补充 2-3 个关键细节（场景、颜色、风格等），总共不超过 150 字。',

  /** 调用视觉模型描述图片，wzxImage 为 { base64, mimeType } */
  async describeImage(wzxImage) {
    const wzxApiKey = process.env.SILICONFLOW_API_KEY;
    const wzxBaseUrl = process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1';
    const wzxModel = process.env.SILICONFLOW_VISION_MODEL || 'Qwen/Qwen3-VL-8B-Instruct';

    if (!wzxApiKey) {
      throw new Error('缺少 SILICONFLOW_API_KEY 配置，请在 backend/.env 中填写');
    }

    const wzxDataUrl = 'data:' + wzxImage.mimeType + ';base64,' + wzxImage.base64;
    const wzxMessages = [
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: wzxDataUrl } },
          { type: 'text', text: this.wzx_prompt }
        ]
      }
    ];

    // 控制台输出发送的数据（base64 太长，截断展示前 60 字符）
    console.log('===== 发送给视觉模型的数据（模型：' + wzxModel + '）=====');
    console.log(JSON.stringify({
      model: wzxModel,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: wzxDataUrl.slice(0, 60) + '…(base64 截断，共 ' + wzxDataUrl.length + ' 字符)' } },
            { type: 'text', text: this.wzx_prompt }
          ]
        }
      ]
    }, null, 2));

    const wzxResp = await fetch(wzxBaseUrl + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + wzxApiKey
      },
      body: JSON.stringify({
        model: wzxModel,
        messages: wzxMessages,
        max_tokens: 300,
        stream: false
      }),
      signal: AbortSignal.timeout(90000)
    });

    if (!wzxResp.ok) {
      const wzxText = await wzxResp.text();
      throw new Error('视觉模型接口返回 ' + wzxResp.status + '：' + wzxText);
    }

    const wzxResult = await wzxResp.json();

    // 控制台输出大模型返回的数据
    console.log('===== 视觉模型返回的数据 =====');
    console.log(JSON.stringify(wzxResult, null, 2));

    const wzxReply =
      wzxResult && wzxResult.choices && wzxResult.choices[0] && wzxResult.choices[0].message
        ? wzxResult.choices[0].message.content
        : '';
    if (!wzxReply) {
      throw new Error('视觉模型返回内容为空');
    }
    return wzxReply.trim();
  }
};

module.exports = wzx_visionService;

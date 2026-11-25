/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：AI 客服 Service（多平台热切换版）。
 *       支持硅基流动 / 七牛两个服务商，凭据全部从 backend/.env 读取，不写死在代码里。
 *       默认服务商由 AI_PROVIDER 决定，前端请求可用 wzx_provider 参数临时切换。
 *       客服人设：中华美食街在线客服（提示词工程任务二）。
 */
const wzx_customerService = {
  /**
   * 客服人设 system 提示词（任务二：提示词工程）
   * 设计要点：
   *  1. 身份唯一 —— 只承认自己是"中华美食街在线客服"，抹掉其他一切可能性；
   *  2. 白名单前置 —— 一开始就声明"只回答三类问题"，把范围说死；
   *  3. 拒答话术固定 —— 给出统一的拒答句式，模型照着抄即可，不需要临场发挥；
   *  4. 用"不确定就拒答"兜底 —— 防止模型自由发挥编造答案；
   *  5. 输出格式约束 —— 控制字数，避免长篇大论跑题。
   */
  wzx_systemPrompt:
    '你是"中华美食街"的在线客服，名字叫福福。\n' +
    '你的职责只有一个：回答以下三类问题，其他任何问题一律不回答。\n' +
    '（1）营业时间：美食街每天 10:00-22:00 营业，周末及节假日正常营业，夜市档口延长至 23:00。\n' +
    '（2）招牌菜：一楼川湘阁的招牌是麻辣香锅和水煮鱼，二楼粤味轩的招牌是烧鹅饭和虾饺，' +
    '三楼老面馆的招牌是牛肉拉面和葱油拌面，人气最高的是川湘阁的麻辣香锅。\n' +
    '（3）配送范围：美食街可配送到周边 5 公里以内，覆盖大学城、翠湖小区和科技园，' +
    '满 30 元免配送费，配送时间约 40 分钟。\n' +
    '对于上述三类问题之外的所有问题（包括写代码、写文章、数学题、闲聊、其他业务等），' +
    '你必须用固定话术拒绝："抱歉，我是美食街客服，只能为您解答营业时间、招牌菜、配送范围三类问题，' +
    '其他问题请您在留言板留言，工作人员会尽快回复您。"\n' +
    '如果有不确定的信息，宁可拒答也不要编造。\n' +
    '回答要友好简洁，每次不超过 100 字。',

  /** 服务商注册表：切换平台只读取这里和 .env 的配置 */
  wzx_providers: {
    siliconflow: {
      wzx_baseUrl: function () { return process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1'; },
      wzx_model: function () { return process.env.SILICONFLOW_MODEL || 'Qwen/Qwen2.5-7B-Instruct'; },
      wzx_apiKey: function () { return process.env.SILICONFLOW_API_KEY; }
    },
    qiniu: {
      wzx_baseUrl: function () { return process.env.QINIU_CUSTOMER_SERVICE_BASE_URL || 'https://api.qnaigc.com/v1'; },
      wzx_model: function () { return process.env.QINIU_CUSTOMER_SERVICE_MODEL || 'qiniu/conatus-free'; },
      wzx_apiKey: function () { return process.env.QINIU_CUSTOMER_SERVICE_API_KEY; }
    }
  },

  /** 根据请求参数解析服务商：wzx_provider 优先，默认取 .env 的 AI_PROVIDER */
  wzx_resolveProvider(wzxProvider) {
    var wzxName = (wzxProvider || process.env.AI_PROVIDER || 'siliconflow').toLowerCase();
    if (!this.wzx_providers[wzxName]) {
      wzxName = process.env.AI_PROVIDER || 'siliconflow';
    }
    return wzxName;
  },

  /** 调用指定服务商的 Chat Completions 接口，返回 AI 回复文本 */
  async getReply(wzxHistory, wzxProvider) {
    var wzxName = this.wzx_resolveProvider(wzxProvider);
    var wzxConf = this.wzx_providers[wzxName];
    var wzxApiKey = wzxConf.wzx_apiKey();
    var wzxBaseUrl = wzxConf.wzx_baseUrl();
    var wzxModel = wzxConf.wzx_model();

    if (!wzxApiKey) {
      throw new Error('缺少服务商 ' + wzxName + ' 的 API Key 配置，请在 backend/.env 中填写');
    }

    var wzxMessages = [
      { role: 'system', content: this.wzx_systemPrompt },
      ...wzxHistory.map(function (m) {
        return {
          role: m.wzx_role === 'assistant' ? 'assistant' : 'user',
          content: m.wzx_content
        };
      })
    ];

    var wzxResp = await fetch(wzxBaseUrl + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + wzxApiKey
      },
      body: JSON.stringify({
        model: wzxModel,
        messages: wzxMessages,
        temperature: 0.3,
        max_tokens: 256,
        stream: false
      }),
      signal: AbortSignal.timeout(60000)
    });

    if (!wzxResp.ok) {
      var wzxText = await wzxResp.text();
      throw new Error('服务商 ' + wzxName + ' 接口返回 ' + wzxResp.status + '：' + wzxText);
    }

    var wzxData = await wzxResp.json();
    var wzxReply =
      wzxData && wzxData.choices && wzxData.choices[0] && wzxData.choices[0].message
        ? wzxData.choices[0].message.content
        : '';
    if (!wzxReply) {
      throw new Error('服务商 ' + wzxName + ' 返回内容为空');
    }
    console.log('[客服] 由服务商 ' + wzxName + '（' + wzxModel + '）完成回复');
    return wzxReply.trim();
  }
};

module.exports = wzx_customerService;

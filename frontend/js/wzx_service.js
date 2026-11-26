/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：在线客服页面逻辑：调用 POST /api/chat（硅基流动 Qwen2.5-7B-Instruct），
 *       服务器返回的数据和错误信息均输出到浏览器控制台
 */
(function () {
  // ---------- canvas 背景粒子动画（与首页风格统一） ----------
  var wzx_canvas = document.getElementById('wzx_bg_canvas');
  var wzx_ctx = wzx_canvas.getContext('2d');
  var wzx_particles = [];

  function wzx_resize() {
    wzx_canvas.width = window.innerWidth;
    wzx_canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', wzx_resize);
  wzx_resize();

  for (var i = 0; i < 55; i++) {
    wzx_particles.push({
      x: Math.random() * wzx_canvas.width,
      y: Math.random() * wzx_canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.6 + 0.6
    });
  }

  (function wzx_draw() {
    wzx_ctx.clearRect(0, 0, wzx_canvas.width, wzx_canvas.height);
    wzx_ctx.fillStyle = 'rgba(160,180,255,0.55)';
    for (var i = 0; i < wzx_particles.length; i++) {
      var p = wzx_particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > wzx_canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > wzx_canvas.height) p.vy *= -1;
      wzx_ctx.beginPath();
      wzx_ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      wzx_ctx.fill();
      for (var j = i + 1; j < wzx_particles.length; j++) {
        var q = wzx_particles[j];
        var dx = p.x - q.x, dy = p.y - q.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          wzx_ctx.strokeStyle = 'rgba(160,180,255,' + (0.16 * (1 - dist / 130)) + ')';
          wzx_ctx.lineWidth = 1;
          wzx_ctx.beginPath();
          wzx_ctx.moveTo(p.x, p.y);
          wzx_ctx.lineTo(q.x, q.y);
          wzx_ctx.stroke();
        }
      }
    }
    requestAnimationFrame(wzx_draw);
  })();

  // ---------- 聊天逻辑 ----------
  // API 基地址：http 访问用同源；直接双击 html（file://）打开时指向后端 8606 端口
  var wzx_apiBase = (location.protocol === 'http:' || location.protocol === 'https:') ? '' : 'http://localhost:8606';
  var wzxApiUrl = (wzx_apiBase || window.location.origin) + '/api/chat';
  document.getElementById('wzx_api_url').textContent = '接口地址：' + wzxApiUrl;

  var wzxChatBox = document.getElementById('wzx_chat_box');
  var wzxForm = document.getElementById('wzx_input_form');
  var wzxInput = document.getElementById('wzx_input');
  var wzxSendBtn = document.getElementById('wzx_send_btn');
  var wzxClearBtn = document.getElementById('wzx_clear_btn');
  var wzxQuickList = document.getElementById('wzx_quick_list');
  var wzxProviderSelect = document.getElementById('wzx_provider_select');
  var wzxSending = false;

  // 会话ID：同一浏览器保持同一会话（有上下文记忆）
  var wzxSessionId = null;

  function wzx_addMsg(wzxRole, wzxText) {
    var row = document.createElement('div');
    row.className = 'wzx_msg_row ' + (wzxRole === 'user' ? 'wzx_msg_user' : 'wzx_msg_ai');
    var bubble = document.createElement('div');
    bubble.className = 'wzx_msg_bubble';
    bubble.textContent = wzxText;
    row.appendChild(bubble);
    wzxChatBox.appendChild(row);
    wzxChatBox.scrollTop = wzxChatBox.scrollHeight;
    return bubble;
  }

  function wzx_addLoading() {
    var row = document.createElement('div');
    row.className = 'wzx_msg_row wzx_msg_ai wzx_msg_loading';
    row.id = 'wzx_loading_row';
    var bubble = document.createElement('div');
    bubble.className = 'wzx_msg_bubble';
    bubble.textContent = '小拾正在思考中…';
    row.appendChild(bubble);
    wzxChatBox.appendChild(row);
    wzxChatBox.scrollTop = wzxChatBox.scrollHeight;
  }

  function wzx_removeLoading() {
    var row = document.getElementById('wzx_loading_row');
    if (row) row.parentNode.removeChild(row);
  }

  async function wzx_send(wzxText) {
    if (wzxSending) return;
    wzxSending = true;
    wzxSendBtn.disabled = true;
    wzxInput.value = '';

    wzx_addMsg('user', wzxText);
    wzx_addLoading();

    try {
      var wzxResp = await fetch(wzx_apiBase + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wzx_message: wzxText,
          wzx_session_id: wzxSessionId || undefined,
          wzx_provider: wzxProviderSelect.value
        })
      });
      var wzxData = await wzxResp.json();
      console.log('客服接口返回数据：', wzxData);

      wzx_removeLoading();
      if (wzxData.code === 0) {
        wzxSessionId = wzxData.data.wzx_session_id;
        var wzxTag = wzxData.data.wzx_provider === 'qiniu' ? '七牛' : '硅基流动';
        if (wzxData.data.wzx_fallback) {
          console.warn('所选服务商不可用，已自动降级到硅基流动');
          wzxTag += ' · 已降级';
        }
        wzx_addMsg('ai', '【' + wzxTag + '】' + wzxData.data.wzx_reply);
      } else {
        console.error('客服接口返回错误：', wzxData.msg);
        wzx_addMsg('ai', '抱歉，我暂时无法回答：' + wzxData.msg);
      }
    } catch (err) {
      console.error('请求客服接口失败：', err);
      wzx_removeLoading();
      wzx_addMsg('ai', '网络异常，请稍后重试。');
    } finally {
      wzxSending = false;
      wzxSendBtn.disabled = false;
      wzxInput.focus();
    }
  }

  wzxForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var wzxText = wzxInput.value.trim();
    if (!wzxText) return;
    wzx_send(wzxText);
  });

  wzxQuickList.addEventListener('click', function (e) {
    var btn = e.target.closest('.wzx_quick_btn');
    if (!btn) return;
    wzx_send(btn.getAttribute('data-q'));
  });

  wzxClearBtn.addEventListener('click', function () {
    wzxSessionId = null;
    console.log('已清空会话，开始新会话');
    wzxChatBox.innerHTML = '';
    wzx_addMsg('ai', '新会话已开启，请问有什么可以帮您？');
  });
})();

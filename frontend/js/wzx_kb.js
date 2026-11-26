/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：知识库管理页面逻辑（RAG）：
 *       文件上传 / 文件列表与删除 / 基于知识库问答。
 *       服务器返回的数据和错误信息均输出到浏览器控制台。
 */
(function () {
  // ---------- canvas 背景粒子动画（与站点统一） ----------
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

  // API 基地址：http 访问用同源；直接双击 html（file://）打开时指向后端 8606 端口
  var wzx_apiBase = (location.protocol === 'http:' || location.protocol === 'https:') ? '' : 'http://localhost:8606';

  // ---------- 元素 ----------
  var wzxUploadArea = document.getElementById('wzx_upload_area');
  var wzxFileInput = document.getElementById('wzx_file_input');
  var wzxFileList = document.getElementById('wzx_file_list');
  var wzxFileEmpty = document.getElementById('wzx_file_empty');
  var wzxChatBox = document.getElementById('wzx_chat_box');
  var wzxForm = document.getElementById('wzx_input_form');
  var wzxInput = document.getElementById('wzx_input');
  var wzxSendBtn = document.getElementById('wzx_send_btn');
  var wzxQuickList = document.getElementById('wzx_quick_list');
  var wzxProviderSelect = document.getElementById('wzx_provider_select');
  var wzxSending = false;

  // ---------- 文件列表 ----------
  function wzx_fmtSize(bytes) {
    if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return bytes + ' B';
  }

  async function wzx_loadFiles() {
    try {
      var resp = await fetch(wzx_apiBase + '/api/kb/files');
      var data = await resp.json();
      console.log('知识库文件列表：', data);
      wzxFileList.innerHTML = '';
      if (data.code === 0 && data.data.length > 0) {
        data.data.forEach(function (f) {
          var li = document.createElement('li');
          li.className = 'wzx_file_item';
          li.innerHTML =
            '<span class="wzx_file_icon">' + f.wzx_file_type + '</span>' +
            '<div class="wzx_file_info">' +
            '<div class="wzx_file_name" title="' + f.wzx_filename + '">' + f.wzx_filename + '</div>' +
            '<div class="wzx_file_meta">' + wzx_fmtSize(f.wzx_file_size) + ' · ' +
            f.wzx_chunk_count + ' 个文本块 · ' + new Date(f.wzx_create_time).toLocaleString() + '</div>' +
            '</div>' +
            '<button class="wzx_file_del" type="button">删除</button>';
          li.querySelector('.wzx_file_del').addEventListener('click', function () {
            wzx_deleteFile(f.wzx_id);
          });
          wzxFileList.appendChild(li);
        });
      } else {
        wzxFileList.appendChild(wzxFileEmpty);
      }
    } catch (err) {
      console.error('获取知识库文件列表失败：', err);
    }
  }

  async function wzx_deleteFile(wzxId) {
    try {
      var resp = await fetch(wzx_apiBase + '/api/kb/files/' + wzxId, { method: 'DELETE' });
      var data = await resp.json();
      console.log('删除知识库文件 #' + wzxId + '：', data);
      wzx_loadFiles();
    } catch (err) {
      console.error('删除知识库文件失败：', err);
    }
  }

  // ---------- 上传 ----------
  async function wzx_uploadFile(file) {
    var tip = wzxUploadArea.querySelector('.wzx_upload_tip');
    var oldTip = tip.textContent;
    tip.textContent = '正在上传解析 ' + file.name + ' …';
    tip.classList.add('wzx_upload_ing');

    try {
      var form = new FormData();
      form.append('wzx_file', file);
      var resp = await fetch(wzx_apiBase + '/api/kb/upload', { method: 'POST', body: form });
      var data = await resp.json();
      console.log('上传知识库文件返回：', data);
      if (data.code === 0) {
        tip.textContent = '✓ ' + file.name + ' 解析成功（' + data.data.wzx_chunk_count + ' 个文本块）';
        wzx_loadFiles();
      } else {
        console.error('上传解析失败：', data.msg);
        tip.textContent = data.msg;
      }
    } catch (err) {
      console.error('上传知识库文件失败：', err);
      tip.textContent = '上传失败，请重试';
    }
    setTimeout(function () {
      tip.textContent = oldTip;
      tip.classList.remove('wzx_upload_ing');
    }, 3500);
  }

  wzxUploadArea.addEventListener('click', function () { wzxFileInput.click(); });
  wzxFileInput.addEventListener('change', function () {
    if (wzxFileInput.files.length > 0) {
      wzx_uploadFile(wzxFileInput.files[0]);
      wzxFileInput.value = '';
    }
  });
  wzxUploadArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    wzxUploadArea.classList.add('wzx_drag_over');
  });
  wzxUploadArea.addEventListener('dragleave', function () {
    wzxUploadArea.classList.remove('wzx_drag_over');
  });
  wzxUploadArea.addEventListener('drop', function (e) {
    e.preventDefault();
    wzxUploadArea.classList.remove('wzx_drag_over');
    if (e.dataTransfer.files.length > 0) {
      wzx_uploadFile(e.dataTransfer.files[0]);
    }
  });

  // ---------- RAG 问答 ----------
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

  function wzx_addSources(sources) {
    if (!sources || sources.length === 0) return;
    var row = document.createElement('div');
    row.className = 'wzx_msg_row wzx_msg_ai';
    var div = document.createElement('div');
    div.className = 'wzx_msg_sources';
    div.innerHTML = '依据：';
    sources.forEach(function (s) {
      var span = document.createElement('span');
      span.textContent = s.wzx_file + ' · 第' + s.wzx_seq + '块';
      div.appendChild(span);
    });
    row.appendChild(div);
    wzxChatBox.appendChild(row);
    wzxChatBox.scrollTop = wzxChatBox.scrollHeight;
  }

  function wzx_addLoading() {
    var row = document.createElement('div');
    row.className = 'wzx_msg_row wzx_msg_ai wzx_msg_loading';
    row.id = 'wzx_loading_row';
    var bubble = document.createElement('div');
    bubble.className = 'wzx_msg_bubble';
    bubble.textContent = '福福正在查阅知识库…';
    row.appendChild(bubble);
    wzxChatBox.appendChild(row);
    wzxChatBox.scrollTop = wzxChatBox.scrollHeight;
  }

  function wzx_removeLoading() {
    var row = document.getElementById('wzx_loading_row');
    if (row) row.parentNode.removeChild(row);
  }

  async function wzx_ask(wzxQuestion) {
    if (wzxSending) return;
    wzxSending = true;
    wzxSendBtn.disabled = true;
    wzxInput.value = '';

    wzx_addMsg('user', wzxQuestion);
    wzx_addLoading();

    try {
      var resp = await fetch(wzx_apiBase + '/api/kb/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wzx_question: wzxQuestion,
          wzx_provider: wzxProviderSelect.value
        })
      });
      var data = await resp.json();
      console.log('知识库问答返回：', data);

      wzx_removeLoading();
      if (data.code === 0) {
        wzx_addMsg('ai', '【' + (data.data.wzx_provider === 'qiniu' ? '七牛' : '硅基流动') + '】' + data.data.wzx_answer);
        wzx_addSources(data.data.wzx_sources);
      } else {
        console.error('知识库问答错误：', data.msg);
        wzx_addMsg('ai', '抱歉，问答出错：' + data.msg);
      }
    } catch (err) {
      console.error('请求知识库问答接口失败：', err);
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
    var wzxQuestion = wzxInput.value.trim();
    if (!wzxQuestion) return;
    wzx_ask(wzxQuestion);
  });

  wzxQuickList.addEventListener('click', function (e) {
    var btn = e.target.closest('.wzx_quick_btn');
    if (!btn) return;
    wzx_ask(btn.getAttribute('data-q'));
  });

  // 初始化
  wzx_loadFiles();
})();

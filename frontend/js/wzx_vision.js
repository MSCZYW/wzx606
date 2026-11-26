/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：图像识别页面逻辑：POST /api/vision/describe 上传图片，
 *       硅基流动视觉模型返回描述；数据与错误均输出到浏览器控制台。
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

  // ---------- 图像识别逻辑 ----------
  // API 基地址：http 访问用同源；直接双击 html（file://）打开时指向后端 8606 端口
  var wzx_apiBase = (location.protocol === 'http:' || location.protocol === 'https:') ? '' : 'http://localhost:8606';
  var wzxApiUrl = (wzx_apiBase || window.location.origin) + '/api/vision/describe';
  document.getElementById('wzx_api_url').textContent = '接口地址：' + wzxApiUrl;

  var wzxUploadArea = document.getElementById('wzx_upload_area');
  var wzxFileInput = document.getElementById('wzx_file_input');
  var wzxPreview = document.getElementById('wzx_preview');
  var wzxRecognizeBtn = document.getElementById('wzx_recognize_btn');
  var wzxResetBtn = document.getElementById('wzx_reset_btn');
  var wzxResultText = document.getElementById('wzx_result_text');
  var wzxResultMeta = document.getElementById('wzx_result_meta');
  var wzxRecognizing = false;

  var wzxDefaultHtml = wzxPreview.innerHTML;
  var wzxDefaultResult = wzxResultText.textContent;

  function wzx_showImage(file) {
    var img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = file.name;
    wzxPreview.innerHTML = '';
    wzxPreview.appendChild(img);
  }

  function wzx_reset() {
    wzxPreview.innerHTML = wzxDefaultHtml;
    wzxResultText.textContent = wzxDefaultResult;
    wzxResultText.classList.remove('wzx_loading');
    wzxResultMeta.textContent = '';
    wzxRecognizeBtn.disabled = true;
    wzxFileInput.value = '';
  }

  async function wzx_recognize(file) {
    if (wzxRecognizing) return;
    wzxRecognizing = true;
    wzxRecognizeBtn.disabled = true;
    wzxResultText.textContent = '正在识别中，AI 正在观察这张图片…';
    wzxResultText.classList.add('wzx_loading');
    wzxResultMeta.textContent = '';

    try {
      var form = new FormData();
      form.append('wzx_image', file);
      var resp = await fetch(wzx_apiBase + '/api/vision/describe', { method: 'POST', body: form });
      var data = await resp.json();
      console.log('图像识别接口返回：', data);

      wzxResultText.classList.remove('wzx_loading');
      if (data.code === 0) {
        wzxResultText.textContent = data.data.wzx_description;
        wzxResultMeta.textContent =
          '模型：' + data.data.wzx_model +
          ' ｜ 文件：' + file.name + '（' + (file.size / 1024).toFixed(0) + ' KB）';
      } else {
        console.error('图像识别错误：', data.msg);
        wzxResultText.textContent = '识别失败：' + data.msg;
      }
    } catch (err) {
      console.error('请求图像识别接口失败：', err);
      wzxResultText.classList.remove('wzx_loading');
      wzxResultText.textContent = '网络异常，请稍后重试。';
    } finally {
      wzxRecognizing = false;
      wzxRecognizeBtn.disabled = !wzxFileInput.files || wzxFileInput.files.length === 0;
    }
  }

  wzxUploadArea.addEventListener('click', function () { wzxFileInput.click(); });

  wzxFileInput.addEventListener('change', function () {
    if (wzxFileInput.files.length > 0) {
      var file = wzxFileInput.files[0];
      wzx_showImage(file);
      wzxRecognizeBtn.disabled = false;
      console.log('已选择图片：', file.name, file.type, file.size + ' 字节');
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
      var file = e.dataTransfer.files[0];
      wzx_showImage(file);
      wzxRecognizeBtn.disabled = false;
      console.log('已拖入图片：', file.name, file.type, file.size + ' 字节');
    }
  });

  wzxRecognizeBtn.addEventListener('click', function () {
    if (wzxFileInput.files.length > 0) {
      wzx_recognize(wzxFileInput.files[0]);
    }
  });

  wzxResetBtn.addEventListener('click', wzx_reset);
})();

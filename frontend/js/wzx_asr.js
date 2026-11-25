/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：语音识别页面逻辑：
 *       1）MediaRecorder 麦克风录音（浏览器录制为 webm/ogg，前端解码后转成 wav 再上传，保证兼容）；
 *       2）也支持直接选择 wav/mp3 等音频文件；
 *       3）POST /api/asr/recognize 上传音频，返回转写文字；
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

  // ---------- 元素 ----------
  var wzxApiUrl = window.location.origin.replace(/:\d+$/, ':8606') + '/api/asr/recognize';
  document.getElementById('wzx_api_url').textContent = '接口地址：' + wzxApiUrl;

  var wzxRecordBtn = document.getElementById('wzx_record_btn');
  var wzxRecordLabel = document.getElementById('wzx_record_label');
  var wzxRecordTime = document.getElementById('wzx_record_time');
  var wzxPreviewBox = document.getElementById('wzx_audio_preview');
  var wzxPlayer = document.getElementById('wzx_audio_player');
  var wzxAudioInfo = document.getElementById('wzx_audio_info');
  var wzxFileBtn = document.getElementById('wzx_file_btn');
  var wzxFileInput = document.getElementById('wzx_file_input');
  var wzxRecognizeBtn = document.getElementById('wzx_recognize_btn');
  var wzxResetBtn = document.getElementById('wzx_reset_btn');
  var wzxResultText = document.getElementById('wzx_result_text');
  var wzxResultMeta = document.getElementById('wzx_result_meta');

  var wzxDefaultResult = wzxResultText.textContent;
  var wzxCurrentBlob = null;   // 当前待识别音频 Blob（wav）
  var wzxCurrentName = '';     // 当前音频名称
  var wzxRecorder = null;
  var wzxChunks = [];
  var wzxTimer = null;
  var wzxSeconds = 0;
  var wzxRecognizing = false;

  // ---------- 录音 ----------
  async function wzx_toggleRecord() {
    if (wzxRecorder && wzxRecorder.state === 'recording') {
      wzxRecorder.stop();
      return;
    }
    try {
      var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('麦克风授权成功，开始录音');
      wzxChunks = [];
      wzxRecorder = new MediaRecorder(stream);
      wzxRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) wzxChunks.push(e.data);
      };
      wzxRecorder.onstop = function () {
        stream.getTracks().forEach(function (t) { t.stop(); });
        clearInterval(wzxTimer);
        wzxRecordBtn.classList.remove('wzx_recording');
        wzxRecordLabel.textContent = '开始录音';
        console.log('录音结束，共 ' + wzxSeconds + ' 秒');
        // 浏览器录制格式（webm/ogg）转 wav 后预览
        var rawBlob = new Blob(wzxChunks, { type: wzxRecorder.mimeType || 'audio/webm' });
        wzx_convertToWav(rawBlob).then(function (wavBlob) {
          wzx_setAudio(wavBlob, '录音_' + wzxSeconds + 's.wav', wzxSeconds);
        }).catch(function (err) {
          console.error('录音格式转换失败，使用原始格式上传：', err);
          wzx_setAudio(rawBlob, '录音_' + wzxSeconds + 's.webm', wzxSeconds);
        });
      };

      wzxSeconds = 0;
      wzxRecordTime.textContent = '00:00';
      wzxTimer = setInterval(function () {
        wzxSeconds++;
        var m = Math.floor(wzxSeconds / 60), s = wzxSeconds % 60;
        wzxRecordTime.textContent = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
      }, 1000);

      wzxRecorder.start();
      wzxRecordBtn.classList.add('wzx_recording');
      wzxRecordLabel.textContent = '停止录音';
    } catch (err) {
      console.error('无法访问麦克风：', err);
      wzxResultText.textContent = '无法访问麦克风，请检查浏览器权限，或改用"选择音频文件"。';
    }
  }

  /** 浏览器录音（webm/ogg）解码重采样为 16kHz 单声道 wav，保证 ASR 接口兼容 */
  function wzx_convertToWav(blob) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        ctx.decodeAudioData(reader.result, function (buf) {
          // 转单声道
          var chData = [];
          for (var c = 0; c < buf.numberOfChannels; c++) {
            chData.push(buf.getChannelData(c));
          }
          var srcRate = buf.sampleRate;
          var dstRate = 16000;
          var dstLen = Math.ceil(buf.length * dstRate / srcRate);
          var mono = new Float32Array(dstLen);
          for (var i = 0; i < dstLen; i++) {
            var srcIdx = Math.floor(i * srcRate / dstRate);
            var sum = 0;
            for (var c = 0; c < chData.length; c++) sum += chData[c][srcIdx] || 0;
            mono[i] = sum / chData.length;
          }
          // 生成 wav（16bit PCM）
          var wavBuf = new ArrayBuffer(44 + dstLen * 2);
          var view = new DataView(wavBuf);
          function wzx_writeStr(offset, str) {
            for (var k = 0; k < str.length; k++) view.setUint8(offset + k, str.charCodeAt(k));
          }
          wzx_writeStr(0, 'RIFF');
          view.setUint32(4, 36 + dstLen * 2, true);
          wzx_writeStr(8, 'WAVE');
          wzx_writeStr(12, 'fmt ');
          view.setUint32(16, 16, true);
          view.setUint16(20, 1, true);
          view.setUint16(22, 1, true);
          view.setUint32(24, dstRate, true);
          view.setUint32(28, dstRate * 2, true);
          view.setUint16(32, 2, true);
          view.setUint16(34, 16, true);
          wzx_writeStr(36, 'data');
          view.setUint32(40, dstLen * 2, true);
          for (var k = 0; k < dstLen; k++) {
            var sample = Math.max(-1, Math.min(1, mono[k]));
            view.setInt16(44 + k * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
          }
          ctx.close();
          resolve(new Blob([wavBuf], { type: 'audio/wav' }));
        }, function (err) {
          ctx.close();
          reject(err);
        });
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  function wzx_setAudio(blob, name, seconds) {
    wzxCurrentBlob = blob;
    wzxCurrentName = name;
    wzxPlayer.src = URL.createObjectURL(blob);
    wzxPreviewBox.hidden = false;
    wzxAudioInfo.textContent = name + '（' + (blob.size / 1024).toFixed(0) + ' KB' +
      (seconds ? '，约 ' + seconds + ' 秒' : '') + '）';
    wzxRecognizeBtn.disabled = false;
    console.log('待识别音频就绪：', name, blob.type, blob.size + ' 字节');
  }

  // ---------- 文件选择 ----------
  wzxFileBtn.addEventListener('click', function () { wzxFileInput.click(); });
  wzxFileInput.addEventListener('change', function () {
    if (wzxFileInput.files.length > 0) {
      var file = wzxFileInput.files[0];
      console.log('已选择音频文件：', file.name, file.type, file.size + ' 字节');
      wzx_setAudio(file, file.name);
    }
  });

  // ---------- 识别 ----------
  async function wzx_recognize() {
    if (!wzxCurrentBlob || wzxRecognizing) return;
    wzxRecognizing = true;
    wzxRecognizeBtn.disabled = true;
    wzxResultText.textContent = '正在识别中，AI 正在聆听录音…';
    wzxResultText.classList.add('wzx_loading');
    wzxResultMeta.textContent = '';

    try {
      var form = new FormData();
      form.append('wzx_audio', wzxCurrentBlob, wzxCurrentName || 'audio.wav');
      var resp = await fetch('/api/asr/recognize', { method: 'POST', body: form });
      var data = await resp.json();
      console.log('语音识别接口返回：', data);

      wzxResultText.classList.remove('wzx_loading');
      if (data.code === 0) {
        wzxResultText.textContent = data.data.wzx_text;
        var lang = data.data.wzx_language ? ' ｜ 语种：' + data.data.wzx_language : '';
        wzxResultMeta.textContent =
          '服务商：' + (data.data.wzx_provider === 'qiniu' ? '七牛' : '硅基流动（七牛通道降级）') +
          ' ｜ 模型：' + data.data.wzx_model + lang;
      } else {
        console.error('语音识别错误：', data.msg);
        wzxResultText.textContent = '识别失败：' + data.msg;
      }
    } catch (err) {
      console.error('请求语音识别接口失败：', err);
      wzxResultText.classList.remove('wzx_loading');
      wzxResultText.textContent = '网络异常，请稍后重试。';
    } finally {
      wzxRecognizing = false;
      wzxRecognizeBtn.disabled = false;
    }
  }

  function wzx_reset() {
    wzxCurrentBlob = null;
    wzxCurrentName = '';
    wzxPlayer.removeAttribute('src');
    wzxPreviewBox.hidden = true;
    wzxAudioInfo.textContent = '';
    wzxResultText.textContent = wzxDefaultResult;
    wzxResultText.classList.remove('wzx_loading');
    wzxResultMeta.textContent = '';
    wzxRecognizeBtn.disabled = true;
    wzxRecordTime.textContent = '00:00';
    wzxFileInput.value = '';
  }

  wzxRecordBtn.addEventListener('click', wzx_toggleRecord);
  wzxRecognizeBtn.addEventListener('click', wzx_recognize);
  wzxResetBtn.addEventListener('click', wzx_reset);
})();

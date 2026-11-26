/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：首页脚本：canvas 粒子连线背景动画 + 获取站点信息
 */

(function () {
  /* ---------- canvas 粒子连线背景动画 ---------- */
  // API 基地址：http 访问用同源；直接双击 html（file://）打开时指向后端 8606 端口
  const wzx_apiBase = (location.protocol === 'http:' || location.protocol === 'https:') ? '' : 'http://localhost:8606';
  const wzx_canvas = document.getElementById('wzx_canvas_bg');
  const wzx_ctx = wzx_canvas.getContext('2d');

  let wzx_width = 0;
  let wzx_height = 0;
  let wzx_particles = [];

  const wzx_PARTICLE_NUM = 70;   // 粒子数量
  const wzx_LINK_DIST = 140;     // 连线距离阈值

  function wzx_resize() {
    wzx_width = wzx_canvas.width = window.innerWidth;
    wzx_height = wzx_canvas.height = window.innerHeight;
  }

  function wzx_createParticles() {
    wzx_particles = [];
    for (let i = 0; i < wzx_PARTICLE_NUM; i++) {
      wzx_particles.push({
        wzx_x: Math.random() * wzx_width,
        wzx_y: Math.random() * wzx_height,
        wzx_vx: (Math.random() - 0.5) * 0.6,
        wzx_vy: (Math.random() - 0.5) * 0.6,
        wzx_r: Math.random() * 2 + 1
      });
    }
  }

  function wzx_draw() {
    wzx_ctx.clearRect(0, 0, wzx_width, wzx_height);

    // 粒子
    for (let i = 0; i < wzx_particles.length; i++) {
      const p = wzx_particles[i];
      p.wzx_x += p.wzx_vx;
      p.wzx_y += p.wzx_vy;

      if (p.wzx_x < 0 || p.wzx_x > wzx_width) p.wzx_vx *= -1;
      if (p.wzx_y < 0 || p.wzx_y > wzx_height) p.wzx_vy *= -1;

      wzx_ctx.beginPath();
      wzx_ctx.arc(p.wzx_x, p.wzx_y, p.wzx_r, 0, Math.PI * 2);
      wzx_ctx.fillStyle = 'rgba(160, 200, 255, 0.8)';
      wzx_ctx.fill();
    }

    // 连线
    for (let i = 0; i < wzx_particles.length; i++) {
      for (let j = i + 1; j < wzx_particles.length; j++) {
        const a = wzx_particles[i];
        const b = wzx_particles[j];
        const dx = a.wzx_x - b.wzx_x;
        const dy = a.wzx_y - b.wzx_y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < wzx_LINK_DIST) {
          wzx_ctx.beginPath();
          wzx_ctx.moveTo(a.wzx_x, a.wzx_y);
          wzx_ctx.lineTo(b.wzx_x, b.wzx_y);
          wzx_ctx.strokeStyle = 'rgba(160, 200, 255, ' + (0.35 * (1 - dist / wzx_LINK_DIST)) + ')';
          wzx_ctx.lineWidth = 1;
          wzx_ctx.stroke();
        }
      }
    }

    requestAnimationFrame(wzx_draw);
  }

  wzx_resize();
  wzx_createParticles();
  wzx_draw();
  window.addEventListener('resize', function () {
    wzx_resize();
    wzx_createParticles();
  });

  /* ---------- 获取站点信息（服务器返回的数据输出到控制台） ---------- */
  fetch(wzx_apiBase + '/api/wzx_info')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      console.log('服务器返回的站点信息：', data);
    })
    .catch(function (err) {
      console.error('获取站点信息失败：', err);
    });
})();

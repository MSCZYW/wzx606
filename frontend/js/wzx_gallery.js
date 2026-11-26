/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：图文列表页脚本：顶部显示接口地址，fetch 获取数据渲染上图下文网格卡片
 */

(function () {
  // 页面顶部显示当前调用的接口地址
  // API 基地址：http 访问用同源；直接双击 html（file://）打开时指向后端 8606 端口
  const wzx_apiBase = (location.protocol === 'http:' || location.protocol === 'https:') ? '' : 'http://localhost:8606';
  const wzx_apiUrl = (wzx_apiBase || window.location.origin) + '/api/gallery';
  document.getElementById('wzx_api_url').textContent = 'GET ' + wzx_apiUrl;

  const wzx_gridEl = document.getElementById('wzx_gallery_grid');
  const wzx_loadingEl = document.getElementById('wzx_loading');

  function wzx_formatTime(wzx_str) {
    if (!wzx_str) return '';
    return wzx_str.replace('T', ' ').slice(0, 19);
  }

  // 图片加载失败时：隐藏 img，容器显示占位色块，避免出现破图图标
  function wzx_bindImgError(wzx_img, wzx_box) {
    wzx_img.addEventListener('error', function () {
      wzx_img.classList.add('wzx_img_hidden');
      wzx_box.classList.add('wzx_img_fail');
    });
  }

  fetch(wzx_apiBase + '/api/gallery')
    .then(function (res) { return res.json(); })
    .then(function (wzx_res) {
      // 服务器返回的数据输出到浏览器控制台
      console.log('服务器返回的图文数据：', wzx_res);

      if (wzx_res.code !== 0 || !Array.isArray(wzx_res.data)) {
        wzx_loadingEl.textContent = '加载失败：' + wzx_res.msg;
        return;
      }

      if (wzx_res.data.length === 0) {
        wzx_loadingEl.textContent = '暂无图文数据';
        return;
      }

      const wzx_fragment = document.createDocumentFragment();
      wzx_res.data.forEach(function (wzx_item) {
        const wzx_card = document.createElement('article');
        wzx_card.className = 'wzx_gallery_card';

        // 图片容器（上图）
        const wzx_box = document.createElement('div');
        wzx_box.className = 'wzx_card_img_box';
        const wzx_img = document.createElement('img');
        wzx_img.className = 'wzx_card_img';
        wzx_img.src = wzx_item.img_url;
        wzx_img.alt = wzx_item.title;
        wzx_img.loading = 'lazy';
        wzx_bindImgError(wzx_img, wzx_box);
        wzx_box.appendChild(wzx_img);

        // 文字区（下文）
        const wzx_body = document.createElement('div');
        wzx_body.className = 'wzx_card_body';

        const wzx_title = document.createElement('h2');
        wzx_title.className = 'wzx_card_title';
        wzx_title.textContent = wzx_item.title;

        const wzx_desc = document.createElement('p');
        wzx_desc.className = 'wzx_card_desc';
        wzx_desc.textContent = wzx_item.description;

        const wzx_meta = document.createElement('div');
        wzx_meta.className = 'wzx_card_meta';

        const wzx_category = document.createElement('span');
        wzx_category.className = 'wzx_card_category';
        wzx_category.textContent = wzx_item.category;

        const wzx_time = document.createElement('span');
        wzx_time.className = 'wzx_card_time';
        wzx_time.textContent = wzx_formatTime(wzx_item.create_time).slice(0, 10);

        wzx_meta.appendChild(wzx_category);
        wzx_meta.appendChild(wzx_time);

        wzx_body.appendChild(wzx_title);
        wzx_body.appendChild(wzx_desc);
        wzx_body.appendChild(wzx_meta);

        wzx_card.appendChild(wzx_box);
        wzx_card.appendChild(wzx_body);
        wzx_fragment.appendChild(wzx_card);
      });

      wzx_gridEl.innerHTML = '';
      wzx_gridEl.appendChild(wzx_fragment);
    })
    .catch(function (wzx_err) {
      // 错误信息输出到浏览器控制台
      console.error('请求 /api/gallery 出错：', wzx_err);
      wzx_loadingEl.textContent = '请求出错：' + wzx_err.message;
    });
})();

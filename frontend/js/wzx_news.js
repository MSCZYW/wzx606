/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：新闻页脚本：页面顶部显示接口地址，fetch 获取新闻并渲染列表
 */

(function () {
  // 页面顶部显示当前调用的接口地址
  const wzx_apiUrl = window.location.origin + '/api/news';
  document.getElementById('wzx_api_url').textContent = 'GET ' + wzx_apiUrl;

  const wzx_listEl = document.getElementById('wzx_news_list');
  const wzx_loadingEl = document.getElementById('wzx_loading');

  function wzx_formatTime(wzx_str) {
    if (!wzx_str) return '';
    return wzx_str.replace('T', ' ').slice(0, 19);
  }

  fetch('/api/news')
    .then(function (res) { return res.json(); })
    .then(function (wzx_res) {
      // 服务器返回的数据输出到浏览器控制台
      console.log('服务器返回的新闻数据：', wzx_res);

      if (wzx_res.code !== 0 || !Array.isArray(wzx_res.data)) {
        wzx_loadingEl.textContent = '加载失败：' + wzx_res.msg;
        return;
      }

      if (wzx_res.data.length === 0) {
        wzx_loadingEl.textContent = '暂无新闻数据';
        return;
      }

      const wzx_fragment = document.createDocumentFragment();
      wzx_res.data.forEach(function (wzx_item) {
        const wzx_card = document.createElement('article');
        wzx_card.className = 'wzx_news_item';

        const wzx_title = document.createElement('h2');
        wzx_title.className = 'wzx_news_title';
        wzx_title.textContent = wzx_item.title;

        const wzx_summary = document.createElement('p');
        wzx_summary.className = 'wzx_news_summary';
        wzx_summary.textContent = wzx_item.summary;

        const wzx_meta = document.createElement('div');
        wzx_meta.className = 'wzx_news_meta';

        const wzx_source = document.createElement('span');
        wzx_source.className = 'wzx_news_source';
        wzx_source.textContent = wzx_item.source;

        const wzx_time = document.createElement('span');
        wzx_time.className = 'wzx_news_time';
        wzx_time.textContent = '发布时间：' + wzx_formatTime(wzx_item.publish_time);

        wzx_meta.appendChild(wzx_source);
        wzx_meta.appendChild(wzx_time);

        wzx_card.appendChild(wzx_title);
        wzx_card.appendChild(wzx_summary);
        wzx_card.appendChild(wzx_meta);
        wzx_fragment.appendChild(wzx_card);
      });

      wzx_listEl.innerHTML = '';
      wzx_listEl.appendChild(wzx_fragment);
    })
    .catch(function (wzx_err) {
      // 错误信息输出到浏览器控制台
      console.error('请求 /api/news 出错：', wzx_err);
      wzx_loadingEl.textContent = '请求出错：' + wzx_err.message;
    });
})();

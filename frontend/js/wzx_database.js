/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：数据库连接测试页脚本：提交 /api/db-test 并展示结果
 */

(function () {
  const wzx_testBtn = document.getElementById('wzx_test_btn');
  const wzx_resultEl = document.getElementById('wzx_result');

  wzx_testBtn.addEventListener('click', function () {
    const wzx_username = document.getElementById('wzx_username').value.trim();
    const wzx_password = document.getElementById('wzx_password').value;

    wzx_testBtn.disabled = true;
    wzx_testBtn.textContent = '测试中...';

    fetch('/api/db-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wzx_user: wzx_username, wzx_password: wzx_password })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        // 服务器返回的数据输出到浏览器控制台
        console.log('服务器返回的连接测试结果：', data);

        wzx_resultEl.hidden = false;
        if (data.code === 0) {
          wzx_resultEl.className = 'wzx_result wzx_success';
          wzx_resultEl.textContent = '连接成功：' + data.msg +
            '（数据库版本：' + (data.data && data.data.wzx_db_version ? data.data.wzx_db_version : '未知') + '）';
        } else {
          wzx_resultEl.className = 'wzx_result wzx_error';
          wzx_resultEl.textContent = '连接失败：' + data.msg;
        }
      })
      .catch(function (err) {
        // 错误信息输出到浏览器控制台
        console.error('请求 /api/db-test 出错：', err);
        wzx_resultEl.hidden = false;
        wzx_resultEl.className = 'wzx_result wzx_error';
        wzx_resultEl.textContent = '请求出错：' + err.message;
      })
      .finally(function () {
        wzx_testBtn.disabled = false;
        wzx_testBtn.textContent = '测试连接';
      });
  });
})();

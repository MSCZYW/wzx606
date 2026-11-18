// 数据服务器：读取当前文件夹下的 db.json，以 JSON 格式返回给前端
// 启动方式：node server.js，访问地址 http://localhost:3004/db.json

// 引入 Node 内置模块，无需安装第三方依赖
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3004;
// db.json 与 server.js 同目录，使用绝对路径读取，避免受启动目录影响
const DB_FILE = path.join(__dirname, 'db.json');

// 创建 HTTP 服务器，处理前端的数据请求
const server = http.createServer((req, res) => {
  // 读取 db.json 文件内容
  fs.readFile(DB_FILE, 'utf-8', (err, data) => {
    if (err) {
      // 读取失败时返回 500 错误信息
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: '读取 db.json 失败' }));
      return;
    }
    // 设置响应头：JSON 格式 + 允许跨域，方便本地页面直接请求
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
  });
});

// 监听 3004 端口，启动成功后打印提示
server.listen(PORT, () => {
  console.log(`数据服务器已启动：http://localhost:${PORT}/db.json`);
});

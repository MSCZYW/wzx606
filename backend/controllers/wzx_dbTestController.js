/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：数据库连接测试控制器，使用 mysql2 尝试连接 MySQL
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const wzx_dbTestController = {
  // POST /api/db-test
  async wzx_testConnection(req, res) {
    // 用户名密码由前端传入，主机名从 .env 读取（凭据不写死在代码里）
    const wzx_user = (req.body && req.body.wzx_user) || process.env.DB_USER;
    const wzx_password = (req.body && req.body.wzx_password) || process.env.DB_PASSWORD;
    const wzx_host = process.env.DB_HOST || 'localhost';

    let wzx_conn;
    try {
      wzx_conn = await mysql.createConnection({
        host: wzx_host,
        user: wzx_user,
        password: wzx_password,
        connectTimeout: 5000
      });

      const [rows] = await wzx_conn.query('SELECT VERSION() AS wzx_version');
      const wzx_version = rows && rows[0] ? rows[0].wzx_version : '未知';

      res.json({
        code: 0,
        msg: '数据库连接成功',
        data: { wzx_db_version: wzx_version }
      });
    } catch (err) {
      console.error('数据库连接失败：', err.message);
      res.json({
        code: 1,
        msg: '数据库连接失败：' + err.message,
        data: null
      });
    } finally {
      if (wzx_conn) {
        await wzx_conn.end().catch(function () {});
      }
    }
  }
};

module.exports = wzx_dbTestController;

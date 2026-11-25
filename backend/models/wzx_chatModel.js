/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：在线客服聊天记录 Model，负责 wzx_chat_message 表的读写
 */
const pool = require('mysql2/promise').createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

const wzx_chatModel = {
  /** 保存一条聊天记录 */
  async saveMessage(wzxSessionId, wzxRole, wzxContent) {
    const [result] = await pool.execute(
      'INSERT INTO wzx_chat_message (wzx_session_id, wzx_role, wzx_content) VALUES (?, ?, ?)',
      [wzxSessionId, wzxRole, wzxContent]
    );
    return result.insertId;
  },

  /** 取某会话最近 N 条记录（时间正序），用于拼接上下文 */
  async getRecentMessages(wzxSessionId, wzxLimit) {
    const [rows] = await pool.execute(
      'SELECT wzx_role, wzx_content FROM (SELECT wzx_id, wzx_role, wzx_content FROM wzx_chat_message WHERE wzx_session_id = ? ORDER BY wzx_id DESC LIMIT ?) AS t ORDER BY wzx_id ASC',
      [wzxSessionId, String(wzxLimit)]
    );
    return rows;
  }
};

module.exports = wzx_chatModel;

/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：知识库 Model，负责 wzx_kb_file / wzx_kb_chunk 表读写与关键词检索
 */
const pool = require('mysql2/promise').createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

const wzx_kbModel = {
  /** 新增知识库文件记录，返回文件ID */
  async addFile(wzxFilename, wzxFileType, wzxFileSize, wzxChunkCount) {
    const [result] = await pool.execute(
      'INSERT INTO wzx_kb_file (wzx_filename, wzx_file_type, wzx_file_size, wzx_chunk_count) VALUES (?, ?, ?, ?)',
      [wzxFilename, wzxFileType, wzxFileSize, wzxChunkCount]
    );
    return result.insertId;
  },

  /** 批量写入文本块 */
  async addChunks(wzxFileId, wzxChunks) {
    for (let i = 0; i < wzxChunks.length; i++) {
      await pool.execute(
        'INSERT INTO wzx_kb_chunk (wzx_file_id, wzx_seq, wzx_content) VALUES (?, ?, ?)',
        [wzxFileId, i + 1, wzxChunks[i]]
      );
    }
  },

  /** 文件列表（含各文件文本块数量） */
  async listFiles() {
    const [rows] = await pool.execute(
      'SELECT wzx_id, wzx_filename, wzx_file_type, wzx_file_size, wzx_chunk_count, wzx_create_time FROM wzx_kb_file ORDER BY wzx_id DESC'
    );
    return rows;
  },

  /** 删除文件及其全部文本块 */
  async deleteFile(wzxFileId) {
    const [result] = await pool.execute('DELETE FROM wzx_kb_file WHERE wzx_id = ?', [String(wzxFileId)]);
    if (result.affectedRows > 0) {
      await pool.execute('DELETE FROM wzx_kb_chunk WHERE wzx_file_id = ?', [String(wzxFileId)]);
    }
    return result.affectedRows > 0;
  },

  /** 读取全部文本块（课程作业语料规模小，直接全量加载后在内存中检索） */
  async getAllChunks() {
    const [rows] = await pool.execute(
      'SELECT c.wzx_id, c.wzx_file_id, c.wzx_seq, c.wzx_content, f.wzx_filename FROM wzx_kb_chunk c JOIN wzx_kb_file f ON c.wzx_file_id = f.wzx_id ORDER BY c.wzx_id ASC'
    );
    return rows;
  },

  /**
   * RAG 检索：问题与文本块做关键词（2-gram）匹配打分，返回得分最高的 topK 块
   */
  async searchChunks(wzxQuestion, wzxTopK) {
    const wzxTop = wzxTopK || 3;
    const wzxChunks = await this.getAllChunks();

    // 问题拆成关键词：中文按 2-gram，英文/数字按词
    const wzxTerms = this.wzx_extractTerms(wzxQuestion);
    if (wzxTerms.length === 0) return [];

    const wzxScored = [];
    for (const wzxChunk of wzxChunks) {
      let wzxScore = 0;
      for (const wzxTerm of wzxTerms) {
        let wzxPos = -1;
        let wzxCount = 0;
        const wzxLower = wzxChunk.wzx_content.toLowerCase();
        const wzxNeedle = wzxTerm.toLowerCase();
        while ((wzxPos = wzxLower.indexOf(wzxNeedle, wzxPos + 1)) !== -1 && wzxCount < 20) {
          wzxCount++;
        }
        wzxScore += wzxCount;
      }
      if (wzxScore > 0) {
        wzxScored.push({ ...wzxChunk, wzx_score: wzxScore });
      }
    }
    wzxScored.sort((a, b) => b.wzx_score - a.wzx_score);
    return wzxScored.slice(0, wzxTop);
  },

  /** 提取检索词：英文单词 + 中文相邻二字组合 */
  wzx_extractTerms(wzxQuestion) {
    const wzxTerms = [];
    const wzxLatin = String(wzxQuestion || '').toLowerCase().match(/[a-z0-9]{2,}/g) || [];
    wzxTerms.push(...wzxLatin);
    const wzxHanRuns = String(wzxQuestion || '').match(/[\u4e00-\u9fa5]{2,}/g) || [];
    for (const wzxRun of wzxHanRuns) {
      for (let i = 0; i < wzxRun.length - 1; i++) {
        wzxTerms.push(wzxRun.slice(i, i + 2));
      }
    }
    return [...new Set(wzxTerms)].slice(0, 40);
  }
};

module.exports = wzx_kbModel;

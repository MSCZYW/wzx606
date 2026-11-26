/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：知识库 Controller（RAG）：
 *       上传解析文件、文件列表、删除文件、基于知识库问答
 */
const wzx_kbModel = require('../models/wzx_kbModel');
const wzx_fileParser = require('../services/wzx_fileParser');
const wzx_customerService = require('../services/wzx_customerService');

// 允许上传的扩展名
const wzxAllowedExts = ['txt', 'pdf', 'doc', 'docx', 'ppt', 'pptx'];

const wzx_kbController = {
  /** 上传知识库文件：解析 -> 分块 -> 入库 */
  async wzx_upload(req, res) {
    try {
      if (!req.file) {
        return res.json({ code: 1, msg: '请选择要上传的文件', data: null });
      }
      // 修正 multer 按 latin1 解码中文文件名导致的乱码
      const wzxOriginal = Buffer.from(req.file.originalname || '未命名文件', 'latin1').toString('utf8');
      const wzxExt = wzxOriginal.toLowerCase().split('.').pop();
      if (wzxAllowedExts.indexOf(wzxExt) === -1) {
        return res.json({
          code: 1,
          msg: '暂不支持 .' + wzxExt + ' 文件，请上传 ' + wzxAllowedExts.join(' / ') + ' 格式',
          data: null
        });
      }

      // 1. 解析文本
      const wzxText = await wzx_fileParser.wzx_extractText(req.file.buffer, wzxExt);

      // 2. 分块
      const wzxChunks = wzx_fileParser.wzx_chunkText(wzxText, 500);
      if (wzxChunks.length === 0) {
        return res.json({ code: 1, msg: '文件解析后没有有效文本内容', data: null });
      }

      // 3. 入库
      const wzxFileId = await wzx_kbModel.addFile(
        wzxOriginal, wzxExt, req.file.size, wzxChunks.length
      );
      await wzx_kbModel.addChunks(wzxFileId, wzxChunks);

      console.log(`[知识库] 文件「${wzxOriginal}」上传成功：解析出 ${wzxChunks.length} 个文本块`);
      return res.json({
        code: 0,
        msg: '上传并解析成功',
        data: {
          wzx_file_id: wzxFileId,
          wzx_filename: wzxOriginal,
          wzx_file_type: wzxExt,
          wzx_file_size: req.file.size,
          wzx_chunk_count: wzxChunks.length
        }
      });
    } catch (err) {
      console.error('[知识库] 上传失败：', err.message);
      return res.json({ code: 1, msg: '上传解析失败：' + err.message, data: null });
    }
  },

  /** 知识库文件列表 */
  async wzx_listFiles(req, res) {
    try {
      const wzxFiles = await wzx_kbModel.listFiles();
      return res.json({ code: 0, msg: '获取文件列表成功', data: wzxFiles });
    } catch (err) {
      console.error('[知识库] 获取列表失败：', err.message);
      return res.json({ code: 1, msg: '获取文件列表失败：' + err.message, data: null });
    }
  },

  /** 删除知识库文件及其文本块 */
  async wzx_deleteFile(req, res) {
    try {
      const wzxFileId = Number(req.params.id);
      if (!wzxFileId) {
        return res.json({ code: 1, msg: '文件ID不合法', data: null });
      }
      const wzxDeleted = await wzx_kbModel.deleteFile(wzxFileId);
      if (!wzxDeleted) {
        return res.json({ code: 1, msg: '文件不存在或已删除', data: null });
      }
      console.log(`[知识库] 文件 #${wzxFileId} 已删除`);
      return res.json({ code: 0, msg: '删除成功', data: null });
    } catch (err) {
      console.error('[知识库] 删除失败：', err.message);
      return res.json({ code: 1, msg: '删除失败：' + err.message, data: null });
    }
  },

  /** 基于知识库的 RAG 问答 */
  async wzx_ask(req, res) {
    try {
      const wzxQuestion = (req.body && req.body.wzx_question || '').trim();
      const wzxProvider = (req.body && req.body.wzx_provider || '').trim();
      if (!wzxQuestion) {
        return res.json({ code: 1, msg: '问题内容不能为空', data: null });
      }

      // 1. RAG 检索：按关键词匹配取最相关的文本块
      const wzxHits = await wzx_kbModel.searchChunks(wzxQuestion, 3);
      let wzxContext = '（知识库中未检索到与该问题直接相关的内容，请如实告知用户）';
      const wzxSources = [];
      if (wzxHits.length > 0) {
        wzxContext = wzxHits.map(function (hit, idx) {
          wzxSources.push({
            wzx_file: hit.wzx_filename,
            wzx_seq: hit.wzx_seq,
            wzx_score: hit.wzx_score
          });
          return '[资料' + (idx + 1) + '｜来源：' + hit.wzx_filename + ' 第' + hit.wzx_seq + '块]\n' + hit.wzx_content;
        }).join('\n\n');
      }
      console.log(`[知识库] 问题「${wzxQuestion}」命中 ${wzxHits.length} 个文本块`);

      // 2. 调用大模型（带知识库上下文，控制台会输出收发数据；失败自动降级到硅基流动）
      const wzxResult = await wzx_customerService.getReply(
        [{ wzx_role: 'user', wzx_content: wzxQuestion }],
        wzxProvider,
        wzxContext
      );

      return res.json({
        code: 0,
        msg: '回答成功',
        data: {
          wzx_answer: wzxResult.wzx_reply,
          wzx_sources: wzxSources,
          wzx_provider: wzxResult.wzx_provider,
          wzx_fallback: wzxResult.wzx_fallback
        }
      });
    } catch (err) {
      console.error('[知识库] 问答失败：', err.message);
      return res.json({ code: 1, msg: '知识库问答失败：' + err.message, data: null });
    }
  }
};

module.exports = wzx_kbController;

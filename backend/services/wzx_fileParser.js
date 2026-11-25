/**
 * 姓名：王治贤 | 学号：24002120606 |
 * 时间：2026-11-25 | 大模型：GLM-5.3-Flash
 * 说明：知识库文件解析器 Service：
 *       支持 txt / pdf / doc / docx / pptx（旧版 .ppt 为二进制 OLE 格式，
 *       采用记录头扫描启发式提取 UTF-16 文本，提取失败时返回友好错误）。
 */
const JSZip = require('jszip');
const WordExtractor = require('word-extractor');

const wzx_fileParser = {
  /** 从 docx（zip 内 word/document.xml）提取正文文本 */
  async wzx_parseDocx(wzxBuffer) {
    const wzxZip = await JSZip.loadAsync(wzxBuffer);
    const wzxXml = await wzxZip.file('word/document.xml').async('string');
    return this.wzx_xmlToText(wzxXml, 'w:p');
  },

  /** 从 pptx（zip 内 ppt/slides/slideN.xml 的 <a:t>）提取全部幻灯片文本 */
  async wzx_parsePptx(wzxBuffer) {
    const wzxZip = await JSZip.loadAsync(wzxBuffer);
    const wzxSlideFiles = Object.keys(wzxZip.files)
      .filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name))
      .sort((a, b) => {
        const na = Number(a.match(/slide(\d+)\.xml/)[1]);
        const nb = Number(b.match(/slide(\d+)\.xml/)[1]);
        return na - nb;
      });
    if (wzxSlideFiles.length === 0) {
      throw new Error('pptx 中未找到幻灯片内容');
    }
    const wzxParts = [];
    for (let i = 0; i < wzxSlideFiles.length; i++) {
      const wzxXml = await wzxZip.file(wzxSlideFiles[i]).async('string');
      const wzxTexts = [];
      const wzxRe = /<a:t>([\s\S]*?)<\/a:t>/g;
      let wzxMatch;
      while ((wzxMatch = wzxRe.exec(wzxXml)) !== null) {
        const wzxT = this.wzx_decodeXml(wzxMatch[1]).trim();
        if (wzxT) wzxTexts.push(wzxT);
      }
      if (wzxTexts.length > 0) {
        wzxParts.push('【幻灯片 ' + (i + 1) + '】' + wzxTexts.join('\n'));
      }
    }
    return wzxParts.join('\n\n');
  },

  /** 从旧版 .doc（OLE 二进制）提取文本 */
  async wzx_parseDoc(wzxBuffer) {
    const wzxExtractor = new WordExtractor();
    const wzxDoc = await wzxExtractor.extract(wzxBuffer);
    return wzxDoc.getBody() || '';
  },

  /**
   * 从旧版 .ppt（OLE 二进制）提取文本（启发式）：
   * 扫描 TextCharsAtom(recType=0x0FA0, UTF-16BE) 与 TextBytesAtom(recType=0x0FA8, ANSI) 记录
   */
  async wzx_parsePpt(wzxBuffer) {
    const wzxParts = [];
    for (let i = 0; i < wzxBuffer.length - 8; i++) {
      // 记录头：4 字节（recVerAndInstance 2字节 + recType 2字节小端）+ 4 字节长度（小端）
      const wzxType = wzxBuffer.readUInt16LE(i + 2);
      if (wzxType !== 0x0fa0 && wzxType !== 0x0fa8) continue;
      const wzxVer = wzxBuffer.readUInt16LE(i);
      if (wzxVer !== 0x00a0 && wzxVer !== 0x00b8) continue;
      try {
        const wzxLen = wzxBuffer.readUInt32LE(i + 4);
        if (wzxLen <= 0 || wzxLen > 8192 || i + 8 + wzxLen > wzxBuffer.length) continue;
        const wzxRaw = wzxBuffer.subarray(i + 8, i + 8 + wzxLen);
        let wzxText;
        if (wzxType === 0x0fa0) {
          wzxText = wzxRaw.swap16().toString('utf16le'); // UTF-16BE -> utf16le
        } else {
          wzxText = wzxRaw.toString('latin1');
        }
        wzxText = wzxText.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '').trim();
        if (wzxText.length >= 2 && /[\u4e00-\u9fa5a-zA-Z0-9]/.test(wzxText)) {
          wzxParts.push(wzxText);
        }
        i += 8 + wzxLen - 1;
      } catch (e) { /* 跳过非法记录 */ }
    }
    if (wzxParts.length === 0) {
      throw new Error('旧版 .ppt 为二进制格式，无法可靠提取文本，请用 PowerPoint/WPS 另存为 .pptx 后重新上传');
    }
    return wzxParts.join('\n');
  },

  /** 从 pdf 提取文本 */
  async wzx_parsePdf(wzxBuffer) {
    const wzxPdfParse = (await import('pdf-parse')).default;
    const wzxData = await wzxPdfParse(wzxBuffer);
    if (!wzxData.text || !wzxData.text.trim()) {
      throw new Error('PDF 中没有可提取的文字（可能是扫描件/图片型 PDF）');
    }
    return wzxData.text;
  },

  /** txt 直接读取 */
  wzx_parseTxt(wzxBuffer) {
    return wzxBuffer.toString('utf8');
  },

  /** 统一入口：按扩展名分发解析 */
  async wzx_extractText(wzxBuffer, wzxExt) {
    switch (wzxExt) {
      case 'txt': return this.wzx_parseTxt(wzxBuffer);
      case 'pdf': return this.wzx_parsePdf(wzxBuffer);
      case 'doc': return this.wzx_parseDoc(wzxBuffer);
      case 'docx': return this.wzx_parseDocx(wzxBuffer);
      case 'pptx': return this.wzx_parsePptx(wzxBuffer);
      case 'ppt': return this.wzx_parsePpt(wzxBuffer);
      default: throw new Error('暂不支持该文件类型：' + wzxExt);
    }
  },

  /** 简易 XML -> 文本：按段落标签分组，取 <w:t>/<a:t> 内容 */
  wzx_xmlToText(wzxXml, wzxParaTag) {
    const wzxParas = wzxXml.split(new RegExp('</' + wzxParaTag + '>'));
    const wzxLines = [];
    for (const wzxPara of wzxParas) {
      const wzxTexts = [];
      const wzxRe = /<w:t[^>]*>([\s\S]*?)<\/w:t>|<a:t>([\s\S]*?)<\/a:t>/g;
      let wzxMatch;
      while ((wzxMatch = wzxRe.exec(wzxPara)) !== null) {
        wzxTexts.push(this.wzx_decodeXml(wzxMatch[1] || wzxMatch[2] || ''));
      }
      const wzxLine = wzxTexts.join('').trim();
      if (wzxLine) wzxLines.push(wzxLine);
    }
    return wzxLines.join('\n');
  },

  wzx_decodeXml(wzxStr) {
    return String(wzxStr || '')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  },

  /**
   * 文本分块：按段落聚合，每块约 500 字（上限 600），块间保留语义完整
   */
  wzx_chunkText(wzxText, wzxMaxLen) {
    const wzxMax = wzxMaxLen || 500;
    const wzxClean = String(wzxText || '').replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
    if (!wzxClean) return [];

    const wzxParas = wzxClean.split('\n');
    const wzxChunks = [];
    let wzxCurrent = '';

    for (const wzxPara of wzxParas) {
      // 超长单段按句号切
      if (wzxPara.length > wzxMax) {
        const wzxSentences = wzxPara.split(/(?<=[。！？；.!?;])/);
        let wzxSub = '';
        for (const wzxSentence of wzxSentences) {
          if ((wzxSub + wzxSentence).length > wzxMax && wzxSub) {
            wzxChunks.push(wzxSub.trim());
            wzxSub = wzxSentence;
          } else {
            wzxSub += wzxSentence;
          }
        }
        if (wzxSub.trim()) {
          if (wzxCurrent) { wzxChunks.push(wzxCurrent.trim()); wzxCurrent = ''; }
          wzxCurrent = wzxSub;
        }
        continue;
      }
      if ((wzxCurrent + '\n' + wzxPara).length > wzxMax && wzxCurrent) {
        wzxChunks.push(wzxCurrent.trim());
        wzxCurrent = wzxPara;
      } else {
        wzxCurrent = wzxCurrent ? wzxCurrent + '\n' + wzxPara : wzxPara;
      }
    }
    if (wzxCurrent.trim()) wzxChunks.push(wzxCurrent.trim());
    return wzxChunks.filter(c => c.length >= 10);
  }
};

module.exports = wzx_fileParser;

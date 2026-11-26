# 接口记录（一律追加写入，禁止覆盖已有内容）

格式：接口路径 | HTTP 方法 | 请求参数（含示例）| 响应格式（含 JSON 示例）| 修改时间

---

GET /api/wzx_info | GET | 无参数 | 统一 JSON：{ "code": 0, "msg": "提示信息", "data": {...} }，示例：{ "code": 0, "msg": "获取站点信息成功", "data": { "wzx_student_name": "王治贤", "wzx_student_id": "24002120606", "wzx_project_name": "拾光集市（校园二手交易平台）", "wzx_project_type": "自选" } } | 2026-11-20

POST /api/db-test | POST | JSON body：{ "wzx_user": "root", "wzx_password": "root" }（主机名从 backend/.env 的 DB_HOST 读取）| 成功：{ "code": 0, "msg": "数据库连接成功", "data": { "wzx_db_version": "8.0.42" } }；失败：{ "code": 1, "msg": "数据库连接失败：<错误信息>", "data": null } | 2026-11-20

GET /api/news | GET | 无参数，返回全部新闻，按 publish_time 倒序 | 统一 JSON，data 为新闻数组，元素字段：id、title、summary、content、source、publish_time、cover_img，示例：{ "code": 0, "msg": "获取新闻列表成功", "data": [ { "id": 1, "title": "国产超大规模模型开源，推理成本再降一个数量级", "summary": "国内科研团队发布新一代开源大模型……", "content": "……", "source": "科技日报", "publish_time": "2026-11-19T09:30:00.000Z", "cover_img": "https://…" } ] } | 2026-11-20

GET /api/gallery | GET | 无参数，返回全部图文数据，按 create_time 倒序 | 统一 JSON，data 为图文数组，元素字段：id、title、description、img_url、category、create_time，示例：{ "code": 0, "msg": "获取图文列表成功", "data": [ { "id": 1, "title": "95新无线降噪耳机", "description": "自用一年的白色无线降噪耳机……", "img_url": "https://…", "category": "数码", "create_time": "2026-11-19T20:10:00.000Z" } ] } | 2026-11-20

POST /api/chat | POST | JSON body：{ "wzx_message": "你们美食街几点开门营业？", "wzx_session_id": "wzx_1795585796042_g72lj5", "wzx_provider": "siliconflow" }（wzx_message 必填 ≤500 字；wzx_session_id 可选，不传自动生成，同一会话有上下文记忆；wzx_provider 可选，siliconflow/qiniu，不传取 .env 的 AI_PROVIDER，支持热切换）| 成功：{ "code": 0, "msg": "回复成功", "data": { "wzx_reply": "美食街每天从10:00开始营业……", "wzx_session_id": "wzx_1795585796042_g72lj5", "wzx_provider": "siliconflow" } }；失败：{ "code": 1, "msg": "客服暂时开小差了：<错误信息>", "data": null }；客服人设为"中华美食街在线客服福福"（只答营业时间/招牌菜/配送范围），AI 可选硅基流动 Qwen/Qwen2.5-7B-Instruct 或七牛 qiniu/conatus-free，Key 从 backend/.env 读取，对话保存到 wzx_chat_message 表 | 2026-11-25

POST /api/kb/upload | POST | multipart/form-data，字段 wzx_file：上传的文件（支持 doc/docx/ppt/pptx/pdf/txt，≤10MB），中文文件名正常处理 | 成功：{ "code": 0, "msg": "上传并解析成功", "data": { "wzx_file_id": 3, "wzx_filename": "中华美食街商户手册.docx", "wzx_file_type": "docx", "wzx_file_size": 5423, "wzx_chunk_count": 2 } }；失败：{ "code": 1, "msg": "上传解析失败：<原因>", "data": null }；服务端解析文本后按约 500 字分块存入 wzx_kb_file / wzx_kb_chunk | 2026-11-25

GET /api/kb/files | GET | 无参数 | { "code": 0, "msg": "获取文件列表成功", "data": [ { "wzx_id": 3, "wzx_filename": "中华美食街商户手册.docx", "wzx_file_type": "docx", "wzx_file_size": 5423, "wzx_chunk_count": 2, "wzx_create_time": "2026-11-25T13:55:00.000Z" } ] } | 2026-11-25

DELETE /api/kb/files/:id | DELETE | 路径参数 id：文件ID，示例 /api/kb/files/3 | 成功：{ "code": 0, "msg": "删除成功", "data": null }；文件不存在：{ "code": 1, "msg": "文件不存在或已删除", "data": null }；同时删除该文件全部文本块 | 2026-11-25

POST /api/kb/ask | POST | JSON body：{ "wzx_question": "美食街有停车场吗？怎么收费？", "wzx_provider": "siliconflow" }（wzx_question 必填 ≤500 字；wzx_provider 可选 siliconflow/qiniu）| 成功：{ "code": 0, "msg": "回答成功", "data": { "wzx_answer": "美食街地下停车场对就餐顾客免费开放2小时……", "wzx_sources": [ { "wzx_file": "中华美食街商户手册.docx", "wzx_seq": 1, "wzx_score": 14 } ], "wzx_provider": "siliconflow" } }；失败：{ "code": 1, "msg": "知识库问答失败：<原因>", "data": null }；RAG 流程：问题 2-gram 关键词检索 wzx_kb_chunk 最相关 3 块 → 注入 system 提示词 → 调用大模型；服务端控制台输出发送/返回的完整数据 | 2026-11-25

POST /api/vision/describe | POST | multipart/form-data，字段 wzx_image：图片文件（png/jpg/webp/gif/bmp，≤10MB）| 成功：{ "code": 0, "msg": "识别成功", "data": { "wzx_description": "一副白色无线头戴式耳机静置于浅色木纹桌面上……", "wzx_model": "Qwen/Qwen3-VL-8B-Instruct", "wzx_file_type": "jpg", "wzx_file_size": 264270 } }；失败：{ "code": 1, "msg": "图像识别失败：<原因>", "data": null }；图片转 base64 data URL 后以 image_url 消息调用硅基流动视觉模型；服务端控制台输出发送（base64 截断展示）与返回的完整数据 | 2026-11-25

POST /api/asr/recognize | POST | multipart/form-data，字段 wzx_audio：音频文件（wav/mp3/m4a/webm/ogg/opus/aac/flac，≤20MB）| 成功：{ "code": 0, "msg": "识别成功", "data": { "wzx_text": "请把七元项目的报告发给罗科。下周我们要上线悬殊系统。", "wzx_provider": "siliconflow", "wzx_model": "Qwen/Qwen3-ASR-1.7B", "wzx_language": "Chinese", "wzx_file_size": 199378 } }；失败：{ "code": 1, "msg": "语音识别失败：<原因>", "data": null }；优先调用七牛 Qwen-Audio-3.0-ASR-Flash（chat/completions + input_audio），七牛通道不可用时自动降级硅基流动 /audio/transcriptions（Qwen/Qwen3-ASR-1.7B）；服务端控制台输出发送（base64 截断）与返回数据 | 2026-11-25

变更（2026-11-26）：/api/chat 与 /api/kb/ask 响应 data 新增 wzx_fallback 字段（boolean）；所选服务商（如七牛）调用失败时自动降级到硅基流动并返回 wzx_provider="siliconflow"、wzx_fallback=true，前端显示"已降级"标记。七牛 403 trial_period_expired（需实名认证）触发验证通过。 | 2026-11-26


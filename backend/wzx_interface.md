# 接口记录（一律追加写入，禁止覆盖已有内容）

格式：接口路径 | HTTP 方法 | 请求参数（含示例）| 响应格式（含 JSON 示例）| 修改时间

---

GET /api/wzx_info | GET | 无参数 | 统一 JSON：{ "code": 0, "msg": "提示信息", "data": {...} }，示例：{ "code": 0, "msg": "获取站点信息成功", "data": { "wzx_student_name": "王治贤", "wzx_student_id": "24002120606", "wzx_project_name": "拾光集市（校园二手交易平台）", "wzx_project_type": "自选" } } | 2026-11-20

POST /api/db-test | POST | JSON body：{ "wzx_user": "root", "wzx_password": "root" }（主机名从 backend/.env 的 DB_HOST 读取）| 成功：{ "code": 0, "msg": "数据库连接成功", "data": { "wzx_db_version": "8.0.42" } }；失败：{ "code": 1, "msg": "数据库连接失败：<错误信息>", "data": null } | 2026-11-20

GET /api/news | GET | 无参数，返回全部新闻，按 publish_time 倒序 | 统一 JSON，data 为新闻数组，元素字段：id、title、summary、content、source、publish_time、cover_img，示例：{ "code": 0, "msg": "获取新闻列表成功", "data": [ { "id": 1, "title": "国产超大规模模型开源，推理成本再降一个数量级", "summary": "国内科研团队发布新一代开源大模型……", "content": "……", "source": "科技日报", "publish_time": "2026-11-19T09:30:00.000Z", "cover_img": "https://…" } ] } | 2026-11-20

GET /api/gallery | GET | 无参数，返回全部图文数据，按 create_time 倒序 | 统一 JSON，data 为图文数组，元素字段：id、title、description、img_url、category、create_time，示例：{ "code": 0, "msg": "获取图文列表成功", "data": [ { "id": 1, "title": "95新无线降噪耳机", "description": "自用一年的白色无线降噪耳机……", "img_url": "https://…", "category": "数码", "create_time": "2026-11-19T20:10:00.000Z" } ] } | 2026-11-20

POST /api/chat | POST | JSON body：{ "wzx_message": "你们美食街几点开门营业？", "wzx_session_id": "wzx_1795585796042_g72lj5", "wzx_provider": "siliconflow" }（wzx_message 必填 ≤500 字；wzx_session_id 可选，不传自动生成，同一会话有上下文记忆；wzx_provider 可选，siliconflow/qiniu，不传取 .env 的 AI_PROVIDER，支持热切换）| 成功：{ "code": 0, "msg": "回复成功", "data": { "wzx_reply": "美食街每天从10:00开始营业……", "wzx_session_id": "wzx_1795585796042_g72lj5", "wzx_provider": "siliconflow" } }；失败：{ "code": 1, "msg": "客服暂时开小差了：<错误信息>", "data": null }；客服人设为"中华美食街在线客服福福"（只答营业时间/招牌菜/配送范围），AI 可选硅基流动 Qwen/Qwen2.5-7B-Instruct 或七牛 qiniu/conatus-free，Key 从 backend/.env 读取，对话保存到 wzx_chat_message 表 | 2026-11-25


# 接口记录（一律追加写入，禁止覆盖已有内容）

格式：接口路径 | HTTP 方法 | 请求参数（含示例）| 响应格式（含 JSON 示例）| 修改时间

---

GET /api/wzx_info | GET | 无参数 | 统一 JSON：{ "code": 0, "msg": "提示信息", "data": {...} }，示例：{ "code": 0, "msg": "获取站点信息成功", "data": { "wzx_student_name": "王治贤", "wzx_student_id": "24002120606", "wzx_project_name": "拾光集市（校园二手交易平台）", "wzx_project_type": "自选" } } | 2026-11-20

POST /api/db-test | POST | JSON body：{ "wzx_user": "root", "wzx_password": "root" }（主机名从 backend/.env 的 DB_HOST 读取）| 成功：{ "code": 0, "msg": "数据库连接成功", "data": { "wzx_db_version": "8.0.42" } }；失败：{ "code": 1, "msg": "数据库连接失败：<错误信息>", "data": null } | 2026-11-20

GET /api/news | GET | 无参数，返回全部新闻，按 publish_time 倒序 | 统一 JSON，data 为新闻数组，元素字段：id、title、summary、content、source、publish_time、cover_img，示例：{ "code": 0, "msg": "获取新闻列表成功", "data": [ { "id": 1, "title": "国产超大规模模型开源，推理成本再降一个数量级", "summary": "国内科研团队发布新一代开源大模型……", "content": "……", "source": "科技日报", "publish_time": "2026-11-19T09:30:00.000Z", "cover_img": "https://…" } ] } | 2026-11-20


# 接口记录（一律追加写入，禁止覆盖已有内容）

格式：接口路径 | HTTP 方法 | 请求参数（含示例）| 响应格式（含 JSON 示例）| 修改时间

---

GET /api/wzx_info | GET | 无参数 | 统一 JSON：{ "code": 0, "msg": "提示信息", "data": {...} }，示例：{ "code": 0, "msg": "获取站点信息成功", "data": { "wzx_student_name": "王治贤", "wzx_student_id": "24002120606", "wzx_project_name": "拾光集市（校园二手交易平台）", "wzx_project_type": "自选" } } | 2026-11-20

POST /api/db-test | POST | JSON body：{ "wzx_user": "root", "wzx_password": "root" }（主机名从 backend/.env 的 DB_HOST 读取）| 成功：{ "code": 0, "msg": "数据库连接成功", "data": { "wzx_db_version": "8.0.42" } }；失败：{ "code": 1, "msg": "数据库连接失败：<错误信息>", "data": null } | 2026-11-20

# 高级网页设计课程作业

- 姓名：王治贤
- 学号：24002120606
- 项目名称：拾光集市（校园二手交易平台）
- 项目类别：自选

## 项目结构

```
frontend/   前端（原生 HTML/CSS/JS，禁止第三方库与 CDN）
  ├── css/
  ├── js/
  ├── fonts/
  └── images/
backend/    后端（Node.js + Express，RESTful + MVC，端口 8606）
  ├── routes/
  ├── controllers/
  └── models/
```

## 启动方式

```bash
cd backend
npm i        # 依赖：express、cors、mysql2、dotenv
npm start    # 服务地址 http://localhost:8606，同时托管 frontend 静态资源
```

## 技术说明

- 所有接口以 /api/ 为前缀，统一 JSON 响应：`{ "code": 0, "msg": "提示信息", "data": {...} }`
- 数据库：MySQL，凭据保存在 backend/.env（不入库、不提交）
- 接口记录见 backend/wzx_interface.md，数据库重建 SQL 见 backend/wzx_database.md

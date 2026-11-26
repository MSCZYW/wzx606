# 提示词记录（追加写入，禁止覆盖）

2026-11-20 | 在当前项目根目录创建 AGENTS.md，写入以下规则。## 项目结构与技术栈 - 前端：frontend/ 目录，原生 HTML、CSS、JavaScript，禁止使用任何第三方库、框架、CDN 链接，目录结构：frontend/ 下建 css/、js/、fonts/、images/ 子目录，fonts/ 存放 iconfont 图标文件（如果有）。- 后端：backend/ 目录，Node.js + Express，RESTful+MVC 风格，所有接口以 /api/ 为前缀，端口固定为 8606。使用 express.static 托管 frontend/ 静态资源目录。后端通过 cors 中间件开放全部跨域访问，本配置仅用于课程作业。后端依赖安装：预先将 npm 源切换为国内镜像：npm config set registry https://registry.npmmirror.com；后端依赖安装：npm i 包名。数据库：MySQL（用户名 root、密码：root）。数据库凭据写入 backend/.env（变量名：DB_USER、DB_PASSWORD、DB_HOST、DB_NAME），不得出现在代码或 AGENTS.md 中；.env 同时加入 .gitignore。根据后端的要求自行建立和修改数据库表，每张表建立后，插入至少 8 条有真实业务意义的测试数据。## 命名与注释 - CSS 类名、JS 变量名、JS 函数名、数据库表名（及字段相关命名）一律以 wzx_ 开头。每个文件头部包含注释块：姓名：王治贤 | 学号：24002120606 | 时间：yyyy-mm-dd | 大模型：{本次使用的大模型名称}。## 记录文件（一律追加写入，禁止覆盖已有内容）- wangzhixian_prompt.md（项目根目录）：每次向 AI 发出开发指令后，追加记录：时间 | 提示词全文 | 大模型名称。- backend/wzx_interface.md：每次创建或修改接口后，追加：接口路径 | HTTP 方法 | 请求参数（含示例）| 响应格式（含 JSON 示例）| 修改时间。- backend/wzx_database.md：每次建表、改表或插入数据后，按执行顺序追加对应 SQL 语句（含测试数据的 INSERT），要求仅凭此文件即可在新机器上完整重建数据库。统一 JSON 响应格式：{ "code": 0, "msg": "提示信息", "data": {...} }，code=0 表示成功，非 0 表示失败。## 前端约定 - 服务器返回的数据和错误信息输出到浏览器控制台（console.log / console.error）；新建 HTML 页面后，在 frontend/index.html 中追加超链接入口；文件名包含 detail 的页面除外。 | 大模型：GLM-5.3-Flash

2026-11-20 | 请初始化本项目：1、git init + .gitignore（排除 node_modules、.env）+ 首次提交 2、按 AGENTS.md 规则创建前后端目录骨架、安装依赖、3、创建前端首页 index.html，包括王治贤、24002120606、项目名称、项目类别（自选、模仿），所有完成的 html 页面的超链接。有 canvas 背景动画。主体是页面链接导航。页面美观。4、创建 readme.md，在根目录下，包括学号、姓名。 | 大模型：GLM-5.3-Flash

2026-11-20 | 创建运行后台的 bat 文件，放在项目根目录：1、自动切换到 backend 目录再启动（用 %~dp0，双击时不受当前路径影响）；2、使用 chcp 65001 避免中文日志乱码；3、启动命令与 package.json 中的脚本保持一致；4、结尾加 pause，出错时窗口不关闭。 | 大模型：GLM-5.3-Flash

2026-11-20 | 在 frontend/ 下创建 database.html：1、页面有用户名、密码两个输入框，默认用户名 root，密码默认 root，一个"测试连接"按钮；2、点击后调用后端接口 /api/db-test，把用户名密码发给后端；3、后端用 mysql2 尝试连接 MySQL，成功返回 { code:0, msg:"数据库连接成功", data:{ 数据库版本 } }，失败返回 code 非 0 和错误信息；4、前端把结果显示在页面上：成功用绿色，失败用红色，同时在控制台输出；5、数据库凭据从 backend/.env 读取，不要写死在代码里；6、完成后在 frontend/index.html 加上本页面的超链接入口。 | 大模型：GLM-5.3-Flash

2026-11-20 | 完成科技新闻列表页面：1、在 MySQL 中建表 wzx_news，字段包含：id、title、summary、content、source、publish_time、cover_img；2、插入至少 8 条真实的科技新闻测试数据；3、后端提供 GET /api/news 接口，返回全部新闻（按发布时间倒序），统一 JSON 格式 { code, msg, data }；4、新建 frontend/news.html，页面顶部显示当前调用的接口地址，下方以列表展示新闻标题、摘要、来源、时间；5、数据用 fetch 获取，控制台输出返回数据；6、把建表与插入数据的 SQL 追加写入 backend/wzx_database.md，接口信息追加写入 backend/wzx_interface.md，本次提示词追加写入 wangzhixian_prompt.md；7、在 frontend/index.html 增加入口链接。 | 大模型：GLM-5.3-Flash

2026-11-20 | 完成图文列表页面：1、在 MySQL 中新建表 wzx_gallery，字段：id、title、description、img_url、category、create_time，插入至少 8 条测试数据；2、后端提供 GET /api/gallery 接口，返回全部图文数据；3、新建 frontend/gallery.html，页面顶部显示接口地址，下方用网格布局展示"上图下文"卡片：图片、标题、描述；4、图片加载失败时显示占位色块，不要出现破图图标；5、页面适配手机宽度；6、记录写入 backend/wzx_database.md、backend/wzx_interface.md 和 wangzhixian_prompt.md，并在首页加入口。 | 大模型：GLM-5.3-Flash

2026-11-20 | 帮我启动后端服务器 | 大模型：GLM-5.3-Flash

2026-11-20 | 帮我解决图片中的问题（图文展示页图片全部显示"The image is generating..."占位图。排查：text_to_image 在线图片生成服务持续返回同一占位图，无法出图。解决：本地生成 10 张按分类配色的 SVG 封面图到 frontend/images/，UPDATE wzx_gallery 表将 img_url 改为本地路径 /images/wzx_gallery_01.svg ~ 10.svg，页面立即正常显示） | 大模型：GLM-5.3-Flash

2026-11-20 | 删除原有图片，生成新的更加贴近现实的图片（在线生图服务仍卡死，改用 AI 图片生成工具生成 10 张写实风格 JPG 产品/场景照片，保存到 frontend/images/wzx_gallery_01.jpg ~ 10.jpg，删除原 10 张 SVG 封面，UPDATE wzx_gallery 将 img_url 后缀由 .svg 改为 .jpg） | 大模型：GLM-5.3-Flash

2026-11-25 | 使用硅基流动 完成在线客服页面（新建 wzx_chat_message 表存对话记录并插入 8 条测试数据；后端 MVC：POST /api/chat -> wzx_chatController -> wzx_customerService 调用硅基流动 chat/completions（Qwen/Qwen2.5-7B-Instruct，Key 从 .env 读取），带 10 条上下文记忆，回复保存数据库；前端 service.html 聊天界面：毛玻璃卡片 + canvas 粒子背景 + 消息气泡 + 快捷问题 + 清空会话，数据与错误输出到控制台；首页加入口；实测 AI 回复正常、上下文连贯） | 大模型：GLM-5.3-Flash

2026-11-25 | 完成图片中的任务（任务二客服人设改造：system 提示词改为"中华美食街在线客服福福"，只答营业时间/招牌菜/配送范围三类问题，其余固定话术引导留言；实测 3 个该答问题全部准确、2 个该拒问题全部正确拒答。任务三多平台热切换：后端服务商注册表+前端下拉框，wzx_provider 参数热切换硅基流动/七牛；硅基流动测试通过，七牛返回 403 需账号实名认证。答案文档 wangzhixian_task2_task3.md） | 大模型：GLM-5.3-Flash

2026-11-25 | 完成知识库文件上传功能，构建2个知识库文件，完成基于知识库的问答，支持doc和docx，ppt，完成知识库管理（RAG）：基于本地文件（如 PDF/TXT）上传、解析，构建专属自动客服或问答系统，包括知识库文件上传模块。在控制台输出发送给大模型的数据和接受自大模型的数据（新建 wzx_kb_file/wzx_kb_chunk 两表；解析器支持 txt/pdf/doc/docx/pptx/ppt；RAG：2-gram 关键词检索 top3 文本块注入 system 提示词；构建"中华美食街商户手册.docx"与"中华美食街常见问题.pptx"两个知识库文件并上传入库；前端 kb.html 上传+管理+问答三合一页面并加入首页入口；LLM 收发数据均输出到服务端控制台；修复 multer 中文文件名乱码与知识库命中时误拒答问题；实测会员/停车/招牌菜问题全部依据知识库正确回答并带来源） | 大模型：GLM-5.3-Flash

2026-11-25 | 完成图像识别功能，上传图片，返回该图片的描述，使用已有的api-key和模型（后端 MVC：POST /api/vision/describe -> wzx_visionController -> wzx_visionService，图片转 base64 data URL 调用硅基流动视觉模型 Qwen/Qwen3-VL-8B-Instruct（Key 从 .env 读取）；控制台输出发送/返回数据；前端 vision.html 拖拽/点击上传+预览+描述结果页并加入首页入口；用本地图片实测：白色耳机图识别描述准确） | 大模型：GLM-5.3-Flash

2026-11-25 | 实现一个语音识别的功能，使用七牛的Qwen-Audio-3.0-ASR-Flash模型，输入语音，输出文字（后端 MVC：POST /api/asr/recognize -> wzx_asrController -> wzx_asrService；优先调用七牛 Qwen-Audio-3.0-ASR-Flash（chat/completions + input_audio），实测七牛网关该模型无可用通道（no available channels，91 个模型中无 ASR），自动降级调用硅基流动 /audio/transcriptions 的 Qwen/Qwen3-ASR-1.7B（同为 Qwen 语音识别模型），响应标明实际服务商；控制台输出发送/接收数据；前端 asr.html：MediaRecorder 麦克风录音（浏览器 webm 前端解码重采样为 16kHz 单声道 wav 上传保证兼容）+ 音频文件上传 + 播放预览 + 转写结果页，加入首页入口；用官方示例语音实测："请把七元项目的报告发给罗科。下周我们要上线悬殊系统。"转写准确） | 大模型：GLM-5.3-Flash

2026-11-26 | 解决图中问题：用户直接双击打开 html（file:// 协议）导致相对路径 fetch 变成 file:///api/chat 请求失败报"网络异常"。修复：全部 8 个前端 JS 文件统一增加 wzx_apiBase 判断（http/https 用同源，file:// 打开自动指向 http://localhost:8606），11 处 fetch 调用与 6 处接口地址显示全部改用基地址（后端 cors 全开放，file:// 也能调通） | 大模型：GLM-5.3-Flash

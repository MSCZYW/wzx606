# wzx_prompt.md — 提示词记录

---

## 2026-11-18
- **时间**：2026-11-18
- **使用的模型**：GLM-5.3-Flash（Trae AI）
- **提示词内容**：
  > 设置规则：从现在开始，所有CSS类名，id名、js变量都以wzx_开始，所有的提示词都在执行之前写入文件wzx_prompt.md，以附加的方式写入，不覆盖之前的内容，写入的内容包括时间、使用的模型、提示词内容。

---

## 2026-11-18
- **时间**：2026-11-18
- **使用的模型**：GLM-5.3-Flash（Trae AI）
- **提示词内容**：
  > 设置规则：所有新建的html文件加入超链接入口到首页index.html

---

## 2026-11-18
- **时间**：2026-11-18
- **使用的模型**：GLM-5.3-Flash（Trae AI）
- **提示词内容**：
  > 将以往历史对话全部记录

---

# 历史对话记录（由记忆系统追溯整理）

> 说明：以下内容根据 Trae 记忆系统中的历史会话记录整理。历史会话未记录所用模型，统一标注为"未记录"。

## 2026-10-23（早期会话，上课代码工作区）
- **模型**：未记录
- **提示词/对话内容**：
  1. 在上课代码文件夹下创建 `skills/frontend-design` 目录，并放入用户上传的 SKILL.md（前端视觉设计指导原则），最终路径为 wzxczy/skills/frontend-design/SKILL.md。
  2. 设置全局项目规则：所有 CSS 类名、id 名、JS 变量以 `wy_` 开头；提示词以追加方式写入 `wy_prompt.md`；写入内容包含时间、模型、提示词。
  3. 将命名前缀从 `wy_` 更新为 `wzx_`，提示词记录文件从 `wy_prompt.md` 更新为 `wzx_prompt.md`；并新增规则：所有新建 HTML 文件必须加入指向首页 index.html 的超链接入口。

## 2026-11-04
- **模型**：未记录
- **提示词/对话内容**：
  1. 创建提交到 GitHub 的技能：将当前项目 commit 并 push 到 https://github.com/MSCZYW/wzx606，使用已配置好的 ed25519 SSH 公钥认证。
  2. 新建包含四个选项卡（国内新闻【默认】、省内新闻、国际新闻、最热新闻）的 HTML 文件；Tab 逻辑封装为可复用类放在 js 文件夹外部引用；点击逻辑先清除所有选中状态再设置当前元素选中状态。已完成 `新闻tab.html` 和 `js/tab.js`，含规范文件头注释与函数注释。

## 2026-11-11（会话 6af40a88…，Swiper 任务）
- **模型**：未记录
- **提示词/对话内容**：
  1. 完成代码中的任务四，实现指定的 Swiper 轮播功能及效果切换（循环、动画时长、自动播放、分页等），封装为 `createWySw4` 函数，实现按钮切换效果并高亮当前按钮（改动位于 swiper-task.html L255-L285）。
  2. 生成包含指定配置的 Swiper 完整 HTML 页面：cube 效果、自动轮播、圆点分页、循环播放，CDN 引入 Swiper 11，选择器 `#wySw4`（创建 swiper-cube-demo.html）。
  3. 修改 Swiper 配置：无缝循环、3200ms 自动轮播且手动操作后不停止（disableOnInteraction: false）、可点击分页圆点、cube 效果，输出完整单页面 HTML。
  4. 为光影展厅页面新增切换按钮，实现 creative 自定义电影墙效果，并解释 creativeEffect 中 prev/next 的 transform 作用（新增按钮 #wyFxToggle）。
  5. 询问 transform 百分比参照对象；将 next 的 rotate 由 [0,0,6] 改为 [0,20,0]（绕 Y 轴翻转 20 度进场）并说明 rotate 数组对应 rotateX/Y/Z。
  6. 新增爱达·魔都号展品 slide（16:9 横版图片）+ mousewheel 滚轮控制翻页（含 releaseOnEdges: true），保留原有 cube、creative 效果。

## 2026-11-13（会话 6af40a88…，Swiper 后续）
- **模型**：未记录
- **提示词/对话内容**：
  1. 在光影展厅页面新增爱达·魔都号展品 slide（16:9 横版）及 mousewheel 滚轮控制翻页，保留 cube/creative 效果、3200ms 自动轮播、循环、可点击分页圆点、效果切换按钮，输出完整单页 HTML。
  2. 按指定配置修改 Swiper 实例：选择器 `#wySw4`、固定 cube 效果、loop 无缝循环、3200ms 自动轮播且手动滑动后不停止、可点击圆点分页；修改 swiper-cube-demo.html，移除多余配置，用户确认后执行。

## 2026-11-18（会话 6afd3b98…，Swiper 任务修正）
- **模型**：未记录
- **提示词/对话内容**：
  1. 针对 `#wySw4` 编写 Swiper 配置：cube 效果、自动轮播、圆点分页，附参数要点说明。
  2. 同意按给定方案修改：添加 grabCursor: true 与 cubeEffect 阴影选项，初始效果改为 cube，按钮高亮同步至 cube 按钮。
  3. 修正 `#wySw4` 的 Swiper 配置：cube 效果、无缝循环、指定参数自动播放、可点击圆点分页，修改 swiper-task.html 并同步 JSDoc 注释。
  4. 新增【creative 电影墙】按钮，实现上一页缩小左移旋转、下一页放大从右侧进场的电影胶片感效果，并添加参数注释。
  5. 完成三项修改：新增第 6 个爱达·魔都号展品 slide、添加 mousewheel 滚轮控制（releaseOnEdges 兼容 loop）、编写参数说明，并提供 16:9 横版 AI 绘图提示词。
  6. 将爱达魔都号幻灯片图片引用替换为本地文件 swiper-imgs/adora_1.jpg（4 个演示台统一修改）。
  7. 将 AI 提示词插入任务四卡片下方（swiper-task.html 任务四要求卡），去掉原提示词第一个和最后一个内容，以 `<code>` 绿色代码样式展示。

## 2026-11-18（当前会话 6afd437b…，规则设置）
- **模型**：GLM-5.3-Flash（Trae AI）
- **提示词内容**：见上方"2026-11-18"各条记录（wzx_ 前缀规则、wzx_prompt.md 记录规则、index.html 超链接入口规则、历史对话记录）。

---

## 2026-11-18
- **时间**：2026-11-18
- **使用的模型**：GLM-5.3-Flash（Trae AI）
- **提示词内容**：
  > 在swiper-task中加入ai提示词入口，提示词在`d:/高级网页设计/wzxczy/wzx_prompt.md`中

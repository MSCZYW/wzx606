---
name: wzxczy-web
description: Use whenever working on the 高级网页设计 classroom project (wzxczy) — 王治贤's advanced web design homepage, which uses native HTML/CSS only (no CDN), Flexbox layouts, iconfont font icons, and inline SVG icons. Helps with editing pages, adding classroom-practice modules, running/previewing, and committing changes.
---

# 高级网页设计课堂实践项目 (wzxczy-web)

## 项目概况

- 项目主页：`index.html` — 王治贤《高级网页设计》课堂实践目录页
- 技术方式：原生 HTML + CSS，**不使用任何 CDN / 外部库**
- 页面语言：中文（`lang="zh-CN"`）
- 目标：整理并展示高级网页设计课堂练习模块

## 目录结构

- `index.html` 主页，包含所有模块的统一入口（课堂目录）
- `flex布局复习.html` Flex 布局复习页（导航布局 / 三等分布局 / 响应式卡片网格 / 侧边栏布局），配套 `css/flex布局复习.css`
- `svg.html` SVG 图标页（内联 SVG + 图标角标），配套 `css/svg.css`
- `font/` iconfont 字体图标资源（iconfont.css / .js / .json / .ttf / .woff / .woff2 等）
- `css/` 各页面的样式文件

## 开发约定

1. 只使用原生 HTML/CSS，禁止引入 CDN。
2. 页面间跳转使用相对路径（如 `./flex布局复习.html`、`./font/demo_index.html`）。
3. 新增课堂练习模块：
   - 新建独立的 `xxx.html` 页面，并视情况在 `css/` 下创建对应样式；
   - 在 `index.html` 的“课堂目录”区域添加一个 `.module` 卡片并链接新页面；
   - 保持与现有页面一致的视觉风格（圆角卡片、渐变配色、`Microsoft YaHei` 字体）。
4. 字体图标统一使用 `font/iconfont.css` 中已有的 iconfont 类。

## 预览与验证

- 直接用浏览器打开对应的 `.html` 文件即可预览（纯静态页面）。
- 修改后检查：页面可正常打开、样式无错乱、所有相对链接可用、无外部 CDN 请求。

## 提交约定

- 提交信息使用中文，格式如：`添加 XXX 课堂练习模块`。
- 本项目按“学号+姓名”文件夹（如 `24002120606王治贤/`）整体提交到 Gitee 班级仓库。
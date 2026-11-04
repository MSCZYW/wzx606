# QQ音乐移动端复刻项目

> 姓名：王治贤　学号：24002120606

## 项目介绍

本项目模仿 QQ 音乐 APP 制作了一款手机端网页应用，共包含 **9 个页面**，覆盖一级页面、二级页面、三级页面、个人中心、后台管理等完整结构。项目以 **星空黑** 为主色调，风格简洁，适配手机端浏览。

### 页面清单

| 序号 | 文件名 | 页面名称 | 页面层级 |
| ---- | ------ | -------- | -------- |
| 1 | index.html | 首页（发现音乐） | 一级页面 |
| 2 | category.html | 栏目首页（音乐分类） | 二级页面 |
| 3 | detail.html | 歌曲详情（内容页） | 三级页面 |
| 4 | mine.html | 我的（个人中心） | 个人页面 |
| 5 | setting.html | 个人设置 | 个人页面 |
| 6 | search.html | 搜索页面 | 功能页面 |
| 7 | playlist.html | 我的歌单 | 功能页面 |
| 8 | player.html | 播放页面 | 功能页面 |
| 9 | admin.html | 后台管理 | 后台页面 |

## 技术架构

- **HTML5**：页面结构，语义化标签
- **CSS3**：页面样式，采用 flex 弹性布局（不使用表格布局、不使用 Bootstrap 等框架）
- **原生 JavaScript**：页面交互逻辑（不使用 jQuery、Vue、React、Tailwind 等框架）
- **本地资源**：不使用 mock 接口，所有数据（推荐歌单、栏目、歌曲详情、用户信息）均存放在本地 JS 数据文件 `js/wzx-data.js` 中，直接读取

### 目录结构

```
qqmusic-wzx/
├── README.md                # 项目说明文档
├── index.html               # 首页【一级页面】
├── category.html            # 栏目首页【二级页面】
├── detail.html              # 歌曲详情【三级页面】
├── mine.html                # 我的（个人中心）
├── setting.html             # 个人设置
├── search.html              # 搜索页面
├── playlist.html            # 歌单列表页
├── player.html              # 播放页面
├── admin.html               # 后台管理页面
├── css/                     # 独立 CSS 目录（命名含学号姓名）
├── js/                      # JavaScript 脚本目录
│   └── wzx-data.js          # 本地数据源（不使用 mock，全部本地资源）
├── img/                     # 图片资源目录（英文文件名）
```

## JavaScript 交互效果（共 7 个，满足 >=6 要求）

1. 首页滚动时顶部导航透明度渐变
2. 歌曲列表点击打开 / 关闭播放弹窗
3. 播放进度条点击拖拽调整
4. 分类卡片悬浮上浮动画
5. 设置页主题深色 / 浅色切换
6. 搜索框输入联想提示下拉
7. 后台表单新增歌曲并渲染列表

## 本地数据清单（4 组，全部为本地资源，不使用 mock）

| 数据 | 说明 | 存放位置 |
| ---- | ---- | -------- |
| recommend | 首页推荐歌单 | `js/wzx-data.js` |
| category | 分类栏目及歌曲 | `js/wzx-data.js` |
| songDetail | 歌曲详情内容 | `js/wzx-data.js` |
| userInfo | 用户个人信息 | `js/wzx-data.js` |

## 安装运行指南

1. 将整个 `qqmusic-wzx` 文件夹下载到本地。
2. 使用 VSCode 打开项目根目录，并安装 **Live Server** 插件。
3. 右键 `index.html` 选择 "Open with Live Server"，浏览器访问 `http://127.0.0.1:5500/index.html` 即可预览。
4. 由于项目不使用 mock 接口、全部资源均为本地文件，也可以**直接双击 `index.html` 打开预览**，无需启动服务器。
5. 也可以将项目部署到任意静态服务器（如 GitHub Pages、Gitee Pages、Nginx）。

> 提示：图片文件放置于 `img/` 目录，项目中已预留图片引用位置（如封面图、头像、图标），替换同名文件即可生效。

## Git 提交规范（示例）

```
feat: 初始化项目目录结构与 README
feat: 完成首页结构与样式，fetch 加载推荐歌单
feat: 完成栏目页与分类 mock 接口
feat: 完成歌曲详情页与播放弹窗交互
feat: 完成我的页面与用户信息接口
feat: 完成设置页主题切换功能
feat: 完成搜索联想 JS 效果
feat: 完成后台管理页面与表单新增功能
fix: 移动端适配优化
```

## 遵守的作业约束

- 不使用表格布局、Bootstrap、jQuery、Vue、React、Tailwind、Flash
- 目录结构清晰、命名规范，首页命名为 index
- 图片独立存放于 `img/` 目录，不使用中文目录名和中文文件名
- 每个页面注释均包含学号和姓名：24002120606 王治贤
- 页面布局选择器（id / class）均以 `wzx` 开头

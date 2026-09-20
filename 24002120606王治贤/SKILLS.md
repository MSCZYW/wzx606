# 项目技能说明 (SKILLS.md)

> 《高级网页设计》课堂实践项目 · 学生：王治贤 · 学号：24002120606

## 一、项目简介

本仓库用于提交高级网页设计课堂实践作品。所有页面均使用**原生 HTML + CSS** 制作，**不使用任何 CDN 或外部库**。

## 二、目录结构

```
24002120606王治贤/
├── index.html              主页 · 课堂目录（含全部模块入口）
├── flex布局复习.html        Flex 布局复习 · 四大布局案例
├── svg.html                 SVG 图标页（内联 SVG + 角标）
├── css/
│   ├── flex布局复习.css
│   └── svg.css
├── font/                    iconfont 字体图标资源
└── README.md / README.en.md / .gitignore
```

## 三、本项目的技能点

### 1. Flex 布局（flex布局复习.html）
- 案例一：导航布局（`justify-content: space-between` 等）
- 案例二：三等分布局（`flex: 1` 均分）
- 案例三：响应式卡片网格（`flex-wrap` + 媒体查询）
- 案例四：侧边栏布局（`flex-direction` 双向布局）

### 2. 响应式设计（index.html）
- `clamp()` 流式字号、`min(1100px, 92%)` 容器宽度
- `grid-template-columns` 栅格布局
- `@media (max-width: 760px)` 移动端单列回退

### 3. 字体图标（font/）
- 使用 iconfont 字体图标（`.iconfont` 类），支持 `ttf / woff / woff2` 多格式
- 参考页面：`font/demo_index.html`

### 4. SVG 图标（svg.html）
- 内联 SVG 绘制图标（tab 导航、角标 `budge-dot` / `budge-num`）
- 通过选项激活状态（`.tab-item.active`）切换样式

### 5. 视觉与动效（index.html）
- CSS 渐变配色（`linear-gradient`）、毛玻璃卡片（`#ffffffc9` 半透明）
- 卡片悬停上浮动效（`transform: translateY(-6px)`）

## 四、如何使用

1. 用浏览器直接打开 `index.html` 预览主页；
2. 通过主页中“课堂目录”的卡片链接进入各练习模块；
3. 修改页面后重新打开浏览器即可刷新查看效果。

## 五、提交说明

- 管理员/教师仓库：`https://gitee.com/neusoft_wangyao_jsj/wzxczy`
- 每人以 `学号+姓名` 文件夹形式提交，见本目录命名。
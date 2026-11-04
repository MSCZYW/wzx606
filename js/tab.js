/**
 * Tab 选项卡可复用组件
 * 使用方式：new Tab('.news-tabs', 0) — 传入容器选择器和默认激活索引
 */
class Tab {
  /**
   * 构造函数：保存配置并立即完成初始化
   * @param {string} selector - 整个选项卡容器的 CSS 选择器
   * @param {number} defaultIndex - 默认激活的选项卡索引，默认 0
   */
  constructor(selector, defaultIndex = 0) {
    this.container = document.querySelector(selector);
    if (!this.container) {
      console.error('Tab 初始化失败：未找到容器', selector);
      return;
    }

    // 获取容器内所有 tab 按钮与对应内容面板
    this.buttons = this.container.querySelectorAll('.tab-btn');
    this.panels = this.container.querySelectorAll('.tab-panel');
    this.defaultIndex = defaultIndex;

    this.init();
  }

  /**
   * 初始化：遍历所有 tab 按钮绑定点击事件，并主动激活默认选项卡
   */
  init() {
    // 给每个按钮绑定点击事件监听器
    this.buttons.forEach((btn, index) => {
      btn.addEventListener('click', () => this.handleClick(index));
    });

    // 页面加载后主动设置默认激活项，确保按钮与面板成对高亮
    this.activate(this.defaultIndex);
  }

  /**
   * 点击处理函数：先清除所有选中态，再设置当前元素为选中态
   * （严格按照"先清后设"的顺序，避免残留 active）
   * @param {number} index - 被点击按钮对应的索引
   */
  handleClick(index) {
    this.deactivateAll();
    this.activate(index);
  }

  /**
   * 清除所有 tab 按钮和内容面板的选中状态
   * 遍历 buttons 和 panels，逐一移除 active 类
   */
  deactivateAll() {
    this.buttons.forEach(btn => btn.classList.remove('active'));
    this.panels.forEach(panel => panel.classList.remove('active'));
  }

  /**
   * 激活指定索引的 tab 按钮及其对应内容面板
   * 同时给按钮和面板加上 active 类，形成选中态
   * @param {number} index - 目标选项卡索引
   */
  activate(index) {
    if (index < 0 || index >= this.buttons.length) return;
    this.buttons[index].classList.add('active');
    this.panels[index].classList.add('active');
  }
}

// 页面加载完成后实例化 Tab 组件，默认激活第 0 个（国内新闻）
window.addEventListener('DOMContentLoaded', () => {
  // 功能名称：初始化新闻选项卡，将 .news-tabs 容器交给 Tab 组件管理
  new Tab('.news-tabs', 0);
});

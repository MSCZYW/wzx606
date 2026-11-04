/*
 * 作者：王治贤
 * 建立时间：2026-11-04
 * 使用大模型：Trae AI
 * 功能：沪深股票涨跌 Tab 切换的可复用脚本
 * 规则：所有变量、函数、常量均以 wzx_ 开头
 */

/**
 * 清空指定容器内所有 Tab 按钮和面板的 wzx_active 选中态
 * 功能：先清除所有选中状态，为切换到新 Tab 做准备
 * @param {HTMLElement} wzx_cardEl - 整个选项卡组件的根元素
 */
function wzx_deactivateAll(wzx_cardEl) {
  wzx_cardEl.querySelectorAll('.wzx_tab_btn').forEach(function (btn) {
    btn.classList.remove('wzx_active');
  });
  wzx_cardEl.querySelectorAll('.wzx_panel').forEach(function (panel) {
    panel.classList.remove('wzx_active');
  });
}

/**
 * 激活指定索引的 Tab 按钮及对应面板
 * 功能：先清后设 —— 调用 wzx_deactivateAll 清空，再给当前索引元素加 wzx_active
 * @param {HTMLElement} wzx_cardEl - 组件根元素
 * @param {number} wzx_index - 要激活的索引
 */
function wzx_switchTab(wzx_cardEl, wzx_index) {
  // 先清除所有选项卡的选中状态
  wzx_deactivateAll(wzx_cardEl);

  // 再设置当前按钮与面板为选中态
  wzx_cardEl.querySelector('.wzx_tab_btn[data-wzx-index="' + wzx_index + '"]').classList.add('wzx_active');
  wzx_cardEl.querySelector('.wzx_panel[data-wzx-panel="' + wzx_index + '"]').classList.add('wzx_active');
}

/**
 * 页面加载完成后，为 .wzx_tab_btn 批量绑定点击监听事件
 * 功能：点击任意按钮时，读取 data-wzx-index 并执行 wzx_switchTab
 */
window.addEventListener('DOMContentLoaded', function () {
  // 获取页面内所有 Tab 组件根元素
  var wzx_cards = document.querySelectorAll('.wzx_card');

  // 遍历每个组件，为其内部按钮绑定事件
  wzx_cards.forEach(function (wzx_cardEl) {
    var wzx_btns = wzx_cardEl.querySelectorAll('.wzx_tab_btn');

    wzx_btns.forEach(function (wzx_btn) {
      // 监听每个按钮的点击事件
      wzx_btn.addEventListener('click', function () {
        var wzx_index = parseInt(wzx_btn.getAttribute('data-wzx-index'), 10);
        wzx_switchTab(wzx_cardEl, wzx_index);
      });
    });
  });
});

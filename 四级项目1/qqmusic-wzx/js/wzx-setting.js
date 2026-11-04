// 姓名：王治贤 学号：24002120606 设置页脚本
// JS效果5：主题深色 / 浅色切换
const wzxThemeBtn = document.getElementById('wzx-theme-btn');
let wzxDarkMode = true;
wzxThemeBtn.addEventListener('click', function () {
    wzxDarkMode = !wzxDarkMode;
    if (wzxDarkMode) {
        document.body.style.backgroundColor = '#0b0b18';
        document.body.style.color = '#ffffff';
        wzxThemeBtn.textContent = '切换浅色';
    } else {
        document.body.style.backgroundColor = '#f4f6ff';
        document.body.style.color = '#111111';
        wzxThemeBtn.textContent = '切换深色';
    }
});

// 自动播放开关记忆
const wzxAutoPlay = document.getElementById('wzx-auto-play');
wzxAutoPlay.addEventListener('change', function () {
    const state = wzxAutoPlay.checked ? '开启' : '关闭';
    console.log('自动播放已' + state);
});

// 清除播放缓存
document.getElementById('wzx-clear-btn').addEventListener('click', function () {
    alert('播放缓存已清空');
});

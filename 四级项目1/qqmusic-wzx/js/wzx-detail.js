// 姓名：王治贤 学号：24002120606 歌曲详情页脚本
// 数据3：读取本地歌曲详情数据（不使用 mock）
function loadSongDetail() {
    const song = wzxGetData('songDetail');
    const wrap = document.querySelector('.wzx-detail-wrap');
    if (!song) {
        wrap.innerHTML = '<div class="wzx-card">歌曲详情加载失败</div>';
        return;
    }
    wrap.innerHTML =
        '<h2 class="wzx-detail-song">' + song.songName + '</h2>' +
        '<div class="wzx-detail-meta">歌手：' + song.singer + '</div>' +
        '<div class="wzx-detail-meta">专辑：' + song.album + '</div>';
    document.querySelector('.wzx-lyric').textContent = song.lyric;
}
loadSongDetail();

// JS效果3：播放弹窗打开 / 关闭
const wzxPopup = document.querySelector('.wzx-player-popup');
document.querySelector('.wzx-play-btn').addEventListener('click', function () {
    wzxPopup.classList.remove('wzx-hidden');
});
document.querySelector('.wzx-close-popup').addEventListener('click', function () {
    wzxPopup.classList.add('wzx-hidden');
});
wzxPopup.addEventListener('click', function (event) {
    if (event.target === wzxPopup) {
        wzxPopup.classList.add('wzx-hidden');
    }
});

// JS效果4：播放进度条点击拖拽调整
const wzxBar = document.querySelector('.wzx-progress-bar');
const wzxInner = document.querySelector('.wzx-progress-inner');
wzxBar.addEventListener('click', function (event) {
    const rect = wzxBar.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    const percent = Math.max(0, Math.min(pos * 100, 100));
    wzxInner.style.width = percent + '%';
});

// 姓名：王治贤 学号：24002120606 首页脚本
// JS效果1：滚动监听，顶部导航透明度渐变
(function initHeader() {
    const header = document.querySelector('.wzx-header');
    window.addEventListener('scroll', function () {
        const scrollTop = window.scrollY;
        const opacity = Math.min(scrollTop / 120, 0.92);
        header.style.backgroundColor = 'rgba(11, 11, 24, ' + opacity + ')';
    });
})();

// 数据1：读取本地推荐歌单数据（不使用 mock）
function loadRecommend() {
    const recommendList = wzxGetData('recommend');
    const wrap = document.querySelector('.wzx-recommend-list');
    if (!recommendList) {
        wrap.innerHTML = '<div class="wzx-card">推荐数据加载失败</div>';
        return;
    }
    recommendList.forEach(function (item) {
        const div = document.createElement('div');
        div.className = 'wzx-card wzx-song-card';
        div.innerHTML =
            '<img src="' + item.cover + '" alt="' + item.title + '">' +
            '<div><div class="wzx-song-title">' + item.title + '</div>' +
            '<div class="wzx-song-meta">' + item.author + ' · ' + item.playCount + '次播放</div></div>';
        div.addEventListener('click', function () {
            location.href = 'detail.html?id=' + item.id;
        });
        wrap.appendChild(div);
    });
}
loadRecommend();

// 姓名：王治贤 学号：24002120606 栏目页脚本
// 数据2：读取本地分类栏目及歌曲数据（不使用 mock）
function loadCategory() {
    const cateList = wzxGetData('category');
    const wrap = document.querySelector('.wzx-category-list');
    if (!cateList) {
        wrap.innerHTML = '<div class="wzx-card">栏目数据加载失败</div>';
        return;
    }
    cateList.forEach(function (cate) {
        const box = document.createElement('div');
        box.className = 'wzx-card wzx-cate-card';
        box.innerHTML = '<div class="wzx-cate-name">' + cate.cateName + '</div>';
        const songWrap = document.createElement('div');
        cate.songList.forEach(function (song) {
            const sDiv = document.createElement('div');
            sDiv.className = 'wzx-song-line';
            sDiv.textContent = song.name + ' - ' + song.singer;
            sDiv.addEventListener('click', function () {
                location.href = 'detail.html?id=' + song.sid;
            });
            songWrap.appendChild(sDiv);
        });
        box.appendChild(songWrap);
        wrap.appendChild(box);
    });
    // JS效果2：卡片悬浮上浮动画（touch / mouse）
    bindCateAnimation();
}
loadCategory();

function bindCateAnimation() {
    const cards = document.querySelectorAll('.wzx-cate-card');
    cards.forEach(function (card) {
        card.addEventListener('touchstart', function () {
            card.style.transform = 'translateY(-4px)';
        });
        card.addEventListener('touchend', function () {
            card.style.transform = 'translateY(0px)';
        });
    });
}

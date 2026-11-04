// 姓名：王治贤 学号：24002120606 我的页面脚本
// 数据4：读取本地用户个人信息数据（不使用 mock）
function loadUserInfo() {
    const user = wzxGetData('userInfo');
    const wrap = document.querySelector('.wzx-user-card');
    if (!user) {
        wrap.innerHTML = '<div class="wzx-card">用户信息加载失败</div>';
        return;
    }
    wrap.innerHTML =
        '<img src="' + user.avatar + '" alt="头像">' +
        '<div><div class="wzx-user-name">' + user.userName + '</div>' +
        '<div class="wzx-user-stats">收藏 ' + user.favoriteNum + ' 首 · 历史 ' + user.historyNum + ' 首</div></div>';
}
loadUserInfo();

// 我的收藏 / 播放历史点击反馈
document.querySelector('.wzx-fav-btn').addEventListener('click', function () {
    alert('当前共收藏 18 首歌曲');
});
document.querySelector('.wzx-history-btn').addEventListener('click', function () {
    alert('当前共播放历史 32 条记录');
});

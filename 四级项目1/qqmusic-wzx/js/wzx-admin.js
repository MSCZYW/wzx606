// 姓名：王治贤 学号：24002120606 后台管理页脚本
// JS效果8：后台表单新增歌曲并渲染列表
const wzxAddBtn = document.getElementById('wzx-add-song');
const wzxAdminList = document.querySelector('.wzx-song-admin-list');

// 初始展示 mock 中的两首歌曲作为示例数据
(function initAdminList() {
    const seedData = [
        { name: '流行曲目1', singer: '歌手A' },
        { name: '古风曲目1', singer: '歌手C' }
    ];
    seedData.forEach(function (song) {
        wzxAppendSong(song.name, song.singer);
    });
})();

function wzxAppendSong(name, singer) {
    const div = document.createElement('div');
    div.className = 'wzx-admin-row';
    div.textContent = name + ' - ' + (singer || '未知歌手');
    wzxAdminList.appendChild(div);
}

wzxAddBtn.addEventListener('click', function () {
    const songName = document.getElementById('wzx-song-name').value.trim();
    const songSinger = document.getElementById('wzx-song-singer').value.trim();
    if (!songName) {
        alert('请输入歌曲名称');
        return;
    }
    wzxAppendSong(songName, songSinger);
    document.getElementById('wzx-song-name').value = '';
    document.getElementById('wzx-song-singer').value = '';
});

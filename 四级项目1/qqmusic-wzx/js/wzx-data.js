// 姓名：王治贤 学号：24002120606 本地数据源
// 不使用 mock 接口，所有数据均为本地资源，直接读取即可
const wzxData = {
    // 首页推荐歌单
    recommend: [
        { id: 1, title: '星空夜曲', cover: 'img/cover1.png', author: '歌手A', playCount: '128万' },
        { id: 2, title: '晚风漫游', cover: 'img/cover2.png', author: '歌手B', playCount: '96万' },
        { id: 3, title: '深海回响', cover: 'img/cover3.png', author: '歌手C', playCount: '201万' },
        { id: 4, title: '银河漫游指南', cover: 'img/cover4.png', author: '歌手D', playCount: '75万' }
    ],
    // 栏目首页分类及歌曲
    category: [
        {
            id: 101,
            cateName: '流行',
            songList: [
                { sid: 1001, name: '流行曲目1', singer: '歌手A' },
                { sid: 1002, name: '流行曲目2', singer: '歌手B' }
            ]
        },
        {
            id: 102,
            cateName: '古风',
            songList: [
                { sid: 2001, name: '古风曲目1', singer: '歌手C' },
                { sid: 2002, name: '古风曲目2', singer: '歌手D' }
            ]
        },
        {
            id: 103,
            cateName: '电子',
            songList: [
                { sid: 3001, name: '电音曲目1', singer: '歌手E' },
                { sid: 3002, name: '电音曲目2', singer: '歌手F' }
            ]
        }
    ],
    // 歌曲详情内容页
    songDetail: {
        sid: 1001,
        songName: '流行曲目1',
        singer: '歌手A',
        album: '星河专辑',
        lyric: '星光落在窗前，晚风轻轻蔓延\n城市灯火明灭，回忆渐渐浮现\n你哼着熟悉的旋律\n一步一步走进我心里'
    },
    // 用户个人信息
    userInfo: {
        uid: 24002120606,
        userName: '王治贤',
        avatar: 'img/logo.png',
        favoriteNum: 18,
        historyNum: 32
    }
};

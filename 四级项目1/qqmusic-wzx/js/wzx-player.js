// 姓名：王治贤 学号：24002120606 播放页脚本
// JS效果7：模拟播放进度推进 + 播放/暂停切换
const wzxProgressInner = document.querySelector('.wzx-progress-inner');
const wzxTimeCur = document.querySelector('.wzx-time-cur');
const wzxTimeDur = document.querySelector('.wzx-time-dur');
const wzxToggleBtn = document.querySelector('.wzx-toggle-btn');

let wzxIsPlaying = true;
let wzxCurrentSecond = 0;
const wzxTotalSecond = 225; // 3分45秒
let wzxTimer = null;

function wzxFormatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
}

function wzxTick() {
    wzxCurrentSecond++;
    if (wzxCurrentSecond > wzxTotalSecond) {
        wzxCurrentSecond = 0;
    }
    const percent = (wzxCurrentSecond / wzxTotalSecond) * 100;
    wzxProgressInner.style.width = percent + '%';
    wzxTimeCur.textContent = wzxFormatTime(wzxCurrentSecond);
}

wzxTimer = setInterval(wzxTick, 1000);

wzxToggleBtn.addEventListener('click', function () {
    wzxIsPlaying = !wzxIsPlaying;
    if (wzxIsPlaying) {
        wzxTimer = setInterval(wzxTick, 1000);
        wzxToggleBtn.textContent = '暂停';
    } else {
        clearInterval(wzxTimer);
        wzxToggleBtn.textContent = '播放';
    }
});

// 上一曲 / 下一曲
document.querySelector('.wzx-prev-btn').addEventListener('click', function () {
    wzxCurrentSecond = 0;
    wzxProgressInner.style.width = '0%';
    wzxTimeCur.textContent = '00:00';
});
document.querySelector('.wzx-next-btn').addEventListener('click', function () {
    wzxCurrentSecond = 0;
    wzxProgressInner.style.width = '0%';
    wzxTimeCur.textContent = '00:00';
});

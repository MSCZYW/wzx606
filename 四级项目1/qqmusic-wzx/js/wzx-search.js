// 姓名：王治贤 学号：24002120606 搜索页脚本
// JS效果6：搜索联想下拉提示
const wzxSearchInput = document.querySelector('.wzx-search-input');
const wzxSuggest = document.querySelector('.wzx-suggest');
const wzxHotWords = ['星空夜曲', '晚风漫游', '深海回响', '银河漫游指南', '流行曲目1', '古风曲目1'];

wzxSearchInput.addEventListener('input', function () {
    const value = this.value.trim();
    wzxSuggest.innerHTML = '';
    if (value.length === 0) {
        wzxSuggest.classList.add('wzx-hidden');
        return;
    }
    const filterWords = wzxHotWords.filter(function (word) {
        return word.indexOf(value) !== -1;
    });
    if (filterWords.length > 0) {
        wzxSuggest.classList.remove('wzx-hidden');
        filterWords.forEach(function (word) {
            const div = document.createElement('div');
            div.textContent = word;
            div.addEventListener('click', function () {
                wzxSearchInput.value = word;
                wzxSuggest.classList.add('wzx-hidden');
            });
            wzxSuggest.appendChild(div);
        });
    } else {
        wzxSuggest.classList.add('wzx-hidden');
    }
});

// 渲染热门搜索词
(function renderHotWords() {
    const wrap = document.querySelector('.wzx-hot-words');
    wzxHotWords.forEach(function (word) {
        const span = document.createElement('span');
        span.className = 'wzx-hot-word';
        span.textContent = word;
        span.addEventListener('click', function () {
            wzxSearchInput.value = word;
        });
        wrap.appendChild(span);
    });
})();

import '../css/popup.less';
import ClipboardJS from 'clipboard';

function generateList (type, list) {
    let result = '';
    if (list && list.length) {
        document.querySelector(`.${type}`).style.display = 'block';
        list.forEach((item) => {
            result += `
            <li class="rss-item">
                <img class="rss-image" src="${item.image}">
                <div class="rss-info">
                    <div class="rss-title">${item.title}</div>
                    <div class="rss-url">${item.url}</div>
                </div>
                <div class="rss-action rss-copy" data-clipboard-text="${item.url}">复制</div>
            </li>
            `
        });
    }
    return result;
}

const background = chrome.extension.getBackgroundPage();
document.querySelector('.page-rss ul').innerHTML = generateList('page-rss', background.pageRSS);

const clipboard = new ClipboardJS('.rss-copy');
clipboard.on('success', function(e) {
    e.trigger.innerHTML = '已复制';
    setTimeout(() => {
        e.trigger.innerHTML = '复制';
    }, 1000);
});

document.querySelectorAll('.rss-info').forEach((ele) => {
    ele.addEventListener('click', () => {
        chrome.tabs.create({
            url: ele.querySelector('.rss-url').innerHTML,
        });
    });
});
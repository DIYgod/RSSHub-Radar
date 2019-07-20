import '../../css/popup.less';
import ClipboardJS from 'clipboard';

function generateList (type, list) {
    let result = '';
    if (list && list.length) {
        list.forEach((item) => {
            result += `
            <li class="rss-item">
                <img class="rss-image" src="${item.image}">
                <a href="${item.url}" class="rss-info">
                    <div class="rss-title">${item.title}</div>
                    <div class="rss-url">${item.url}</div>
                </a>
                <div class="rss-action rss-copy" data-clipboard-text="${item.url}">复制</div>
            </li>
            `
        });
        document.querySelector(`.${type} ul`).innerHTML = result;
        document.querySelector('.no-rss').style.display = 'none';
        document.querySelector(`.${type}`).style.display = 'block';
    }
}

const background = chrome.extension.getBackgroundPage();
generateList('page-rss', background.pageRSS);

const clipboard = new ClipboardJS('.rss-copy');
clipboard.on('success', function(e) {
    e.trigger.innerHTML = '已复制';
    setTimeout(() => {
        e.trigger.innerHTML = '复制';
    }, 1000);
});

document.querySelectorAll('a').forEach((ele) => {
    ele.addEventListener('click', () => {
        chrome.tabs.create({
            url: ele.getAttribute('href'),
        });
    });
});
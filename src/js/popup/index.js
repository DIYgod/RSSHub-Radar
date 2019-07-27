import '../../css/popup.less';
import ClipboardJS from 'clipboard';
import { getConfig } from '../utils';
let config;

function generateList (type, list) {
    let result = '';
    if (list && list.length) {
        list.forEach((item) => {
            const url = item.url.replace('{rsshubDomain}', config.rsshubDomain);
            result += `
            <li class="rss-item">
                <img class="rss-image" src="${item.image || './rsshub.png'}">
                <a href="${url}" class="rss-info">
                    <div class="rss-title">${item.title}</div>
                    <div class="rss-url">${url.replace('https://', '').replace('http://', '')}</div>
                </a>
                ${item.isDescription ?
                `<a href="${url}" class="rss-action">文档</a>` :
                `<div class="rss-action rss-copy" data-clipboard-text="${url}">复制</div>`
                }
            </li>
            `
        });
        document.querySelector(`.${type} ul`).innerHTML = result;
        document.querySelector('.no-rss').style.display = 'none';
        document.querySelector(`.${type}`).style.display = 'block';
    }
}

chrome.runtime.getBackgroundPage((background) => {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        const tabId = tabs[0].id;

        getConfig((conf) => {
            config = conf;
            generateList('page-rss', background.pageRSS[tabId]);
            generateList('page-rsshub', background.pageRSSHub[tabId]);
            generateList('website-rsshub', background.websiteRSSHub[tabId]);
    
            const clipboard = new ClipboardJS('.rss-copy');
            clipboard.on('success', function(e) {
                e.trigger.innerHTML = '已复制';
                setTimeout(() => {
                    e.trigger.innerHTML = '复制';
                }, 1000);
            });
    
            document.querySelectorAll('.rss-image').forEach((ele) => {
                ele.addEventListener('error', function () {
                    this.setAttribute('src', './rsshub.png');
                });
            });
    
            document.querySelectorAll('a').forEach((ele) => {
                ele.addEventListener('click', () => {
                    chrome.tabs.create({
                        url: ele.getAttribute('href'),
                    });
                });
            });
        });
    });
});
import '../../css/popup.less';
import ClipboardJS from 'clipboard';
import { getConfig } from '../common/config';
import settingIcon from '../../svg/setting.svg';
import aboutIcon from '../../svg/about.svg';
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
                `<div class="rss-action rss-copy" data-clipboard-text="${url}">复制</div>
                ${config.submitto.ttrss && config.submitto.ttrssDomain ? `<a href="${config.submitto.ttrssDomain.replace(/\/$/, '')}/public.php?op=subscribe&feed_url=${url}" class="rss-action rss-submitto-ttrss">订阅到 TTRSS</a>` : ''}
                ${config.submitto.feedly ? `<a href="https://feedly.com/i/subscription/feed/${url}" class="rss-action rss-submitto-feedly">订阅到 Feedly</a>` : ''}
                ${config.submitto.inoreader ? `<a href="https://www.inoreader.com/?add_feed=${url}" class="rss-action rss-submitto-inoreader">订阅到 Inoreader</a>` : ''}`
                }
            </li>
            `
        });
        document.querySelector(`.${type} ul`).innerHTML = result;
        document.querySelector(`.${type}`).style.display = 'block';
        document.body.classList.add('something');
    }
}

document.querySelector('.icons-setting').innerHTML = settingIcon;
document.querySelector('.icons-about').innerHTML = aboutIcon;

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
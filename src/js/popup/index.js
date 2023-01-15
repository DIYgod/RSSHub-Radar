import '../../css/popup.less';
import ClipboardJS from 'clipboard';
import { getConfig } from '../common/config';
import i18n from '../common/i18n';
import settingIcon from '../../svg/setting.svg';
import aboutIcon from '../../svg/about.svg';
import MD5 from 'md5.js';

let config;
let favicon;
let title;

function generateList(type, list) {
    let result = '';
    if (list && list.length) {
        list.forEach((item) => {
            const replaced_url = item.url.replace('{rsshubDomain}', config.rsshubDomain);
            const url = encodeURI(
                type !== 'page-rsshub' || !config.rsshubAccessControl.enabled
                    ? replaced_url
                    : config.rsshubAccessControl.useCode
                    ? `${replaced_url}?code=${new MD5().update(item.path + config.rsshubAccessControl.accessKey).digest('hex')}`
                    : `${replaced_url}?key=${config.rsshubAccessControl.accessKey}`
            );
            result += `
            <li class="rss-item">
                <img class="rss-image" src="${item.image || './rsshub.png'}">
                <a href="${url}" class="rss-info">
                    <div class="rss-title">${item.title}</div>
                    <div class="rss-url">${url.replace('https://', '').replace('http://', '')}</div>
                </a>
                ${
                    item.isDocs
                        ? `<a href="${url}" class="rss-action">${i18n.t('documentation')}</a>`
                        : `<div class="rss-action rss-copy" data-clipboard-text="${url}">${i18n.t('copy')}</div>
                ${
                    config.submitto.checkchan && config.submitto.checkchanBase
                        ? `<a href="${config.submitto.checkchanBase.replace(/\/$/, '')}/index.html#/check/add?title=${encodeURI(title)}&url=${encodeURI(url)}&type=rss&icon=${encodeURI(
                              favicon
                          )}" class="rss-action rss-submitto-checkchan">${i18n.t('subscribe to')} CheckChan</a>`
                        : ''
                }
                ${
                    config.submitto.ttrss && config.submitto.ttrssDomain
                        ? `<a href="${config.submitto.ttrssDomain.replace(/\/$/, '')}/public.php?op=bookmarklets--subscribe&feed_url=${encodeURI(url)}" class="rss-action rss-submitto-ttrss">${i18n.t('subscribe to')} TTRSS</a>`
                        : ''
                }
                ${
                    config.submitto.miniflux && config.submitto.minifluxDomain
                        ? `<a href="${config.submitto.minifluxDomain.replace(/\/$/, '')}/bookmarklet?uri=${encodeURI(url)}" class="rss-action rss-submitto-miniflux">${i18n.t('subscribe to')} Miniflux</a>`
                        : ''
                }
                ${
                    config.submitto.freshrss && config.submitto.freshrssDomain
                        ? `<a href="${config.submitto.freshrssDomain.replace(/\/$/, '')}/i/?c=feed&a=add&url_rss=${encodeURI(url)}" class="rss-action rss-submitto-freshrss">${i18n.t('subscribe to')} FreshRSS</a>`
                        : ''
                }
                ${
                    config.submitto.nextcloudnews && config.submitto.nextcloudnewsDomain
                        ? `<a href="${config.submitto.nextcloudnewsDomain.replace(/\/$/, '')}/?subscribe_to=${encodeURI(url)}" class="rss-action rss-submitto-nextcloudnews">${i18n.t('subscribe to')} Nextcloud News</a>`
                        : ''
                }
                ${config.submitto.feedly ? `<a href="https://feedly.com/i/subscription/feed/${encodeURI(url)}" class="rss-action rss-submitto-feedly">${i18n.t('subscribe to')} Feedly</a>` : ''}
                ${
                    config.submitto.inoreader && config.submitto.inoreaderDomain
                        ? `<a href="${config.submitto.inoreaderDomain.replace(/\/$/, '')}/?add_feed=${encodeURI(url)}" class="rss-action rss-submitto-inoreader">${i18n.t('subscribe to')} Inoreader</a>`
                        : ''
                }
                ${
                    config.submitto.feedbin && config.submitto.feedbinDomain
                        ? `<a href="${config.submitto.feedbinDomain.replace(/\/$/, '')}/?subscribe=${encodeURI(url)}" class="rss-action rss-submitto-feedbin">${i18n.t('subscribe to')} Feedbin</a>`
                        : ''
                }
                ${config.submitto.theoldreader ? `<a href="https://theoldreader.com/feeds/subscribe?url=${encodeURI(url)}" class="rss-action rss-submitto-theoldreader">${i18n.t('subscribe to')} The Old Reader</a>` : ''}
                ${config.submitto.feedspub ? `<a href="https://feeds.pub/feed/${encodeURIComponent(url)}" class="rss-action rss-submitto-feedspub">${i18n.t('subscribe to')} Feeds.Pub</a>` : ''}
                ${config.submitto.bazqux ? `<a href="https://bazqux.com/add?url=${encodeURIComponent(url)}" class="rss-action rss-submitto-bazqux">${i18n.t('subscribe to')} BazQux Reader</a>` : ''}
                ${config.submitto.local ? `<a href="feed://${url}" class="rss-action rss-submitto-local">${i18n.t('subscribe to local reader')}</a>` : ''}`
                }
            </li>
            `;
        });
        document.querySelector(`.${type} ul`).innerHTML = result;
        document.querySelector(`.${type}`).style.display = 'block';
        document.body.classList.add('something');
    }
}

document.querySelector('.icons-setting').innerHTML = settingIcon;
document.querySelector('.icons-about').innerHTML = aboutIcon;

const translatableNodes = document.querySelectorAll('[data-i18n]');
[...translatableNodes].forEach((element) => {
    element.innerHTML = i18n.t(element.innerHTML);
});

chrome.tabs.query(
    {
        active: true,
        currentWindow: true,
    },
    (tabs) => {
        const tabId = tabs[0].id;
        title = tabs[0].title || '';
        favicon = tabs[0].favIconUrl || '/favicon.ico';
        getConfig((conf) => {
            config = conf;
            chrome.runtime.sendMessage(
                null,
                {
                    text: 'getAllRSS',
                    tabId: tabId,
                },
                (feeds) => {
                    generateList('page-rss', feeds.pageRSS);
                    generateList('page-rsshub', feeds.pageRSSHub);
                    generateList('website-rsshub', feeds.websiteRSSHub);

                    const clipboard = new ClipboardJS('.rss-copy');
                    clipboard.on('success', function (e) {
                        e.trigger.innerHTML = i18n.t('copied');
                        setTimeout(() => {
                            e.trigger.innerHTML = i18n.t('copy');
                        }, 1000);
                    });

                    document.querySelectorAll('.rss-image').forEach((ele) => {
                        ele.addEventListener('error', function () {
                            this.setAttribute('src', './rsshub.png');
                        });
                    });

                    document.querySelectorAll('a').forEach((ele) => {
                        ele.addEventListener('click', (e) => {
                            e.preventDefault();
                            chrome.tabs.create({
                                url: ele.getAttribute('href'),
                            });
                            window.close();
                        });
                    });
                }
            );
        });
    }
);

import '../css/popup.less';

const background = chrome.extension.getBackgroundPage();

function generateList (list) {
    let result = '';
    if (list && list.length) {
        list.forEach((item) => {
            result += `
            <li>
                <img src="${item.image}">
                <div class="title">${item.title}</div>
                <a class="url" href="${item.url}">${item.url}</a>
            </li>
            `
        });
    }
    return result;
}

document.querySelector('.page-rss ul').innerHTML = generateList(background.pageRSS);
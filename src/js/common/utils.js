import crypto from 'crypto';

export function secondToTime(second) {
    const hour = Math.floor(second / 3600);
    const min = Math.floor((second - hour * 3600) / 60);
    return `${hour ? hour + '小时' : ''}${min}分钟`;
}

const iframe = document.querySelector('#sandbox');
const returnResults = [];
window.addEventListener('message', (event) => {
    returnResults.forEach((returnResult) => {
        returnResult(event);
    });
});
export function commandSandbox(command, data, callback) {
    iframe.contentWindow.postMessage(
        {
            command: command,
            data: data,
        },
        '*'
    );

    const myReturn = (event) => {
        if (event.data.origin.command === command && (!data.url || event.data.origin.data.url === data.url)) {
            returnResults.splice(returnResults.indexOf(myReturn), 1);
            if (event.data && event.data.result) {
                callback(event.data.result);
            }
        }
    };
    returnResults.push(myReturn);
}

export function md5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

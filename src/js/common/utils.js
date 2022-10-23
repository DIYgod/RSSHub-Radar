export function secondToTime(second) {
    const hour = Math.floor(second / 3600);
    const min = Math.floor((second - hour * 3600) / 60);
    return `${hour ? hour + 'h ' : ''}${min}min `;
}

export function secondToHoursMinutes(second) {
    const hours = Math.floor(second / 3600);
    const minutes = Math.floor((second - hours * 3600) / 60);
    return { hours, minutes };
}

const iframe = document.querySelector('#sandbox');
const returnResults = [];
window.addEventListener('message', (event) => {
    returnResults.forEach((returnResult) => {
        returnResult(event);
    });
});
export function commandSandbox(command, data, callback) {
    if (data.rules && typeof data.rules === 'object') {
        try {
            callback(iframe.contentWindow[command](data));
            return;
        } catch (e) {
            // nothing
        }
    }
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

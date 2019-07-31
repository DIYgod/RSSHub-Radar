export function secondToTime (second) {
    const hour = Math.floor(second / 3600);
    const min = Math.floor((second - hour * 3600) / 60);
    return `${hour ? hour + '小时' : ''}${min}分钟`;
}
export function secondToTime (second) {
    const hour = Math.floor(second / 3600);
    const min = Math.floor((second - hour * 3600) / 60);
    const sec = Math.floor(second - hour * 3600 - min * 60);
    return `${hour ? hour + '小时' : ''}${min ? min + '分钟' : ''}${sec}秒`;
}
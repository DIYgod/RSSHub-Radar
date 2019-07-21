module.exports = {
    'bilibili.com': {
        www: [{
            title: 'bilibili - 分区视频',
            source: '/v/*tpath',
            target: (params) => {
                let tid;
                switch (params.tpath) {
                    case 'douga/mad':
                        tid = '24';
                        break;
                }
                return `/bilibili/partion/${tid}`;
            },
        }],
        space: [{
            title: 'bilibili - UP 主动态',
            source: '/:uid',
            target: '/bilibili/user/dynamic/:uid'
        }, {
            title: 'bilibili - UP 主投稿',
            source: '/:uid',
            target: '/bilibili/user/video/:uid'
        }],
    },
    'weibo.com': {
        '.': [{
            title: '微博 - 博主',
            source: '/u/:id',
            target: '/weibo/user/:uid',
            script: '{uid: $CONFIG.uid}',
        }],
        '.': [{
            title: '微博 - 博主',
            source: '/:id',
            target: '/weibo/user/:uid',
            script: '({uid: document.querySelector(\'head\').innerHTML.match(/\\$CONFIG\\[\'uid\']=\'(\\d+)\'/)[1]})',
        }],
    }
};
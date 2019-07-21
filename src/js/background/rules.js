module.exports = {
    'bilibili.com': {
        www: [{
            title: '分区视频',
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
            title: 'UP 主动态',
            source: '/:uid',
            target: '/bilibili/user/dynamic/:uid'
        }, {
            title: 'UP 主投稿',
            source: '/:uid',
            target: '/bilibili/user/video/:uid'
        }],
    },
    'weibo.com': {
        '.': [{
            title: '博主',
            source: '/:id',
            target: '/weibo/user/:uid',
            script: '{uid: $CONFIG.uid}',
        }],
    }
};
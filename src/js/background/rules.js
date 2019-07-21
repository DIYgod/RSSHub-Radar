module.exports = {
    'bilibili.com': {
        www: [{
            title: 'bilibili - 分区视频',
            description: 'https://docs.rsshub.app/social-media.html#%E5%88%86%E5%8C%BA%E8%A7%86%E9%A2%91',
            source: '/v/*tpath',
            target: (params) => {
                let tid;
                switch (params.tpath) {
                    case 'douga/mad':
                        tid = '24';
                        break;
                    default:
                        return false;
                }
                return `/bilibili/partion/${tid}`;
            },
        }],
        space: [{
            title: 'bilibili - UP 主动态',
            description: 'https://docs.rsshub.app/social-media.html#up-%E4%B8%BB%E5%8A%A8%E6%80%81',
            source: '/:uid',
            target: '/bilibili/user/dynamic/:uid'
        }, {
            title: 'bilibili - UP 主投稿',
            description: 'https://docs.rsshub.app/social-media.html#up-%E4%B8%BB%E6%8A%95%E7%A8%BF',
            source: '/:uid',
            target: '/bilibili/user/video/:uid'
        }],
    },
    'weibo.com': {
        '.': [{
            title: '微博 - 博主',
            description: 'https://docs.rsshub.app/social-media.html#%E5%8D%9A%E4%B8%BB',
            source: '/u/:id',
            target: '/weibo/user/:uid',
            script: '{uid: $CONFIG.uid}',
        }],
        '.': [{
            title: '微博 - 博主',
            description: 'https://docs.rsshub.app/social-media.html#%E5%8D%9A%E4%B8%BB',
            source: '/:id',
            target: '/weibo/user/:uid',
            script: '({uid: document.querySelector(\'head\').innerHTML.match(/\\$CONFIG\\[\'uid\']=\'(\\d+)\'/)[1]})',
        }],
    }
};
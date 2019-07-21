module.exports = {
    'bilibili.com': {
        www: [{
            title: 'bilibili 分区视频',
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
            title: 'bilibili UP 主动态',
            description: 'https://docs.rsshub.app/social-media.html#up-%E4%B8%BB%E5%8A%A8%E6%80%81',
            source: '/:uid',
            target: '/bilibili/user/dynamic/:uid'
        }, {
            title: 'bilibili UP 主投稿',
            description: 'https://docs.rsshub.app/social-media.html#up-%E4%B8%BB%E6%8A%95%E7%A8%BF',
            source: '/:uid',
            target: '/bilibili/user/video/:uid'
        }],
    },
    'weibo.com': {
        '.': [{
            title: '微博博主',
            description: 'https://docs.rsshub.app/social-media.html#%E5%8D%9A%E4%B8%BB',
            source: '/u/:id',
            target: '/weibo/user/:uid',
            script: '{uid: $CONFIG.uid}',
        }],
        '.': [{
            title: '微博博主',
            description: 'https://docs.rsshub.app/social-media.html#%E5%8D%9A%E4%B8%BB',
            source: '/:id',
            target: '/weibo/user/:uid',
            script: '({uid: document.querySelector(\'head\').innerHTML.match(/\\$CONFIG\\[\'uid\']=\'(\\d+)\'/)[1]})',
        }],
    },
    'twitter.com': {
        '.': [{
            title: 'Twitter 用户时间线',
            description: 'https://docs.rsshub.app/social-media.html#%E7%94%A8%E6%88%B7%E6%97%B6%E9%97%B4%E7%BA%BF',
            source: '/:id',
            target: '/twitter/user/:id',
        }, {
            title: 'Twitter 用户关注时间线',
            description: 'https://docs.rsshub.app/social-media.html#%E7%94%A8%E6%88%B7%E5%85%B3%E6%B3%A8%E6%97%B6%E9%97%B4%E7%BA%BF',
            source: '/:id',
            target: '/twitter/followings/:id',
        }, {
            title: 'Twitter 用户喜欢列表',
            description: 'https://docs.rsshub.app/social-media.html#%E7%94%A8%E6%88%B7%E5%96%9C%E6%AC%A2%E5%88%97%E8%A1%A8',
            source: '/:id',
            target: '/twitter/likes/:id',
        }, {
            title: 'Twitter 列表时间线',
            description: 'https://docs.rsshub.app/social-media.html#%E5%88%97%E8%A1%A8%E6%97%B6%E9%97%B4%E7%BA%BF',
            source: '/:id/lists/:name',
            target: '/twitter/list/:id/:name',
        }],
    },
};
module.exports = {
    'bilibili.com': {
        www: [{
            title: 'bilibili 分区视频',
            description: 'https://docs.rsshub.app/social-media.html#bilibili',
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
            description: 'https://docs.rsshub.app/social-media.html#bilibili',
            source: '/:uid',
            target: '/bilibili/user/dynamic/:uid'
        }, {
            title: 'bilibili UP 主投稿',
            description: 'https://docs.rsshub.app/social-media.html#bilibili',
            source: '/:uid',
            target: '/bilibili/user/video/:uid'
        }],
    },
    'weibo.com': {
        '.': [{
            title: '微博博主',
            description: 'https://docs.rsshub.app/social-media.html#%E5%BE%AE%E5%8D%9A',
            source: ['/u/:id', '/:id'],
            target: '/weibo/user/:uid',
            script: '({uid: document.querySelector(\'head\').innerHTML.match(/\\$CONFIG\\[\'uid\']=\'(\\d+)\'/)[1]})',
            verification: (params) => params.uid,
        }],
    },
    'pixiv.net': {
        'www': [{
            title: 'Pixiv 用户收藏',
            description: 'https://docs.rsshub.app/social-media.html#pixiv',
            source: '/bookmark.php',
            target: (params, url) => `/pixiv/user/bookmarks/${new URL(url).searchParams.get('id')}`,
        }, {
            title: 'Pixiv 用户动态',
            description: 'https://docs.rsshub.app/social-media.html#pixiv',
            source: '/member.php',
            target: (params, url) => `/pixiv/user/bookmarks/${new URL(url).searchParams.get('id')}`,
        }, {
            title: 'Pixiv 排行榜',
            description: 'https://docs.rsshub.app/social-media.html#pixiv',
            source: '/ranking.php',
            target: (params, url) => `/pixiv/user/bookmarks/${new URL(url).searchParams.get('id')}`,
        }, {
            title: 'Pixiv 关键词',
            description: 'https://docs.rsshub.app/social-media.html#pixiv',
            source: '/search.php',
            target: (params, url) => `/pixiv/user/bookmarks/${new URL(url).searchParams.get('id')}`,
        }],
    },
    'twitter.com': {
        '.': [{
            title: 'Twitter 用户时间线',
            description: 'https://docs.rsshub.app/social-media.html#twitter',
            source: '/:id',
            target: '/twitter/user/:id',
            verification: (params) => (params.id !== 'home' && params.id !== 'explore' && params.id !== 'notifications' && params.id !== 'messages' && params.id !== 'explore'),
        }, {
            title: 'Twitter 用户关注时间线',
            description: 'https://docs.rsshub.app/social-media.html#twitter',
            source: '/:id',
            target: '/twitter/followings/:id',
            verification: (params) => (params.id !== 'home' && params.id !== 'explore' && params.id !== 'notifications' && params.id !== 'messages' && params.id !== 'explore'),
        }, {
            title: 'Twitter 用户喜欢列表',
            description: 'https://docs.rsshub.app/social-media.html#twitter',
            source: '/:id',
            target: '/twitter/likes/:id',
            verification: (params) => (params.id !== 'home' && params.id !== 'explore' && params.id !== 'notifications' && params.id !== 'messages' && params.id !== 'explore'),
        }, {
            title: 'Twitter 列表时间线',
            description: 'https://docs.rsshub.app/social-media.html#twitter',
            source: '/:id/lists/:name',
            target: '/twitter/list/:id/:name',
            verification: (params) => (params.id !== 'home' && params.id !== 'explore' && params.id !== 'notifications' && params.id !== 'messages' && params.id !== 'explore'),
        }],
    },
    'youtube.com': {
        'www': [{
            title: 'Youtube 用户',
            description: 'https://docs.rsshub.app/social-media.html#youtube',
            source: '/user/:username',
            target: '/youtube/user/:username',
        }, {
            title: 'Youtube 频道',
            description: 'https://docs.rsshub.app/social-media.html#youtube',
            source: '/channel/:id',
            target: '/youtube/channel/:id',
        }, {
            title: 'Youtube 播放列表',
            description: 'https://docs.rsshub.app/social-media.html#youtube',
            source: '/playlist',
            target: (params, url) => `/youtube/playlist/${new URL(url).searchParams.get('list')}`,
        }],
    },
    'github.com': {
        '.': [{
            title: 'GitHub 用户仓库',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/:user',
            target: '/github/repos/:user',
        }, {
            title: 'GitHub 用户 Followers',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/:user',
            target: '/github/user/followers/:user',
        }, {
            title: 'GitHub Trending',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/trending',
            target: '/github/trending/:since',
        }, {
            title: 'GitHub 仓库 Issue',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: ['/:user/:repo/issues', '/:user/:repo/issues/:id', '/:user/:repo'],
            target: '/github/issue/:user/:repo',
        }, {
            title: 'GitHub 仓库 Pull Requests',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: ['/:user/:repo/pulls', '/:user/:repo/pulls/:id', '/:user/:repo'],
            target: '/github/pull/:user/:repo',
        }, {
            title: 'GitHub 仓库 Stars',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: ['/:user/:repo/stargazers', '/:user/:repo'],
            target: '/github/stars/:user/:repo',
        }, {
            title: 'GitHub 仓库 Branches',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: ['/:user/:repo/branches', '/:user/:repo'],
            target: '/github/branches/:user/:repo',
        }, {
            title: 'GitHub 文件 Commits',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/:user/:repo/blob/:branch/*filepath',
            target: '/github/file/:user/:repo/:branch/:filepath',
        }],
    },
    'zhihu.com': {
        'www': [{
            title: '知乎收藏夹',
            description: 'https://docs.rsshub.app/social-media.html#%E7%9F%A5%E4%B9%8E',
            source: '/collection/:id',
            target: '/zhihu/collection/:id',
        }, {
            title: '知乎用户动态',
            description: 'https://docs.rsshub.app/social-media.html#%E7%9F%A5%E4%B9%8E',
            source: '/people/:id/activities',
            target: '/zhihu/people/activities/:id',
        }, {
            title: '知乎用户回答',
            description: 'https://docs.rsshub.app/social-media.html#%E7%9F%A5%E4%B9%8E',
            source: '/people/:id/answers',
            target: '/zhihu/people/answers/:id',
        }, {
            title: '知乎用户想法',
            description: 'https://docs.rsshub.app/social-media.html#%E7%9F%A5%E4%B9%8E',
            source: '/people/:id/pins',
            target: '/zhihu/people/pins/:id',
        },  {
            title: '知乎热榜',
            description: 'https://docs.rsshub.app/social-media.html#%E7%9F%A5%E4%B9%8E',
            source: '/hot',
            target: '/zhihu/hotlist',
        }, {
            title: '知乎想法热榜',
            description: 'https://docs.rsshub.app/social-media.html#%E7%9F%A5%E4%B9%8E',
            target: '/zhihu/pin/hotlist',
        }, {
            title: '知乎问题',
            description: 'https://docs.rsshub.app/social-media.html#%E7%9F%A5%E4%B9%8E',
            source: '/question/:questionId',
            target: '/zhihu/question/:questionId',
        }, {
            title: '知乎话题',
            description: 'https://docs.rsshub.app/social-media.html#%E7%9F%A5%E4%B9%8E',
            source: '/topic/:topicId/:type',
            target: '/zhihu/topic/:topicId',
        }, {
            title: '知乎新书',
            description: 'https://docs.rsshub.app/social-media.html#%E7%9F%A5%E4%B9%8E',
            source: '/zhihu/bookstore/newest',
            target: '/zhihu/pin/hotlist',
        }, {
            title: '知乎想法-24 小时新闻汇总',
            description: 'https://docs.rsshub.app/social-media.html#%E7%9F%A5%E4%B9%8E',
            source: '/pin/special/972884951192113152',
            target: '/zhihu/pin/daily',
        }, {
            title: '知乎书店-知乎周刊',
            description: 'https://docs.rsshub.app/social-media.html#%E7%9F%A5%E4%B9%8E',
            source: '/pub/weekly',
            target: '/zhihu/weekly',
        }],
        'zhuanlan': [{
            title: '知乎专栏',
            description: 'https://docs.rsshub.app/social-media.html#%E7%9F%A5%E4%B9%8E',
            source: '/:id',
            target: '/zhihu/zhuanlan/:id',
        }],
        'daily': [{
            title: '知乎日报',
            description: 'https://docs.rsshub.app/social-media.html#%E7%9F%A5%E4%B9%8E',
            source: '',
            target: '/zhihu/daily',
        }, {
            title: '知乎日报',
            description: 'https://docs.rsshub.app/social-media.html#%E7%9F%A5%E4%B9%8E',
            source: '/*tpath',
            target: '/zhihu/daily',
        }],
    },
    'smzdm.com': {
        'www': [{
            title: '什么值得买关键词',
            description: 'https://docs.rsshub.app/shopping.html#%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0',
            target: '/smzdm/keyword/:keyword',
        }, {
            title: '什么值得买排行榜',
            description: 'https://docs.rsshub.app/shopping.html#%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0',
            source: '/top',
        }],
    },
    'rsshub.app': {
        'docs': [{
            title: 'RSSHub 有新路由啦',
            description: 'https://docs.rsshub.app/program-update.html#rsshub',
            source: ['', '/*tpath'],
            target: '/rsshub/rss',
        }],
    },
    'ximalaya.com': {
        'www': [{
            title: '喜马拉雅专辑',
            description: 'https://docs.rsshub.app/multimedia.html#%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85',
            source: '/:type/:id',
            target: '/ximalaya/album/:id/',
            verification: (params) => parseInt(params.id) + '' === params.id,
        }],
    },
};
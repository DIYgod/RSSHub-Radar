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
            source: '/u/:id',
            target: '/weibo/user/:uid',
            script: '({uid: document.querySelector(\'head\').innerHTML.match(/\\$CONFIG\\[\'uid\']=\'(\\d+)\'/)[1]})',
            verification: (params) => params.uid,
        }],
        '.': [{
            title: '微博博主',
            description: 'https://docs.rsshub.app/social-media.html#%E5%BE%AE%E5%8D%9A',
            source: '/:id',
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
            title: 'GitHub Trending',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/trending',
            target: '/github/trending/:since',
        }, {
            title: 'GitHub 仓库 Issue',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/:user/:repo/issues',
            target: '/github/issue/:user/:repo',
        }, {
            title: 'GitHub 仓库 Issue',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/:user/:repo/issues/:id',
            target: '/github/issue/:user/:repo',
        }, {
            title: 'GitHub 仓库 Pull Requests',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/:user/:repo/pulls',
            target: '/github/pull/:user/:repo',
        }, {
            title: 'GitHub 仓库 Pull Requests',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/:user/:repo/pulls/:id',
            target: '/github/pull/:user/:repo',
        }, {
            title: 'GitHub 用户 Followers',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/:user',
            target: '/github/user/followers/:user',
        }, {
            title: 'GitHub 仓库 Stars',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/:user/:repo/stargazers',
            target: '/github/stars/:user/:repo',
        }, {
            title: 'GitHub 仓库 Branches',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/:user/:repo/branches',
            target: '/github/branches/:user/:repo',
        }, {
            title: 'GitHub 文件 Commits',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/:user/:repo/:branch/*filepath',
            target: '/github/file/:user/:repo/:branch/:filepath',
            verification: (params) => (params.branch !== 'pull' && params.branch !== 'issues'),
        }, {
            title: 'GitHub 仓库 Issue',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/:user/:repo',
            target: '/github/issue/:user/:repo',
        }, {
            title: 'GitHub 仓库 Pull Requests',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/:user/:repo',
            target: '/github/pull/:user/:repo',
        }, {
            title: 'GitHub 仓库 Stars',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/:user/:repo',
            target: '/github/stars/:user/:repo',
        }, {
            title: 'GitHub 仓库 Branches',
            description: 'https://docs.rsshub.app/programming.html#github',
            source: '/:user/:repo',
            target: '/github/branches/:user/:repo',
        }],
    },
};
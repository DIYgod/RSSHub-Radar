<template>
    <div class="about">
        <el-main>
            <div class="title">关于</div>
            <div class="content">
                <div class="tip">
                    <p>RSSHub Radar 是 <a target="_blank" href="https://docs.rsshub.app">RSSHub</a> 的衍生项目，她可以帮助你快速发现和订阅当前网站的 RSS 和 RSSHub，项目<a target="_blank" href="https://github.com/DIYgod/RSSHub-Radar">采用 MIT 许可开源</a>，使用完全免费，但是随着项目规模的增长，也需要有相应的资金支持才能持续项目的维护与开发</p>
                    <p><i class="el-icon-trophy"></i> 赞助 RSSHub Radar 的开发: <a target="_blank" href="https://docs.rsshub.app/support">https://docs.rsshub.app/support</a></p>
                    <p>&nbsp;</p>
                    <p>更新日志: <a target="_blank" href="https://github.com/DIYgod/RSSHub-Radar/releases">https://github.com/DIYgod/RSSHub-Radar/releases</a></p>
                    <p>问题反馈: <a target="_blank" href="https://github.com/DIYgod/RSSHub-radar/issues">https://github.com/DIYgod/RSSHub-radar/issues</a></p>
                    <p>GitHub: <a target="_blank" href="https://github.com/DIYgod/RSSHub-Radar">https://github.com/DIYgod/RSSHub-Radar</a></p>
                    <p>RSSHub 文档: <a target="_blank" href="https://docs.rsshub.app">https://docs.rsshub.app</a></p>
                    <p>&nbsp;</p>
                    <p><b>万物皆可 RSS</b></p>
                    <p><b>Made with <i style="color:#d43f57">♥</i> by <a target="_blank" href="https://diygod.me">DIYgod</a></b></p>
                </div>
            </div>
        </el-main>
    </div>
</template>

<script>
export default {
    name: 'About',
    data: () => ({
    }),
}
</script>

<style lang="less" scoped>
a {
    text-decoration: none;
    color: #f5712c;
}

.about {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 10px;
}

.title {
    font-size: 25px;
    font-weight: bold;
    border-bottom: 1px solid #e6e6e6;
    padding-bottom: 10px;
    color: #f5712c;
}

.tip {
    font-size: 14px;
    margin: 20px 0;
    color: #555;
}

.content {
    margin-top: 20px;
    color: #222;
}
</style>

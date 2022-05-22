<template>
    <div class="about">
        <el-main>
            <div class="title">{{$i18n.t('about')}}</div>
            <div class="content">
                <div class="tip">
                    <p v-html="$i18n.t('rsshub radar info')"></p>
                    <p><i class="el-icon-trophy"></i> <span v-html="$i18n.t('sponsored development')"></span></p>
                    <p>&nbsp;</p>
                    <p>{{$i18n.t('update log')}}: <a target="_blank" href="https://github.com/DIYgod/RSSHub-Radar/releases">https://github.com/DIYgod/RSSHub-Radar/releases</a></p>
                    <p>{{$i18n.t('question feedback')}}: <a target="_blank" href="https://github.com/DIYgod/RSSHub-radar/issues">https://github.com/DIYgod/RSSHub-radar/issues</a></p>
                    <p>GitHub: <a target="_blank" href="https://github.com/DIYgod/RSSHub-Radar">https://github.com/DIYgod/RSSHub-Radar</a></p>
                    <p v-html="$i18n.t('rsshub documentation')"></p>
                    <p>&nbsp;</p>
                    <p><b>{{$i18n.t('everything is possible with rss')}}</b></p>
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

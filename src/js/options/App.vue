<template>
  <div id="app">
    <el-container class="container">
        <el-aside width="200px">
            <el-menu
                class="menu"
                :default-active="this.$route.path"
                @select="handleSelect">
                <el-header
                    class="header"
                    height="80px">RSSHub Radar</el-header>
                <el-menu-item index="/setting">
                    <i class="el-icon-setting"></i>
                    <span slot="title">{{ $i18n.t('settings') }}</span>
                </el-menu-item>
                <el-menu-item index="/list">
                    <i class="el-icon-magic-stick"></i>
                    <span slot="title">{{ $i18n.t('list of rules') }}</span>
                </el-menu-item>
                <el-menu-item index="/about">
                    <i class="el-icon-coordinate"></i>
                    <span slot="title">{{ $i18n.t('about') }}</span>
                </el-menu-item>
                <el-footer class="footer">{{ $i18n.t('version')}} v{{ version }}<br>Made with <i style="color:#d43f57">♥</i> by <a target="_blank" href="https://diygod.me">DIYgod</a></el-footer>
            </el-menu>
        </el-aside>
        <el-container class="sub-container">
            <!-- <el-main><router-view></router-view></el-main> -->
            <router-view></router-view>
        </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
    name: 'app',
    data: () => ({
        version: VERSION,
    }),
    methods: {
        handleSelect(key, keyPath) {
            this.$router.push(key);
        },
    }
}
</script>

<style lang="less">
@color-primary: #f5712c;

body {
    margin: 0;
    height: 100%;
}

#app {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    height: 100%;
}

.container {
    height: 100%;
}

.sub-container {
    overflow: scroll;
}

.menu {
    height: 100%;

    .el-menu-item {
        &:focus {
            background-color: transparent;
        }
        &:hover {
            background-color: #fef1ea;
        }
    }
}

.header {
    color: @color-primary;
    line-height: 80px;
    font-size: 21px;
    font-weight: bold;
}

.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    line-height: 60px;
    text-align: center;
    font-size: 14px;
    color: #999;
    line-height: 25px;

    a {
        color: @color-primary;
        text-decoration: none;
    }
}

.el-menu-item {
    i,
    span {
        transition: color .3s;
    }

    &.is-active {
        color: #303133;

        i,
        span {
            color: #f5712c;
        }
    }
}
</style>

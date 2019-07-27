<template>
    <div class="setting">
        <el-main>
            <div class="title">设置</div>
            <div class="content" v-loading="loading">
                <div v-if="!loading">
                    <div class="subtitle">常规</div>
                    <div class="setting-item">
                        <div class="setting-name">自定义 RSSHub 域名</div>
                        <div class="setting-input">
                            <el-input @change="saveConfig" v-model="config.rsshubDomain" placeholder="请输入你的 RSSHub 域名，留空使用官方域名"></el-input>
                        </div>
                    </div>
                    <div class="subtitle">通知与提醒</div>
                    <div class="setting-item">
                        <div class="setting-name">角标提醒</div>
                        <div class="setting-input">
                            <el-checkbox @change="saveConfig" v-model="config.notice.badge">开启</el-checkbox>
                        </div>
                    </div>
                    <div class="subtitle">一键订阅</div>
                    <div class="setting-item">
                        <div class="setting-name">Tiny Tiny RSS</div>
                        <div class="setting-input">
                            <el-checkbox @change="saveConfig" v-model="config.submitto.ttrss">开启</el-checkbox>
                            <el-input @change="saveConfig" style="margin-left: 20px;" v-if="config.submitto.ttrss" v-model="config.submitto.ttrssDomain" placeholder="必填，请输入你的 Tiny Tiny RSS 地址"></el-input>
                        </div>
                        <div class="setting-name">Feedly</div>
                        <div class="setting-input">
                            <el-checkbox @change="saveConfig" v-model="config.submitto.feedly">开启</el-checkbox>
                        </div>
                        <div class="setting-name">Inoreader</div>
                        <div class="setting-input">
                            <el-checkbox @change="saveConfig" v-model="config.submitto.inoreader">开启</el-checkbox>
                        </div>
                    </div>
                </div>
            </div>
        </el-main>
    </div>
</template>

<script>
import { defaultConfig, getConfig, saveConfig } from '../../utils';

export default {
    name: 'Setting',
    data: () => ({
        loading: true,
        defaultConfig,
        config: defaultConfig,
    }),
    created() {
        this.getConfig();
    },
    methods: {
        getConfig() {
            getConfig((config) => {
                this.config = config;
                this.loading = false;
            });
        },
        saveConfig() {
            saveConfig(this.config, () => {
                this.$message({
                    message: '保存成功',
                    type: 'success'
                });
            });
        },
    }
}
</script>

<style lang="less" scoped>
.setting {
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

.content {
    margin-top: 20px;
    color: #222;
}

.subtitle {
    font-size: 20px;
    font-weight: bold;
    margin: 30px 0 15px;
}

.setting-name {
    font-size: 15px;
    margin: 15px 0 5px;
}

.setting-input {
    height: 40px;
    display: flex;
    align-items: center;
}
</style>

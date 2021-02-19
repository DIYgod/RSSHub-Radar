<template>
    <div class="setting">
        <div class="title">设置</div>
        <div class="content" v-loading="loading">
            <div v-if="!loading">
                <div class="subtitle">常规</div>
                <div class="setting-item">
                    <div class="setting-name">自定义 RSSHub 域名</div>
                    <div class="setting-input">
                        <el-input @change="saveConfig" v-model="config.rsshubDomain" placeholder="请输入你的 RSSHub 域名，留空使用官方域名"></el-input>
                    </div>
                    <template v-if="config.rsshubDomain !== defaultConfig.rsshubDomain">
                    <div class="setting-name">访问密钥<a target="_blank" href="https://docs.rsshub.app/install/#fang-wen-kong-zhi-pei-zhi"><el-tooltip class="item" effect="dark" content="只有实例启用了访问密钥，才需要配置，如果你不清楚情况，请保持关闭" placement="top"><i class="el-icon-info"></i></el-tooltip></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.rsshubAccessControl.enabled">开启</el-checkbox>
                        <el-input @change="saveConfig" style="margin-left: 20px;" v-if="config.rsshubAccessControl.enabled" v-model="config.rsshubAccessControl.accessKey" placeholder="必填，请输入正确的访问密钥"></el-input>
                        <el-checkbox @change="saveConfig" style="margin-left: 20px;" v-if="config.rsshubAccessControl.enabled" v-model="config.rsshubAccessControl.useCode">生成访问码</el-checkbox>
                    </div>
                    </template>
                    <div class="setting-name" v-if="isChrome">快捷键</div>
                    <div class="setting-input" v-if="isChrome">
                        <el-button size="medium" @click="toHotkey">点此设置</el-button>
                    </div>
                </div>
                <div class="subtitle">规则更新</div>
                <div class="setting-item">
                    <div class="setting-name" v-if="config.enableRemoteRules">我会自动更新，你也可以</div>
                    <div class="setting-input" v-if="config.enableRemoteRules">
                        <el-button style="width: 98px" size="medium" @click="refreshRu" :disabled="refreshDisabled">{{ refreshDisabled ? '更新中' : '立即更新' }}</el-button><el-progress :text-inside="true" :stroke-width="20" :percentage="percentage"></el-progress><span class="time">{{ time }}前更新，{{ leftTime }}后自动更新</span>
                    </div>
                    <div class="setting-name" v-if="!config.enableRemoteRules">远程更新被禁用</div>
                </div>
                <div class="subtitle">一键订阅</div>
                <div class="setting-item">
                    <div class="setting-name">Tiny Tiny RSS <a target="_blank" href="https://ttrss.henry.wang/zh/"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.ttrss">开启</el-checkbox>
                        <el-input @change="saveConfig" style="margin-left: 20px;" v-if="config.submitto.ttrss" v-model="config.submitto.ttrssDomain" placeholder="必填，请输入你的 Tiny Tiny RSS 地址"></el-input>
                    </div>
                    <div class="setting-name">Miniflux <a target="_blank" href="https://miniflux.app"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.miniflux">开启</el-checkbox>
                        <el-input @change="saveConfig" style="margin-left: 20px;" v-if="config.submitto.miniflux" v-model="config.submitto.minifluxDomain" placeholder="必填，请输入你的 Miniflux 地址"></el-input>
                    </div>
                    <div class="setting-name">FreshRSS <a target="_blank" href="https://freshrss.org"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.freshrss">开启</el-checkbox>
                        <el-input @change="saveConfig" style="margin-left: 20px;" v-if="config.submitto.freshrss" v-model="config.submitto.freshrssDomain" placeholder="必填，请输入你的 FreshRSS 地址"></el-input>
                    </div>
                    <div class="setting-name">Nextcloud News <a target="_blank" href="https://apps.nextcloud.com/apps/news"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.nextcloudnews">开启</el-checkbox>
                        <el-input @change="saveConfig" style="margin-left: 20px;" v-if="config.submitto.nextcloudnews" v-model="config.submitto.nextcloudnewsDomain" placeholder="必填，请输入你的 Nextcloud News 地址"></el-input>
                    </div>
                    <div class="setting-name">Feedly <a target="_blank" href="https://feedly.com/"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.feedly">开启</el-checkbox>
                    </div>
                    <div class="setting-name">Inoreader <a target="_blank" href="https://www.inoreader.com/"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.inoreader">开启</el-checkbox>
                    </div>
                    <div class="setting-name">Feedbin <a target="_blank" href="https://feedbin.com/"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.feedbin">开启</el-checkbox>
                    </div>
                    <div class="setting-name">The Old Reader <a target="_blank" href="https://theoldreader.com/"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.theoldreader">开启</el-checkbox>
                    </div>
                    <div class="setting-name">Feeds.Pub <a target="_blank" href="https://feeds.pub/"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.feedspub">开启</el-checkbox>
                    </div>
                    <div class="setting-name">BazQux Reader <a target="_blank" href="https://bazqux.com/"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.bazqux">开启</el-checkbox>
                    </div>
                    <div class="setting-name">本地阅读器 <el-tooltip class="item" effect="dark" content="需要阅读器支持，如 Reeder 等" placement="top"><i class="el-icon-info"></i></el-tooltip></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.local">开启</el-checkbox>
                    </div>
                </div>
                <div class="subtitle">通知与提醒</div>
                <div class="setting-item">
                    <div class="setting-name">角标提醒</div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.notice.badge">开启</el-checkbox>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getRulesDate, refreshRules } from '../../common/rules';
import { defaultConfig, getConfig, saveConfig } from '../../common/config';
import { secondToTime } from '../../common/utils';

export default {
    name: 'Setting',
    data: () => ({
        loading: true,
        defaultConfig,
        config: defaultConfig,
        time: '',
        leftTime: '',
        second: 0,
        refreshDisabled: false,
        isChrome: navigator.userAgent.indexOf('Chrome') !== -1,
    }),
    computed: {
        percentage: function () {
            return (this.second / this.config.refreshTimeout * 100).toFixed(2);
        },
    },
    created() {
        getConfig((config) => {
            this.config = config;
            this.loading = false;

            this.refreshTime();
        });
    },
    methods: {
        saveConfig() {
            saveConfig(this.config, () => {
                this.$message({
                    message: '保存成功',
                    type: 'success'
                });
            });
        },
        toHotkey() {
            chrome.tabs.create({
                url: 'chrome://extensions/shortcuts'
            });
        },
        refreshRu() {
            this.refreshDisabled = true;
            refreshRules(() => {
                this.second = 0;
                this.time = secondToTime(this.second);
                this.leftTime = secondToTime(this.config.refreshTimeout - this.second);
                this.refreshDisabled = false;
            });
        },
        refreshTime() {
            getRulesDate((date) => {
                this.second = (+new Date - +date) / 1000;
                this.time = secondToTime(this.second);
                this.leftTime = secondToTime(this.config.refreshTimeout - this.second);
                setTimeout(() => {
                    this.refreshTime();
                }, 1000);
            });
        }
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
    margin-bottom: 30px;
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

.el-button:focus {
    color: #606266;
    background: #fff;
    border: 1px solid #dcdfe6;
}

.el-button:hover {
    color: #f5712c;
    border-color: #fcd4c0;
    background-color: #fef1ea;
}

.el-icon-info {
    color: #777;
    margin-left: 2px;
}

.el-progress {
    width: 170px;
    margin: 0 20px;
}

.time {
    color: #606266;
    font-size: 14px;
}
</style>

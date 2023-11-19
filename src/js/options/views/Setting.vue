<template>
    <div class="setting">
        <div class="title">{{ $i18n.t('settings') }}</div>
        <div class="content" v-loading="loading">
            <div v-if="!loading">
                <div class="subtitle">{{ $i18n.t('general') }}</div>
                <div class="setting-item">
                    <div class="setting-name">{{ $i18n.t('custom rsshub domain') }}</div>
                    <div class="setting-input">
                        <el-input @change="saveConfig" v-model="config.rsshubDomain" :placeholder="$i18n.t('enter rsshub domain')"></el-input>
                    </div>
                    <template v-if="config.rsshubDomain !== defaultConfig.rsshubDomain">
                    <div class="setting-name">{{ $i18n.t('access key') }}<a target="_blank" href="https://docs.rsshub.app/install/#fang-wen-kong-zhi-pei-zhi"><el-tooltip class="item" effect="dark" :content="$i18n.t('configuration required if access keys enabled')" placement="top"><i class="el-icon-info"></i></el-tooltip></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.rsshubAccessControl.enabled">{{ $i18n.t('enable') }}</el-checkbox>
                        <el-input @change="saveConfig" style="margin-left: 20px;" v-if="config.rsshubAccessControl.enabled" v-model="config.rsshubAccessControl.accessKey" :placeholder="$i18n.t('required access key')"></el-input>
                        <el-checkbox @change="saveConfig" style="margin-left: 20px;" v-if="config.rsshubAccessControl.enabled" v-model="config.rsshubAccessControl.useCode">{{ $i18n.t('generate access code') }}</el-checkbox>
                    </div>
                    </template>
                    <div class="setting-name" v-if="isChrome">{{ $i18n.t('hot key') }}</div>
                    <div class="setting-input" v-if="isChrome">
                        <el-button size="medium" @click="toHotkey">{{ $i18n.t('click to set') }}</el-button>
                    </div>
                </div>
                <div class="subtitle">{{ $i18n.t('rules update') }}</div>
                <div class="setting-item">
                    <div class="setting-name">{{ $i18n.t('i will update automatically and you can') }}</div>
                    <div class="setting-input">
                        <el-button style="" size="medium" @click="refreshRu" :disabled="refreshDisabled">{{ refreshDisabled ? $i18n.t('updating') : $i18n.t('update now') }}</el-button><el-progress :text-inside="true" :stroke-width="20" :percentage="percentage"></el-progress><span class="time">{{ time }} {{ $i18n.t('before update') }}, {{ leftTime }} {{ $i18n.t('after automatic update') }}</span>
                    </div>
                    <div class="setting-name" v-if="!defaultConfig.enableFullRemoteRules">{{ $i18n.t('full remote updates are disabled due to browser limitations') }}</div>
                </div>
                <div class="subtitle">{{ $i18n.t('one-click subscription') }}</div>
                <div class="setting-item">
                    <div class="setting-name">Check酱<a target="_blank" href="https://ckc.ftqq.com"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.checkchan">{{ $i18n.t('enable') }}</el-checkbox>
                        <el-input @change="saveConfig" style="margin-left: 20px;" v-if="config.submitto.checkchan" v-model="config.submitto.checkchanBase" :placeholder="$i18n.t('required extension base URI', {service: 'CheckChan'})"></el-input>
                    </div>
                    <div class="setting-name">Tiny Tiny RSS <a target="_blank" href="https://ttrss.henry.wang/zh/"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.ttrss">{{ $i18n.t('enable') }}</el-checkbox>
                        <el-input @change="saveConfig" style="margin-left: 20px;" v-if="config.submitto.ttrss" v-model="config.submitto.ttrssDomain" :placeholder="$i18n.t('required address', {service: 'Tiny Tiny RSS'})"></el-input>
                    </div>
                    <div class="setting-name">Miniflux <a target="_blank" href="https://miniflux.app"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.miniflux">{{ $i18n.t('enable') }}</el-checkbox>
                        <el-input @change="saveConfig" style="margin-left: 20px;" v-if="config.submitto.miniflux" v-model="config.submitto.minifluxDomain" :placeholder="$i18n.t('required address', {service: 'Miniflux'})"></el-input>
                    </div>
                    <div class="setting-name">FreshRSS <a target="_blank" href="https://freshrss.org"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.freshrss">{{ $i18n.t('enable') }}</el-checkbox>
                        <el-input @change="saveConfig" style="margin-left: 20px;" v-if="config.submitto.freshrss" v-model="config.submitto.freshrssDomain" :placeholder="$i18n.t('required address', {service: 'FreshRSS'})"></el-input>
                    </div>
                    <div class="setting-name">Nextcloud News <a target="_blank" href="https://apps.nextcloud.com/apps/news"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.nextcloudnews">{{ $i18n.t('enable') }}</el-checkbox>
                        <el-input @change="saveConfig" style="margin-left: 20px;" v-if="config.submitto.nextcloudnews" v-model="config.submitto.nextcloudnewsDomain" :placeholder="$i18n.t('required address', {service: 'Nextcloud'})"></el-input>
                    </div>
                    <div class="setting-name">Feedly <a target="_blank" href="https://feedly.com/"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.feedly">{{ $i18n.t('enable') }}</el-checkbox>
                    </div>
                    <div class="setting-name">Inoreader <a target="_blank" href="https://www.inoreader.com/"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.inoreader">{{ $i18n.t('enable') }}</el-checkbox>
			            <el-input @change="saveConfig" style="margin-left: 20px;" v-if="config.submitto.inoreader" v-model="config.submitto.inoreaderDomain" :placeholder="$i18n.t('required address', {service: 'Inoreader'})"></el-input>
                    </div>
                    <div class="setting-name">Feedbin <a target="_blank" href="https://feedbin.com/"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.feedbin">{{ $i18n.t('enable') }}</el-checkbox>
			            <el-input @change="saveConfig" style="margin-left: 20px;" v-if="config.submitto.feedbin" v-model="config.submitto.feedbinDomain" :placeholder="$i18n.t('required address', {service: 'Feedbin'})"></el-input>
                    </div>
                    <div class="setting-name">The Old Reader <a target="_blank" href="https://theoldreader.com/"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.theoldreader">{{ $i18n.t('enable') }}</el-checkbox>
                    </div>
                    <div class="setting-name">Feeds.Pub <a target="_blank" href="https://feeds.pub/"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.feedspub">{{ $i18n.t('enable') }}</el-checkbox>
                    </div>
                    <div class="setting-name">BazQux Reader <a target="_blank" href="https://bazqux.com/"><i class="el-icon-info"></i></a></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.bazqux">{{ $i18n.t('enable') }}</el-checkbox>
                    </div>
                    <div class="setting-name">{{ $i18n.t('local reader') }} <el-tooltip class="item" effect="dark" :content="$i18n.t('requires reader support')" placement="top"><i class="el-icon-info"></i></el-tooltip></div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.submitto.local">{{ $i18n.t('enable') }}</el-checkbox>
                    </div>
                </div>
                <div class="subtitle">{{ $i18n.t('notifications and reminders') }}</div>
                <div class="setting-item">
                    <div class="setting-name">{{ $i18n.t('show corner badge') }}</div>
                    <div class="setting-input">
                        <el-checkbox @change="saveConfig" v-model="config.notice.badge">{{ $i18n.t('enable') }}</el-checkbox>
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
                    message: this.$i18n.t('successfully saved'),
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

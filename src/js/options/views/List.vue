<template>
    <div class="list">
        <el-main>
            <div class="title">{{ $i18n.t('rules') }}</div>
            <div class="tip">
                <p v-html="$i18n.t('for more rules join us')"></p>
                <p>{{ $i18n.t('updated time ago', {hours: hours, minutes: minutes})}}</p>
            </div>
            <div class="content" v-loading="loading">
                <el-collapse accordion>
                    <el-collapse-item v-for="(rule, domain) in rules" :key="domain" :title="rule._name + ' - ' + domain">
                        <div v-for="(subrule, subdomain) in rule" v-if="subdomain[0] !== '_'" :key="subdomain">
                            <p v-for="subsubrule in subrule" :key="subsubrule.title">
                                <a target="_blank" :href="subsubrule.docs">{{ subsubrule.title }}</a>
                            </p>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <div class="debug">
                    <div class="tip" v-if="defaultConfig.enableFullRemoteRules">
                        <p>This area is used for debugging rules in development</p>
                        <p>Edited content may be overwritten by automatically updated rules at any time, please ensure that there is a local backup</p>
                        <p>Use Settings - Update Now to immediately restore remote rules</p>
                    </div>
                    <div class="tip" v-if="!defaultConfig.enableFullRemoteRules">
                        <p>This area is used for debugging rules in development</p>
                        <p>Remote updates and debug function is not available due to browser limitations</p>
                    </div>
                    <el-input
                        type="textarea"
                        :rows="100"
                        v-model="rulesText"
                        @change="updateRules"
                        :disabled="!defaultConfig.enableFullRemoteRules"
                    >
                    </el-input>
                </div>
            </div>
        </el-main>
    </div>
</template>

<script>
import { getRules, getRulesDate, updateRules } from '../../common/rules';
import { secondToHoursMinutes, commandSandbox } from '../../common/utils';
import { defaultConfig } from '../../common/config';

export default {
    name: 'List',
    data: () => ({
        loading: true,
        rules: {},
        hours: '',
        minutes: '',
        rulesText: '',
        defaultConfig,
    }),
    created() {
        getRulesDate((date) => {
            let second = (+new Date - +date) / 1000;
            const {hours, minutes} = secondToHoursMinutes(second)
            this.hours = hours;
            this.minutes = minutes;
            this.refreshTime();
        });
        getRules((rules) => {
            if (typeof rules === 'string') {
                this.rulesText = rules;
                commandSandbox('getList', {
                    rules,
                }, (rules) => {
                    this.rules = rules;
                    this.loading = false;
                });
            } else {
                this.rulesText = JSON.stringify(rules, null, 4);
                this.rules = rules;
                this.loading = false;
            }
        });
    },
    methods: {
        refreshTime() {
            getRulesDate((date) => {
                const {hours, minutes} = secondToHoursMinutes((+new Date - +date) / 1000)
                this.hours = hours;
                this.minutes = minutes;
                setTimeout(() => {
                    this.refreshTime();
                }, 1000);
            });
        },
        updateRules() {
            updateRules(this.rulesText, () => {
                this.$message({
                    message: this.$i18n.t('successfully saved'),
                    type: 'success'
                });
            });
        },
    }
}
</script>

<style lang="less" scoped>
a {
    text-decoration: none;
    color: #f5712c;
}

.list {
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

.debug {
    margin: 200px 0;
}
</style>

import '../../css/options.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import Setting from './views/Setting.vue';
import List from './views/List.vue';
import About from './views/About.vue';
import i18n from '../common/i18n';
import { Container, Menu, MenuItem, Aside, Header, Main, Footer, Input, Checkbox, Message, Loading, Collapse, CollapseItem, Button, Progress, Tooltip } from 'element-ui';

// import translations from "../../translations/translations.json";
// const i18n = new I18n(translations);
// i18n.enableFallback = true;
// i18n.defaultLocale = "zh";
// i18n.locale = navigator.language;

Vue.use(VueRouter);
Vue.use(Container);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Aside);
Vue.use(Header);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(Loading.directive);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Button);
Vue.use(Progress);
Vue.use(Tooltip);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;
Vue.prototype.$i18n = i18n;
Vue.config.productionTip = false;

const routes = [
    { path: '/', redirect: '/setting' },
    { path: '/setting', component: Setting },
    { path: '/list', component: List },
    { path: '/about', component: About },
];
const router = new VueRouter({
    routes,
});

new Vue({
    render: (h) => h(App),
    router,
}).$mount('#app');

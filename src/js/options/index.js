import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import Setting from './views/Setting.vue';
import About from './views/About.vue';
import { Container, Menu, MenuItem, Aside, Header, Main, Footer } from 'element-ui';
import '../../css/options.scss'

Vue.use(VueRouter);
Vue.use(Container);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Aside);
Vue.use(Header);
Vue.use(Main);
Vue.use(Footer);
Vue.config.productionTip = false;

const routes = [
    { path: '/', redirect: '/setting' },
    { path: '/setting', component: Setting },
    { path: '/about', component: About },
];
const router = new VueRouter({
    routes,
});

new Vue({
    render: h => h(App),
    router,
}).$mount('#app');

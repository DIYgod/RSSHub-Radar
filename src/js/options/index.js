import Vue from 'vue';
import App from './App.vue';
import { Container, Menu, MenuItem, Aside, Header, Main } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Container);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Aside);
Vue.use(Header);
Vue.use(Main);
Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#app');

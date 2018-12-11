//入口
import Vue from 'vue';
import App from "./app.vue";
//引入ELement-Ui
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import './theme/index.css';

Vue.use(ElementUI);

//路由配置
import VueRouter from 'vue-router';

Vue.use(VueRouter);
const routerConfig = require('./router/index');
const router = new VueRouter(routerConfig);
import './static/css/reset.css' 
import './static/css/less/index.less' 
//vuex
import store from './store';
new Vue({
    el: '#app',
    router,
    store,
    render: c => c(App)
})
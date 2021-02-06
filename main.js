import Vue from 'vue'
import App from './App'
import store from './store'
//把vuex定义成全局组件
Vue.prototype.$store = store
// 使用uView
import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false

App.mpType = 'app'
// 自定义底部tabbar
import tabbar from '@/components/tabbar.vue'
Vue.component('tab-bar',tabbar)
// 上拉刷新下拉加载组件
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
// import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
Vue.component('mescroll-body', MescrollBody)
// Vue.component('mescroll-uni', MescrollUni)

// 自定义模态框
import Vuex from 'vuex';//注释掉的原因是store使用了vuex
Vue.use(Vuex)
import initModal from "@/components/zhangxu-showModal/initModal.js";
import showModal from '@/components/zhangxu-showModal/show-modal';
initModal(Vue);
Vue.component('show-modal',showModal);


const app = new Vue({
    ...App,
	store
})
app.$mount()

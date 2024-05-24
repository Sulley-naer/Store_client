
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import $ from 'jquery';
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

import 'element-plus/theme-chalk/dark/css-vars.css'

createApp(App).use(store).use(router).use($).use(ElementPlus).mount('#app')

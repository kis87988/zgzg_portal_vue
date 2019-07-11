import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import GAuth from 'vue-google-oauth2'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(GAuth, {
  apiKey: process.env.VUE_APP_GOOGLE_API_KEY,
  clientId: process.env.VUE_APP_GOOGLE_CLIENTID,
  scope: 'email',
  prompt: 'select_account',
  fetch_basic_profile: false
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

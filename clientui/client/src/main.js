/**
 * This file initalises VueMqtt, Vuex and the App.vue
 * Author(s): Hannah, Lucas
 */

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueMqtt from 'vue-mqtt'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App.vue'
import router from './utilities/router'
import { store } from './utilities/store'

Vue.use(BootstrapVue)

Vue.config.productionTip = false
const connect = {
  host: 'localhost',
  port: 1885,
  endpoint: '/ws',
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 4000,
  clientId: 'team-10-dentistimo-client',
  username: 'team-10',
  password: 'team-10'
}

const connectUrl = `ws://${connect.host}:${connect.port}${connect.endpoint}`
Vue.use(VueMqtt, connectUrl)

new Vue({
  router,
  store: store,
  render: function (h) { return h(App) }
}).$mount('#app')

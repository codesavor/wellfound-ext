import Vue from 'vue'
import Page from './Page.vue'
import store from './store'
import './plugins'

import './global.scss'

new Vue({
  el: '#app',
  store,
  render: h => h(Page)
})

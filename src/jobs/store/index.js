import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import { pick } from 'lodash'

import * as actions from './actions'
import * as mutations from './mutations'

Vue.use(Vuex)

const state = {
  unreadOnly: true,
  companies: []
}

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  reducer: state => pick(state, ['unreadOnly']),
  storage: window.localStorage
})

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  plugins: [vuexLocalStorage.plugin]
})

Vue.config.devtools = process.env.NODE_ENV === 'development'

export default store

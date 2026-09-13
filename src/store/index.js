import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import dict from './modules/dict'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import datatools from "./modules/datatools"
import getters from './getters'

Vue.use(Vuex)

let phone
const store = new Vuex.Store({
  modules: {
    app,
    dict,
    user,
    tagsView,
    permission,
    settings,
    datatools
  },
  getters
})

export default store

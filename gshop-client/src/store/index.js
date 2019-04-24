/*
vuex核心的管理对象
 */

import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex) // 声明式安装使用vuex插件

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

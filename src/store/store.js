
import Vue from 'vue'
import Vuex from 'vuex'

import controlShow from './modules/ControlShow' //控制显示状态VUEX

import AuthorityShow from './modules/Authority' //权限对照表

import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);


// const getters = {
//   leading_in: state => state.leading_in,
//   headerNav: state => state.headerNav,
//   classShow: state => state.classShow,
// }

export default new Vuex.Store({
  modules: {
    controlShow,
    AuthorityShow
  },
  plugins: [createPersistedState()],
})



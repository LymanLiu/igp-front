import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    refreshBgI: false,
    userInfo: {},
}

const mutations = {
    updateBGI(state, val) {
        this.state.refreshBgI = !state.refreshBgI
    },
    updateState(state, val) {
        console.log(state, val)
        state = {...state, ...val};
        console.log('new state', state)
    }
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV === 'development',
  state,
  mutations,
  actions: {
    updateUserInfo({ commit }, userInfo) {
        console.log(userInfo,'--123')
        commit('updateState', userInfo)
    },
  }
});

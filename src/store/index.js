const state = {
    refreshBgI: false
}
const mutations = {
    updateBGI(state, val) {
        this.state.refreshBgI = !state.refreshBgI
    }
};
module.exports = {
    state,
    mutations
}
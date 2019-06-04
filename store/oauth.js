export const state = () => ({
  codeVerifier: ''
})

export const getters = {
  getVerifier: state => {
    return sessionStorage.getItem('codeVerifier')
  }
}

export const mutations = {
  setVerifier(state, value) {
    sessionStorage.setItem('codeVerifier', value)
  },
  removeVerifier(state) {
    sessionStorage.removeItem('codeVerifier')
  }
}

export const actions = {
  writeHoge(context, value) {
    context.commit('setVerifier', value)
  }
}

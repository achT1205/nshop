import firebase from '@/plugins/firebase'

export const state = () => ({
  user: null,
  counter: 0
})

export const mutations = {
  setCounter(state, payload) {
    state.counter = state.counter + payload
  }
}

export const actions = {
  fireTest() {
    const payload = {
      one: 'Apple',
      two: 'Orange'
    }
    firebase
      .database()
      .ref('testdb')
      .push(payload)
      .then(() => {})
      .catch(() => {})
  },

  increment({ commit }, payload) {
    commit('setCounter', payload)
  }
}

export const getters = {
  counter(state) {
    return state.counter
  }
}

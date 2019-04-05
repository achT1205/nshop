import firebase from '@/plugins/firebase'

export const state = () => ({
  groups: []
})

export const mutations = {
  loadGroups(state, payload) {
    state.groups.push(payload)
  },
  updateGroup(state, payload) {
    const i = state.groups.indexOf(payload.group)
    state.groups[i].name = payload.name
  },
  removeGroup(state, payload) {
    const i = state.groups.indexOf(payload.group)
    state.groups.splice(i, 1)
  }
}

export const actions = {
  createGroup({ commit }, payload) {
    commit('setBusy', true, { root: true })
    commit('clearEssor', true, { root: true })
    firebase
      .database()
      .ref('groups')
      .push(payload)
      .then(() => {
        commit('setBusy', false, { root: true })
        commit('setJobDone', true, { root: true })
      })
      .catch((error) => {
        commit('setBusy', false, { root: true })
        commit('setEssor', error, { root: true })
      })
  },
  updateGroup({ commit }, payload) {
    commit('setBusy', true, { root: true })
    commit('clearEssor', true, { root: true })
    firebase
      .database()
      .ref(`groups/${payload.group.key}`)
      .push({ name: payload.name })
      .then(() => {
        commit('setBusy', false, { root: true })
        commit('setJobDone', true, { root: true })
        const groupData = {
          group: payload.group,
          name: payload.name
        }
        commit('updateGroup', groupData)
      })
      .catch((error) => {
        commit('setBusy', false, { root: true })
        commit('setEssor', error, { root: true })
      })
  },
  removeGroup({ commit }, payload) {
    commit('setBusy', true, { root: true })
    commit('clearEssor', true, { root: true })
    firebase
      .database()
      .ref(`groups/${payload.group.key}`)
      .remove()
      .then(() => {
        commit('setBusy', false, { root: true })
        commit('setJobDone', true, { root: true })
        commit('removeGroup', payload)
      })
      .catch((error) => {
        commit('setBusy', false, { root: true })
        commit('setEssor', error, { root: true })
      })
  },

  getGroups({ commit }) {
    firebase
      .database()
      .ref('groups')
      .on('child_added', (snapshot) => {
        const items = snapshot.val()
        // item.key = snapshot.key
        commit('loadGroups', items)
      })
  }
}

export const getters = {
  groups(state) {
    return state.groups
  }
}

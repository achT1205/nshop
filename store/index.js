import firebase from '@/plugins/firebase'
export const state = () => ({
  user: null,
  error: null,
  busy: false,
  jobDone: false,
  logingStatus: false
})

export const mutations = {
  setEssor(state, payload) {
    state.error = payload
  },
  clearEssor(state) {
    state.error = null
  },
  setBusy(state, payload) {
    state.busy = payload
  },
  setJobDone(state, payload) {
    state.jobDone = payload
  },
  setUser(state, payload) {
    state.user = payload
  },
  setLogingStatus(state, payload) {
    state.logingStatus = payload
  }
}

export const actions = {
  signUpUser({ commit }, payload) {
    commit('setBusy', true)
    commit('clearEssor', true)
    let newUser = null
    firebase
      .auth()
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then((response) => {
        newUser = response.user
        return response.user
          .updateProfile({ displayName: payload.fullName })
          .then(() => {
            const currentUser = {
              id: response.uid,
              email: payload.email,
              name: payload.fullName,
              role: 'customer'
            }
            commit('setUser', currentUser)
          })
      })
      .then(() => {
        const userData = {
          email: payload.email,
          fullName: payload.fullName,
          createdAt: new Date().toString()
        }
        return firebase
          .database()
          .ref(`users/${newUser.uid}`)
          .set(userData)
      })
      .then(() => {
        firebase
          .database()
          .ref('groups')
          .orderByChild('name')
          .equalTo('Customer')
          .once('value')
          .then((snapShot) => {
            const elt = snapShot.val()
            const groupkey = Object.keys(elt)
            const groupUser = {}
            groupUser[newUser.uid] = payload.fullName
            return firebase
              .database()
              .ref(`userGroups/${groupkey}`)
              .update(groupUser)
          })
      })
      .then(() => {
        commit('setBusy', false)
        commit('setJobDone', true)
      })
      .catch((error) => {
        commit('setBusy', false)
        commit('setEssor', error)
      })
  },
  loginUser({ commit }, payload) {
    commit('setBusy', true)
    commit('clearEssor', true)
    firebase
      .auth()
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then((response) => {
        const authUser = {
          id: response.user.uid,
          email: response.user.email,
          name: response.user.displayName
        }
        return firebase
          .database()
          .ref('groups')
          .orderByChild('name')
          .equalTo('Administrator')
          .once('value')
          .then((snapShot) => {
            const elt = snapShot.val()
            const groupkey = Object.keys(elt)
            return firebase
              .database()
              .ref(`userGroups/${groupkey}`)
              .child(`${authUser.id}`)
              .once('value')
              .then((ugroupsnap) => {
                if (ugroupsnap.exists()) {
                  authUser.role = 'admin'
                } else {
                  authUser.role = 'customer'
                }
                commit('setLogingStatus', true)
                commit('setUser', authUser)
                commit('setBusy', false)
                commit('setJobDone', true)
              })
          })
      })
      .catch((error) => {
        commit('setBusy', false)
        commit('setEssor', error)
      })
  },

  logOut({ commit }) {
    firebase.auth().signOut()
    commit('setLogingStatus', false)
    commit('setUser', null)
  },
  setAuthStatus({ commit }) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const authUser = {
          id: user.id,
          email: user.email,
          name: user.displayName
        }

        firebase
          .database()
          .ref('groups')
          .orderByChild('name')
          .equalTo('Administrator')
          .once('value')
          .then((snapShot) => {
            const elt = snapShot.val()
            const groupkey = Object.keys(elt)
            firebase
              .database()
              .ref(`userGroups/${groupkey}`)
              .child(`${authUser.id}`)
              .once('value')
              .then((ugroupsnap) => {
                if (ugroupsnap.exists()) {
                  authUser.role = 'admin'
                } else {
                  authUser.role = 'customer'
                }
                commit('setUser', authUser)
              })
          })
      }
    })
  }
}

export const getters = {
  error(state) {
    return state.error
  },
  busy(state) {
    return state.busy
  },
  jobDone(state) {
    return state.jobDone
  },
  user(state) {
    return state.user
  },
  logingStatus(state) {
    return state.logingStatus
  },
  userRole(state) {
    const isLoggedIn = state.logingStatus
    return isLoggedIn ? state.user.role : 'customer'
  }
}

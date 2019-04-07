import { fireApp } from '@/plugins/firebase'

export const state = () => ({
  products: [],
  categories: [],
  cart: {
    items: []
  }
})

export const mutations = {
  loadProducts(state, payload) {
    state.products = payload
  },
  loadCategories(state, payload) {
    state.categories = payload
  },
  updateCart(state, payload) {
    state.cart.items.push(payload)
  },
  emptyCart(state) {
    state.cart.items = []
  },
  updateQuantity(state, payload) {
    state.cart.items[payload.index].quantity = payload.productQuantity
  },
  increaseQuantity(state, payload) {
    state.cart.items[payload].quantity++
  },
  decreaseQuantity(state, payload) {
    state.cart.items[payload].quantity--
    if (state.cart.items[payload].quantity === 0) {
      state.cart.items.splice(payload, 1)
    }
  },
  reloadCart(state, payload) {
    state.cart.items = payload.items
  }
}

export const actions = {
  getProducts({ commit }) {
    commit('setBusy', true, { root: true })
    commit('setError', null, { root: true })
    fireApp
      .database()
      .ref('products')
      .limitToLast(50)
      .once('value')
      .then((snapShot) => {
        const products = []
        let item = {}
        snapShot.forEach((child) => {
          item = child.val()
          item.key = child.key
          products.push(item)
        })
        commit('loadProducts', products.reverse())
        commit('setBusy', false, { root: true })
        commit('setJobDone', true, { root: true })
      })
      .catch((error) => {
        commit('setBusy', false, { root: true })
        commit('setError', error, { root: true })
      })
  },
  getCategories({ commit }) {
    commit('setBusy', true, { root: true })
    commit('setError', null, { root: true })
    fireApp
      .database()
      .ref('categories')
      .once('value')
      .then((snapShot) => {
        const categories = []
        let item = {}
        snapShot.forEach((child) => {
          item = child.val()
          item.key = child.key
          categories.push(item)
        })
        commit('loadCategories', categories)
        commit('setBusy', false, { root: true })
        commit('setJobDone', true, { root: true })
      })
      .catch((error) => {
        commit('setBusy', false, { root: true })
        commit('setError', error, { root: true })
      })
  },
  productSearch({ commit }, payload) {
    commit('setBusy', true, { root: true })
    commit('setError', null, { root: true })
    let ref = 'products'
    if (payload.category) {
      ref = `productCategories/${payload.category}`
    }

    fireApp
      .database()
      .ref(`${ref}`)
      .orderByChild('name')
      .limitToLast(50)
      .startAt(payload.keyword)
      .endAt(payload.keyword + '\uf8ff')
      .once('value')
      .then((snapShot) => {
        let products = []
        let item = {}
        snapShot.forEach((child) => {
          item = child.val()
          item.key = child.key
          products.push(item)
        })
        if (payload.sort) {
          if (payload.sort === 'low') {
            products.sort(function (a, b) {
              return a.price - b.price
            })
          } else {
            products.sort(function (a, b) {
              return b.price - a.price
            })
          }
        } else {
          products = products.reverse()
        }
        commit('loadProducts', products)
        commit('setBusy', false, { root: true })
        commit('setJobDone', true, { root: true })
      })
      .catch((error) => {
        commit('setBusy', false, { root: true })
        commit('setError', error, { root: true })
      })
  },
  postOrder({ commit }, payload) {
    // orders/orderkey/userkey/productkey/productDetail
    commit('setJobDone', false, { root: true })
    const orderkey = fireApp
      .database()
      .ref('order')
      .push().key
    const items = payload.items
    const user = fireApp.auth().currentUser
    const orderItems = {}
    items.forEach((item) => {
      orderItems[`orders/${orderkey}/${user.uid}/${item.product.key}`] = {
        code: item.product.code,
        product: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
        createdAt: new Date().toDateString()
      }
      fireApp
        .database()
        .ref()
        .update(orderItems)
        .then(() => {
          commit('emptyCart')
          commit('setJobDone', true, { root: true })
        })
        .catch((error) => {
          commit('setBusy', false, { root: true })
          commit('setError', error, { root: true })
        })
    })
  }
}

export const getters = {
  products(state) {
    return state.products
  },
  categories(state) {
    return state.categories
  },
  cart(state) {
    return state.cart
  }
}

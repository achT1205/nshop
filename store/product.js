import { fireApp } from '@/plugins/firebase'

export const state = () => ({
  categories: [],
  products: []
})

export const mutations = {
  loadCategories(state, payload) {
    state.categories.push(payload)
  },
  updateCategory(state, payload) {
    const i = state.categories.indexOf(payload.category)
    state.categories[i].name = payload.name
  },
  removeCategory(state, payload) {
    const i = state.categories.indexOf(payload.category)
    state.categories.splice(i, 1)
  },
  loadProducts(state, payload) {
    state.products = payload
  },
  removeProduct(state, payload) {
    const i = state.products.indexOf(payload)
    state.products.splice(i, 1)
  }
}

export const actions = {
  createCategory({ commit }, payload) {
    commit('setBusy', true, { root: true })
    commit('clearError', null, { root: true })
    fireApp
      .database()
      .ref('categories')
      .push(payload)
      .then(() => {
        commit('setBusy', false, { root: true })
        commit('setJobDone', true, { root: true })
      })
      .catch((error) => {
        commit('setBusy', false, { root: true })
        commit('setError', error, { root: true })
      })
  },
  getCategories({ commit }) {
    fireApp
      .database()
      .ref('categories')
      .on('child_added', (snapShot) => {
        const item = snapShot.val()
        item.key = snapShot.key
        commit('loadCategories', item)
      })
  },
  updateCategory({ commit }, payload) {
    commit('setBusy', true, { root: true })
    commit('clearError', null, { root: true })
    fireApp
      .database()
      .ref(`categories/${payload.category.key}`)
      .update({ name: payload.name })
      .then(() => {
        commit('setBusy', false, { root: true })
        commit('setJobDone', true, { root: true })
        const categoryData = {
          category: payload.category,
          name: payload.name
        }
        commit('updateCategory', categoryData)
      })
      .catch((error) => {
        commit('setBusy', false, { root: true })
        commit('setError', error, { root: true })
      })
  },
  removeCategory({ commit }, payload) {
    fireApp
      .database()
      .ref(`categories/${payload.category.key}`)
      .remove()
      .then(() => {
        commit('removeCategory', payload)
      })
      .catch((error) => {
        commit('setBusy', false, { root: true })
        commit('setError', error, { root: true })
      })
  },
  addProduct({ dispatch, commit }, payload) {
    const productData = payload
    const categories = payload.belongs
    const image = payload.image
    delete productData.belongs
    delete productData.image
    let catUpdates = null
    let productKey = ''
    let imageUrl = ''
    commit('setBusy', true, { root: true })
    commit('clearError', null, { root: true })
    fireApp
      .database()
      .ref('products')
      .push(productData)
      .then((result) => {
        productKey = result.key
        return fireApp
          .storage()
          .ref(`products/${image.name}`)
          .put(image)
      })
      .then((fileData) => {
        const task = fileData.task
        task.snapshot.ref.getDownloadURL().then((downloadURL) => {
          imageUrl = downloadURL
          return fireApp
            .database()
            .ref('products')
            .child(productKey)
            .update({ imageUrl: imageUrl })
        })
      })
      .then(() => {
        const productSnippet = {
          name: productData.name,
          price: productData.price,
          status: productData.status,
          imageUrl: imageUrl
        }
        catUpdates = { hh: '' }
        categories.forEach((catKey) => {
          catUpdates[`productCategoies/${catKey}/${productKey}`] = productSnippet
        })
        return fireApp
          .database()
          .ref()
          .update(catUpdates)
      })
      .then(() => {
        dispatch('getProducts')
        commit('setBusy', false, { root: true })
        commit('setJobDone', true, { root: true })
      })
      .catch((error) => {
        commit('setBusy', false, { root: true })
        commit('setError', error, { root: true })
      })
  },
  getProducts({ commit }) {
    fireApp
      .database()
      .ref('products')
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
      })
  },
  removeProduct({ commit }, payload) {
    const imageUrl = payload.imageUrl
    const refUrl = imageUrl.split('?')[0]
    const httsRef = fireApp.storage().refFromURL(refUrl)
    httsRef
      .delete()
      .then(() => {
        return fireApp
          .database()
          .ref(`products/${payload.key}`)
          .remove()
          .then(() => {
            return fireApp
              .database()
              .ref('categories')
              .once(
                'value'.then((snapShot) => {
                  const catKeys = Object.keys(snapShot.val())
                  const updates = {}

                  catKeys.forEach((key) => {
                    updates[`productCategories/${key}/${payload.key}`] = null
                  })
                  return fireApp
                    .database()
                    .ref()
                    .update(updates)
                })
              )
          })
      })
      .then(() => {
        commit('removeProduct', payload)
      })
      .catch((error) => {
        commit('setBusy', false, { root: true })
        commit('setError', error, { root: true })
      })
  }
}

export const getters = {
  categories(state) {
    return state.categories
  },
  products(state) {
    return state.products
  }
}

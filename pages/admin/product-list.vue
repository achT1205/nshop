<template>
  <div>
    <section class="section no-top-pad">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <h5 class="title is-5">
              Products
            </h5>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <nuxt-link class="button is-primary" to="/admin/product-edit">
              Add
            </nuxt-link>
          </div>
        </div>
      </nav>
      <hr>
      <table class="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Product</th>
            <th>Code</th>
            <th>Brand</th>
            <th class="has-text-centered">
              Stock
            </th>
            <th class="has-text-centered">
              Status
            </th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in products" :key="index">
            <th>{{ ++ index }}</th>
            <td>
              <img :src="item.imageUrl" class="image is-48x48">
            </td>
            <td>
              <a href="#" @click.prevent="editProduct(item)">{{ item.name }}</a>
            </td>
            <td>{{ item.code }}</td>
            <td>{{ item.brand }}</td>
            <td class="has-text-centered">
              {{ item.stock }}
            </td>
            <td class="has-text-centered">
              {{ item.status === 1 ? 'Available' :'Not Available' }}
            </td>
            <td>
              <a href="#" @click.prevent="removeProduct(item)">
                <span class="icon has-text-danger">
                  <i class="fa fa-lg fa-times-circle" />
                </span>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    products() {
      return this.$store.getters['product/products']
    }
  },
  created() {
    const loadedProducts = this.$store.getters['product/products']
    if (loadedProducts.length === 0) {
      this.$store.dispatch('product/getProducts')
    }
    this.$store.commit('product/loadProduct', null)
    this.$store.commit('product/clearProductCategories')
  },
  methods: {
    removeProduct(product) {
      this.$swal({
        title: 'Delete the product ?',
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then((ok) => {
        if (ok) {
          this.$store.dispatch('product/removeProduct', product)
        }
      })
    },
    editProduct(product) {
      this.$store.commit('product/loadProduct', product)
      this.$router.push('product-edit')
    }
  }
}
</script>

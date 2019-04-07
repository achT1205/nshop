<template>
  <div>
    <section class="section left-right-pad is-fluid">
      <div class="hero is-medium is-primary is-bold has-text-centered">
        <div class="hero-body">
          <h1 class="title">
            Warm Welcome to the Nshop!
          </h1>
          <h2 class="subtitle">
            Toys and Gifts for the Geeky Ones!
          </h2>
          <br>
          <br>
          <a class="button is-warning" @click="increment(1)">Increment</a>
          <a class="button is-danger">{{ counter }}</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="box">
        <nav class="level">
          <div class="level-left">
            <div class="field is-grouped is-grouped-multiline">
              <p class="control">
                <input v-model="keyword" class="input" type="text" placeholder="Keyword">
              </p>
              <p class="control">
                <span class="select">
                  <select v-model="category">
                    <option value>All</option>
                    <option
                      v-for="(item, index) in categories"
                      :key="index"
                      :value="item.key"
                    >{{ item.name }}</option>
                  </select>
                </span>
              </p>
              <p class="control">
                <a class="button is-primary" @click.prevent="search">Search</a>
                <a
                  class="button is-warning"
                  @click.prevent="$store.commit('catalog/emptyCart')"
                >Empty Cart</a>
                <a
                  class="button is-warning"
                  @click.prevent="$store.dispatch('test/fireTest')"
                >Test FireBase</a>
              </p>
            </div>
          </div>

          <div class="level-right">
            <div class="field is-grouped is-grouped-multiline">
              <p class="control">
                <span class="select">
                  <select v-model="sort">
                    <option value>Latest</option>
                    <option value="low">Price - Low to High</option>
                    <option value="high">Price - High to Low</option>
                  </select>
                </span>
              </p>
            </div>
          </div>
        </nav>
      </div>

      <div class="columns is-mobile is-multiline">
        <div
          v-for="(product, index) in products"
          :key="index"
          class="column is-full-mobile is-half-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
        >
          <product-box v-if="product" :product="product" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ProductBox from '@/components/ProductBox'

export default {
  components: {
    ProductBox
  },
  data() {
    return {
      keyword: '',
      category: '',
      sort: ''
    }
  },
  computed: {
    counter() {
      return this.$store.getters['test/counter']
    },
    products() {
      return this.$store.getters['catalog/products']
    },
    categories() {
      return this.$store.getters['catalog/categories']
    }
  },
  created() {
    const loadedProducts = this.$store.getters['catalog/products']
    if (loadedProducts.length === 0) {
      this.$store.dispatch('catalog/getProducts')
      this.$store.dispatch('catalog/getCategories')
    }
  },
  methods: {
    increment(val) {
      this.$store.dispatch('test/increment', val)
    },
    search() {
      const searchData = {
        keyword: this.keyword,
        category: this.category,
        sort: this.sort
      }
      this.$store.dispatch('catalog/productSearch', searchData)
    }
  }
}
</script>

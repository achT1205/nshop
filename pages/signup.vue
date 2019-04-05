<template>
  <div>
    <section class="section no-top-pad">
      <h5 class="title is-5">
        Signup
      </h5>
      <hr>

      <div class="columns is-centered">
        <form @submit.prevent="onSignUp">
          <div>
            <div class="field">
              <label class="label">Full name</label>
              <div class="control">
                <input
                  v-model="fullName"
                  v-validate="'required|min:4'"
                  name="fullName"
                  class="input"
                  type="text"
                  :class="{'is-danger':errors.has('fullName')}"
                >
                <p
                  v-show="errors.has('fullName')"
                  class="help is-danger"
                >
                  {{ errors.first('fullName') }}
                </p>
              </div>
            </div>
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  v-model="email"
                  v-validate="'required|email'"
                  name="email"
                  class="input"
                  type="text"
                  :class="{'is-danger':errors.has('email')}"
                >
                <p v-show="errors.has('email')" class="help is-danger">
                  {{ errors.first('email') }}
                </p>
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  v-model="password"
                  v-validate="'required|min:6'"
                  name="password"
                  class="input"
                  type="password"
                  :class="{'is-danger':errors.has('password')}"
                >
                <p
                  v-show="errors.has('password')"
                  class="help is-danger"
                >
                  {{ errors.first('password') }}
                </p>
              </div>
            </div>
            <ErrorBar :error="error" />
            <div class="field">
              <div class="control">
                <button
                  class="button is-primary"
                  :class="{'is-loading':busy}"
                  :disabled="busy"
                >
                  Signup
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import ErrorBar from '@/components/ErrorBar'
import apiJobMixin from '@/mixins/apiJobMixin'
export default {
  components: {
    ErrorBar: ErrorBar
  },
  mixins: [apiJobMixin],
  data() {
    return {
      fullName: '',
      email: '',
      password: ''
    }
  },
  methods: {
    onSignUp() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          const signUpData = {
            fullName: this.fullName,
            email: this.email,
            password: this.password
          }
          this.$store.dispatch('signUpUser', signUpData)
        }
      })
    },
    jobsDone() {
      this.removeErrors()
      this.$router.replace('/')
    }
  }
}
</script>

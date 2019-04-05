<template>
  <div>
    <section class="section no-top-pad">
      <h5 class="title is-5">
        User groups
      </h5>
      <hr>

      <div class="columns">
        <div class="column is-one-third">
          <form @submit.prevent="onSubmit">
            <div class="field">
              <label v-show="!group" class="label">New user group</label>
              <label v-show="group" class="label">Update user group</label>
              <div class="control">
                <input
                  v-model="name"
                  v-validate="'required|min:4'"
                  name="name"
                  class="input"
                  type="text"
                  :class="{'is-danger':errors.has('name')}"
                >
                <p v-show="errors.has('name')" class="help is-danger">
                  {{ errors.first('name') }}
                </p>
              </div>
            </div>
            <ErrorBar :error="error" />
            <div class="field">
              <div class="control">
                <button
                  type="submit"
                  class="button is-primary"
                  :class="{'is-loading':busy}"
                  :disabled="busy"
                >
                  {{ !group ? 'Create' : 'Update' }}
                </button>
                <button
                  v-if="group"
                  class="button ml-3"
                  type="button"
                  @click="cancelUpdate()"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
        <div class="column">
          <table class="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>#</th>
                <th>User group</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in groups" :key="index">
                <th>{{ ++index }}</th>
                <td>
                  <a href="#" @click.prevent="selectGroup(item)">{{ item.name }}</a>
                </td>
                <td>
                  <a href="#" @click.prevent="removeGroup(item)">
                    <span class="icon has-text-danger">
                      <i class="fa fa-lg fa-times-circle" />
                    </span>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
      name: '',
      group: null
    }
  },
  computed: {
    groups() {
      return this.$store.getters['admin/groups']
    }
  },
  created() {
    const loadedGroups = this.$store.getters['admin/groups']
    if (loadedGroups.length === 0) {
      this.$store.dispatch('admin/getGroups')
    }
  },
  methods: {
    onSubmit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (!this.group) {
            this.$store.dispatch('admin/createGroup', { name: this.name })
          } else {
            this.$store.dispatch('admin/updateGroup', {
              name: this.name,
              group: this.group
            })
          }
        }
      })
    },
    selectGroup(group) {
      this.group = group
      this.name = group.name
    },
    removeGroup(group) {
      this.$swal({
        title: 'Delete the goup ?',
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then((ok) => {
        if (ok) {
          this.$store.dispatch('admin/removeGroup', { group: group })
        }
      })
    },
    cancelUpdate() {
      this.group = null
      this.jobsDone()
    },
    jobsDone() {
      this.group = null
      this.name = ''
      this.$nextTick(() => {
        this.removeErrors()
      })
      this.removeErrors()
    }
  }
}
</script>

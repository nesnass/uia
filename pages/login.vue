<template>
  <div>
    <form @submit="userLogin">
      <div>
        <label>Username</label>
        <input v-model="login.username" type="text" />
      </div>
      <div>
        <label>Password</label>
        <input v-model="login.password" type="text" />
      </div>
      <div>
        <BButton type="submit">Submit</BButton>
      </div>
    </form>
  </div>
</template>

<script>
import BButton from '@/components/Button.vue'
export default {
  components: {
    BButton
  },
  data() {
    return {
      login: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async userLogin() {
      try {
        const response = await this.$auth.loginWith('local', {
          data: this.login
        })
        if (this.$auth.isLoggedin) {
          console.log('logged in')
        }
        console.log(response)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

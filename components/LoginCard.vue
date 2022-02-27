<template>
  <div
    :class="{ badPassword: invalidLogin }"
    class="bg-white rounded-md shadow-md p-6 flex flex-col flex-grow-0"
  >
    <p v-if="formError" class="error">
      {{ formError }}
    </p>
    <div class="flex flex-row flex-grow-0">
      <span class="text-sm px-2">Username</span>
      <input
        v-model="formUsername"
        class="border border-solid border-gray-300 rounded-sm"
        type="text"
        name="username"
      />
    </div>
    <div class="flex flex-row pt-2">
      <span class="text-sm px-2">Password</span>
      <input
        v-model="formPassword"
        @keyup.enter="login"
        class="border border-solid border-gray-300 rounded-sm"
        type="password"
        name="password"
      />
    </div>
    <div class="w-full pt-4 flex flex-row">
      <BButton
        :applyClasses="'h-6'"
        @click="$emit('cancel-login')"
        class="bg-gray-300"
        ><span class="text-sm font-bold px-4">avbryt</span></BButton
      >
      <BButton :applyClasses="'h-6'" @click="login()" class="bg-gray-300 ml-2"
        ><span class="text-sm font-bold px-4">logg in</span></BButton
      >
    </div>
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
      formError: null,
      formUsername: '',
      formPassword: ''
    }
  },
  computed: {
    invalidLogin() {
      return this.$store.state.incorrectLogin
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login', {
          username: this.formUsername,
          password: this.formPassword
        })
        this.formUsername = ''
        this.formPassword = ''
        this.formError = null
      } catch (e) {
        this.formError = e.message
      }
    }
  }
}
</script>

<style scoped>
.badPassword {
  outline-color: red;
  /* also need animation and -moz-animation */
  -webkit-animation: shake 0.5s linear;
  animation: shake 0.5s linear;
}
/* also need keyframes and -moz-keyframes */
@-webkit-keyframes shake {
  8%,
  41% {
    -webkit-transform: translateX(-10px);
  }
  25%,
  58% {
    -webkit-transform: translateX(10px);
  }
  75% {
    -webkit-transform: translateX(-5px);
  }
  92% {
    -webkit-transform: translateX(5px);
  }
  0%,
  100% {
    -webkit-transform: translateX(0);
  }
}
@keyframes shake {
  8%,
  41% {
    -webkit-transform: translateX(-10px);
  }
  25%,
  58% {
    -webkit-transform: translateX(10px);
  }
  75% {
    -webkit-transform: translateX(-5px);
  }
  92% {
    -webkit-transform: translateX(5px);
  }
  0%,
  100% {
    -webkit-transform: translateX(0);
  }
}
</style>

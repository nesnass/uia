<template>
  <div class="container mx-auto h-full w-full flex flex-col justify-center">
    <div class="flex flex-row justify-around m-8">
      <BButton @click="kunst()" :applyClasses="'bg-gray-200'" class="mt-4 w-24"
        >kunst?</BButton
      >
      <BButton
        @click="kuratert()"
        :applyClasses="'bg-gray-200'"
        class="mt-4 w-24"
        >kurator</BButton
      >
    </div>
    <p class="text-sm absolute bottom-0">
      Merk: Vi bruker cookies for å finne dine tidligere bilder
    </p>
  </div>
</template>

<script>
import BButton from '~/components/Button.vue'

export default {
  components: {
    BButton
  },
  data() {
    return {
      userCode: ''
    }
  },
  computed: {
    hasUserCode() {
      return !!this.userCode
    }
  },
  mounted() {
    this.userCode = localStorage.getItem('userCode')
  },
  methods: {
    kunst() {
      this.$router.push('/ai')
    },
    kuratert() {
      this.$router.push('/kurator')
    }
  }
}
</script>

<style>
/* .container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
} */
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: bold;
  font-size: 4em;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 1.5em;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

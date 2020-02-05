<template>
  <div
    class="container mx-auto h-full flex flex-col justify-center main-background"
  >
    <p class="title pt-4 text-center text-white">kuratert</p>
    <p class="welcome p-4 text-center text-white">
      Velkommen!
    </p>
    <p class="subtitle p-4 text-center text-white">
      Her i KUNSTSILO har vi lyst til å overlate litt av kontrollen til deg.
      Hvilke verk fra den pågående utstillingen vil du se nærmere på?
    </p>
    <div class="flex flex-col items-center">
      <BButton @click="kuratere()" :applyClasses="'bg-white'" class="mt-4 w-48"
        >la meg kuratere</BButton
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
      userCode: '',
      socket: undefined
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
    kuratere() {
      this.$router.push('/2/playlist')
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
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 1.5em;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.welcome {
  font-weight: 100;
  font-size: 2em;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.links {
  padding-top: 15px;
}
.main-background {
  background-color: #e65a5a;
}
</style>

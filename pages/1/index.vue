<template>
  <div class="container mx-auto h-full flex flex-col justify-center">
    <p class="title pt-4 text-center">kunst?</p>
    <p class="subtitle p-4 text-center">
      når kunsten treffer, tror vi det er fordi det minner oss om noe i oss selv
      eller omgivelsene våre som vi ikke får tak i på egen hånd
    </p>
    <div class="flex flex-col items-center">
      <BButton @click="prøve()" :applyClasses="'bg-gray-200'" class="mt-4 w-24"
        >prøve?</BButton
      >
      <BButton
        v-if="hasUserCode"
        :applyClasses="'bg-gray-200'"
        @click="previousImage()"
        class="mt-4 w-40"
        >forrige bilde mitt</BButton
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
    this.userCode = window.localStorage.getItem('userCode')
  },
  methods: {
    prøve() {
      this.$router.push('/1/select')
    },
    previousImage() {
      this.$router.push('/1/latest')
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

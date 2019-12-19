<template>
  <div
    class="container mx-auto h-full flex flex-col justify-center items-center"
  >
    <div>
      <h1 class="title">kunst?</h1>
    </div>
    <p class="subtitle p-4">
      når kunsten treffer, tror vi det er fordi det minner oss om noe i oss selv
      eller omgivelsene våre som vi ikke får tak i på egen hånd
    </p>
    <BButton @click="prøve()" class="mt-4">prøve?</BButton>
  </div>
</template>

<script>
import BButton from '~/components/Button.vue'

export default {
  components: {
    BButton
  },
  methods: {
    prøve() {
      this.$router.push('/select')
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
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

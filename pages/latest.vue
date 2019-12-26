<template>
  <div class="container flex flex-col justify-center">
    <PulseLoader :loading="loading"></PulseLoader>
    <div class="flex flex-col">
      <div class="relative m-4">
        <img id="preview" v-if="!loading && imagePreview" :src="imagePreview" />
        <div
          class="absolute flex items-center inset-x-0 bottom-0 h-8 p-2"
          style="background: rgba(0, 0, 0, 0.45)"
        >
          <p class="text-white">My image caption</p>
        </div>
      </div>
      <div class="relative flex justify-center m-4">
        <img id="museumImage" v-if="!loading" :src="museumImage" />
        <div
          class="absolute flex items-center inset-x-0 bottom-0 h-8 p-2"
          \style="background: rgba(0, 0, 0, 0.45)"
        >
          <p class="text-white">Museum image caption</p>
        </div>
      </div>
      <p class="text-lg">Title of collection image artwork</p>
      <p class="text-lg">Label/description of image artwork</p>
      <div class="flex flex-col items-center mb-4">
        <BButton @click="prøveIgjen()" class="mt-4 w-36">prov igjen</BButton>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import BButton from '~/components/Button.vue'
export default {
  components: {
    PulseLoader,
    BButton
  },
  data() {
    return {
      filesSelected: 0,
      imagePreview: undefined,
      museumImage: undefined,
      loading: true
    }
  },
  mounted() {
    this.loading = true
    const code = localStorage.getItem('userCode')
    axios.get(`/api/latest?user-code=${code}`).then((data) => {
      this.imagePreview = data.data.signedRequest
      this.museumImage = data.data.museumImage
      this.loading = false
    })
  },
  methods: {
    prøveIgjen() {
      this.$router.push('/select')
    }
  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

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

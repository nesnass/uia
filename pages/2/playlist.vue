<template>
  <div class="container flex flex-col justify-center">
    <PulseLoader :loading="loading"></PulseLoader>
    <div v-for="p in playlist">
      <VJItem :artwork="p"></VJItem>
    </div>
    <div class="flex flex-col">
      <BButton
        @click="select()"
        :applyClasses="'bg-uia-pink text-white'"
        class="mt-4 w-48"
        >+ legg til verk i playlist
      </BButton>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import io from 'socket.io-client'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import VJItem from '~/components/VJItem.vue'
import BButton from '~/components/Button.vue'

export default {
  components: {
    PulseLoader,
    VJItem,
    BButton
  },
  data() {
    return {
      filesSelected: 0,
      playlist: [],
      loading: true
    }
  },
  mounted() {
    this.loading = true
    this.socket = io()
    // const code = localStorage.getItem('userCode')
    axios.get('/api/playlist').then((data) => {
      this.playlist = data.playlist
      this.loading = false
    })
    this.socket.emit('userStart', {
      userCode: this.userCode,
      message: 'start'
    })
  },
  methods: {
    select() {
      this.$router.push('/2/select')
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

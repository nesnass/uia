<template>
  <div class="container flex flex-col justify-center">
    <div v-for="p in playlist">
      <div :style="cardStyle">
        <p
          :class="primary ? 'text-2xl' : ''"
          class="absolute text-white font-bold top-0 m-8"
        >
          {{ p.title }}
        </p>
        <p v-if="p.dates" class="absolute text-gray-500 bottom-0 m-8">
          {{ p.dates }}
        </p>
      </div>
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
import BButton from '~/components/Button.vue'

import exhibitions1 from '~/pages/kurator/exhibition1.json'
import exhibitions2 from '~/pages/kurator/exhibition2.json'
import exhibitions3 from '~/pages/kurator/exhibition3.json'

export default {
  components: {
    BButton
  },
  data() {
    return {
      exhibitions1,
      exhibitions2,
      exhibitions3,
      filesSelected: 0,
      playlist: []
    }
  },
  mounted() {
    this.socket = io()
    // const code = localStorage.getItem('userCode')
    axios.get('/api/playlist').then((data) => {
      this.playlist = data.playlist
    })
    this.socket.emit('userStart', {
      userCode: this.userCode,
      message: 'start'
    })
  },
  methods: {
    select() {
      this.$router.push('/kurator/exhibitions')
    }
  }
}
</script>

<style></style>

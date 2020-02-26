<template>
  <div class="container flex flex-col justify-center">
    <div v-for="p in playlist">
      <div :style="cardStyle">
        <p>{{ timeToPlay(p) }}</p>
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
    <div
      class="fixed margin-auto bottom-0 mb-16 w-full flex flex-row justify-center"
    >
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
import moment from 'moment'
import io from 'socket.io-client'
import BButton from '~/components/Button.vue'

import exhibition1 from '~/pages/kurator/exhibition1.json'
import exhibition2 from '~/pages/kurator/exhibition2.json'
import exhibition3 from '~/pages/kurator/exhibition3.json'

export default {
  components: {
    BButton
  },
  data() {
    return {
      exhibition1,
      exhibition2,
      exhibition3,
      filesSelected: 0,
      playlist: []
    }
  },
  computed: {
    timeToPlay: () => (p) => {
      return moment(p.start).toNow(true)
    }
  },
  mounted() {
    this.socket = io()
    // const code = localStorage.getItem('userCode')
    axios.get('/api/playlist').then((result) => {
      this.playlist = result.data.playlist.map(
        (p) => this[`exhibition${p.exID}`][p.itemID]
      )
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

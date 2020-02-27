<template>
  <div class="flex flex-col justify-center content-start items-start">
    <p class="text-4xl font-black my-4 w-full text-center">kuratert</p>
    <div
      v-for="(p, index) in playlist"
      :style="cardStyle(p)"
      @click="selectItem(p)"
      class="w-full bg-gray-400 h-64 sm:h-100 lg:h-200 text-white relative bg-cover"
    >
      <p v-if="index == 0" class="font-bold text-center text-2xl">
        now playing
      </p>
      <p v-if="index == 0" class="text-center text-2xl">
        {{ timeToPlay(p) }}
      </p>
      <p v-else class="absolute bottom-0 right-0 mr-6 mb-6">
        {{ timeToPlay(p) }}
      </p>
      <div
        v-if="selectedItem.id === p.id"
        :class="index > 0 ? 'h-full' : ''"
        class="w-full p-8 text-white"
        style="background: rgba(0, 0, 0, 0.4)"
      >
        <p>
          <span class="italic">{{ p['artifact.ingress.title'] }}</span
          >{{ ' (' + p['artifact.ingress.production.yoYear'] + ')' }}
        </p>
        <p>
          {{ p['artifact.ingress.producer'] }}
        </p>
      </div>
    </div>
    <div
      class="fixed margin-auto bottom-0 mb-6 w-full flex flex-row justify-center"
    >
      <BButton
        @click="select()"
        :applyClasses="'bg-uia-pink text-white'"
        class="mt-4 w-48"
        >+ legg til verk i playlist
      </BButton>
    </div>
    <div
      v-if="thankyou"
      class="fixed inset-x-0 text-center mt-48 top-0 h-20 text-8xl italic text-uia-bg font-bold"
    >
      takk!
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
      playlist: [],
      currentTime: new Date(),
      timer: undefined,
      selectedItem: {},
      thankyou: false
    }
  },
  computed: {},
  created() {
    this.$router.push('/kurator/playlist?selected=false')
  },
  mounted() {
    this.socket = io()
    // const code = localStorage.getItem('userCode')
    this.timer = window.setInterval(this.checkTime, 1000)
    this.socket.emit('userStart', {
      userCode: this.userCode,
      message: 'start'
    })
    this.socket.on('newPlaylistItem', this.getPlaylist)
    this.getPlaylist()
    if (this.$router.currentRoute.query.selected === 'true') {
      this.showThankyou()
    }
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
  },
  methods: {
    selectItem(p) {
      if (this.selectedItem === p) {
        this.selectedItem = {}
      } else {
        this.selectedItem = p
      }
    },
    showThankyou() {
      this.thankyou = true
      window.setTimeout(() => {
        this.thankyou = false
      }, 5000)
    },
    getPlaylist() {
      axios.get('/api/playlist').then((result) => {
        this.playlist = result.data.playlist.map((p) => {
          return {
            ...this[`exhibition${p.exID}`].find((i) => i.id === p.itemID),
            finish: p.finish
          }
        })
      })
    },
    checkTime() {
      this.currentTime = new Date()
      if (this.playlist.length > 0) {
        const now = moment(this.currentTime)
        const then = moment(this.playlist[0].finish)
        const duration = moment.duration(then.diff(now))
        if (duration <= 0) {
          this.playlist.shift()
        }
      }
    },
    cardStyle: (artwork) => {
      const url = `https://storage.googleapis.com/uia-p2/${artwork.path}/${artwork.filename}`
      return {
        'background-image': `url(${url})`
      }
    },
    timeToPlay(p) {
      const now = moment(this.currentTime)
      const then = moment(p.finish)
      const duration = moment.duration(then.diff(now))
      return duration.minutes() + ':' + duration.seconds()
    },
    select() {
      this.$router.push('/kurator/exhibitions')
    }
  }
}
</script>

<style></style>

<template>
  <div class="flex flex-col justify-center relative">
    <PulseLoader :loading="loading"></PulseLoader>
    <p class="text-4xl font-black my-4 text-center">kuratert</p>
    <div v-if="!loading" class="flex flex-wrap w-full">
      <VJItem
        v-for="item in exhibitionList"
        :key="item.id"
        :artwork="item"
        :disabled="selectedItems.length > 0"
        @change="dataChanged"
        arttype="artwork"
        class="w-1/3"
      ></VJItem>
      <div v-if="exhibition" class="relative p-1 text-sm">
        <p class="font-bold">
          {{ exhibition.title }}
        </p>
        <p v-if="exhibition.abstract" class="">
          {{ exhibition.abstract }}
        </p>
      </div>
    </div>
    <div class="fixed w-full flex flex-row justify-center bottom-0 mb-6">
      <BButton
        @click="addItems()"
        :applyClasses="'bg-uia-pink text-white'"
        :disabled="selectedItems.length == 0"
        class="mt-4 w-48"
        >+ legg til verk i playlist
      </BButton>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// import io from 'socket.io-client'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import VJItem from '~/components/VJItem.vue'
import BButton from '~/components/Button.vue'

import exhibitions from '~/pages/kurator/exhibitions.json'
import exhibition1 from '~/pages/kurator/exhibition1.json'
import exhibition2 from '~/pages/kurator/exhibition2.json'
import exhibition3 from '~/pages/kurator/exhibition3.json'

export default {
  components: {
    PulseLoader,
    VJItem,
    BButton
  },
  data() {
    return {
      exhibitions,
      exhibition1,
      exhibition2,
      exhibition3,
      exhibitionList: [],
      filesSelected: 0,
      loading: false,
      userCode: undefined,
      exhibitionId: '',
      selectedItems: []
    }
  },
  computed: {
    exhibition() {
      return this.exhibitions.find((e) => e.id === this.exhibitionId)
    }
  },
  mounted() {
    this.exhibitionId = this.$route.query.id
    // this.socket = io()
    this.userCode = localStorage.getItem('userCode')
    if (this['exhibition' + this.exhibitionId]) {
      this['exhibition' + this.exhibitionId].forEach((i) => {
        i.checked = false
        this.exhibitionList.push(i)
      })
    }
  },
  methods: {
    dataChanged(data) {
      const item = this.exhibitionList.find((el) => el.id === data.id)
      item.checked = data.checked
      const i = this.selectedItems.indexOf(data.id)
      if (this.selectedItems.length < 1) {
        this.selectedItems.push(data.id)
      } else if (i > -1) {
        this.selectedItems.splice(i, 1)
      }
    },
    addItems() {
      this.loading = true
      const selectedIds = this.selectedItems.toString()
      axios
        .put(
          `/api/playlist/additems?itemIds=${selectedIds}&exId=${this.exhibitionId}&userId=${this.userCode}`
        )
        .then(() => {
          this.loading = false
          this.$router.push('/kurator/playlist?selected=true')
        })
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

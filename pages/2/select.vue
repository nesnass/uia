<template>
  <div class="container flex flex-col justify-center">
    <PulseLoader :loading="loading"></PulseLoader>
    <div class="flex flex-wrap">
      <VJItem
        v-for="item in items"
        :key="item.id"
        :artwork="item"
        :disabled="disableSelection"
        @change="dataChanged"
        class="w-1/3 bg-gray-400 h-12"
      ></VJItem>
    </div>
    <div class="fixed margin-auto mt-8">
      <BButton
        @click="select()"
        :applyClasses="'bg-uia-pink text-white'"
        :disabled="selectedItemCount == 0"
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

export default {
  components: {
    PulseLoader,
    VJItem,
    BButton
  },
  data() {
    return {
      filesSelected: 0,
      items: [],
      loading: false,
      userCode: undefined
    }
  },
  computed: {
    disableSelection() {
      return this.selectedItemCount > 1
    },
    selectedItemCount() {
      return this.items.reduce((acc, curr) => (curr.checked ? acc + 1 : acc), 0)
    }
  },
  mounted() {
    this.loading = true
    // this.socket = io()
    this.userCode = localStorage.getItem('userCode')
    axios.get('/api/playlist/allitems').then((response) => {
      this.items = response.data.items.map((i) => {
        i.checked = false
        return i
      })
      this.loading = false
    })
    /* this.socket.emit('userStart', {
      userCode: this.userCode,
      message: 'start'
    }) */
  },
  methods: {
    dataChanged(data) {
      console.log(data.checked + ' ' + data.id)
    },
    addItem(item) {
      this.loading = true
      const selectedIds = this.items.reduce(
        (acc, curr) => (curr.checked ? acc + ',' + curr.id : acc),
        ''
      )
      axios
        .put(
          `/api/playlist/additem?itemIds=${selectedIds}&userId=${this.userCode}`
        )
        .then(() => {
          this.loading = false
          this.$router.push('/2/playlist')
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

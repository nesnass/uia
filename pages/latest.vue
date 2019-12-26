<template>
  <div class="container flex flex-col justify-center">
    <PulseLoader :loading="loading"></PulseLoader>
    <div class="flex flex-row">
      <img id="preview" v-if="!loading && imagePreview" :src="imagePreview" />
      <img id="museumImage" v-if="!loading" :src="museumImage" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
export default {
  components: {
    PulseLoader
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
    /* getSignedRequest(file) {
      const xhr = new XMLHttpRequest()
      const userCode = localStorage.getItem('userCode') || ''
      xhr.open('GET', `/api/latest?user-code=${userCode}`)
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            this.downloadFile(file, response)
          } else {
            alert('Could not get signed URL.')
          }
        }
      }
      xhr.send()
    },
    downloadFile(file, response) {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', response.signedRequest)
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            this.imagePreview = response.url
          } else {
            alert('Could not upload file.')
          }
        }
      }
      xhr.send(file)
    } */
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

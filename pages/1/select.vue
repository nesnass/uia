<template>
  <div class="container flex flex-col justify-center">
    <PulseLoader :loading="loading"></PulseLoader>
    <div v-show="!loading">
      <input
        id="file-input"
        ref="file-input"
        @change="handleFileChange($event)"
        accept="image/png, image/jpeg"
        type="file"
        name="file-input"
        style="display: none"
      />
      <label
        v-show="filesSelected === 0"
        class="mt-4 w-24 bg-gray-200 p-8 cursor-pointer"
        for="file-input"
        >Velg image</label
      >
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
      loading: false
    }
  },
  methods: {
    handleFileChange(event) {
      this.filesSelected = event.target.files.length
      if (this.filesSelected > 0) {
        this.loading = true
        const file = event.target.files[0]
        // this.getSignedRequest(file)
        this.uploadFile(file)
      }
    },
    clickUpload() {
      this.$refs['file-input'].click()
    },
    /* getSignedRequest(file) {
      const userCode = localStorage.getItem('userCode') || ''
      axios
        .get(
          `/api/signedUpload?file-name=${file.name}&file-type=${file.type}&user-code=${userCode}`
        )
        .then((response) => {
          // const response = JSON.parse(xhr.responseText)
          this.loading = false
          this.uploadFile(file, response)
        })
        .catch((error) => {
          alert(`Could not get signed URL: ${error}`)
          this.loading = false
        })
    }, */
    uploadFile(file) {
      const code = window.localStorage.getItem('userCode')
      const formData = new FormData()
      formData.append('uploadedFile', file)
      axios
        .post(`/api/upload?user-code=${code}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
            // 'Content-Type': file.type
          }
        })
        .then((response) => {
          this.loading = false
          if (response.data.userCode && !code) {
            window.localStorage.setItem('userCode', response.data.userCode)
          }
          this.$router.push('/1/latest')
        })
        .catch((error) => {
          console.log(error.response.data.error.message)
        })
    }
    /* beginMatching(file, code) {
      axios
        .get(
          `/api/match?file-name=${file.name}&file-type=${file.type}&user-code=${code}`
        )
        .then(() => {
          this.$router.push('/p1/latest')
        })
        .catch((error) => alert(`Could not upload file: ${error}`))
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

<template>
  <div class="container flex flex-col justify-center">
    <PulseLoader :loading="loading"></PulseLoader>
    <div v-show="!loading">
      <input
        id="file-input"
        @change="handleFileChange($event)"
        type="file"
        style="display: none"
      />
      <BButton v-show="filesSelected === 0" class="mt-4">
        <label for="file-input">Velg image</label>
      </BButton>
    </div>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import BButton from '~/components/Button.vue'
export default {
  components: {
    BButton,
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
        this.getSignedRequest(file)
      }
    },
    getSignedRequest(file) {
      const xhr = new XMLHttpRequest()
      const userCode = localStorage.getItem('userCode') || ''
      xhr.open(
        'GET',
        `/api/sign-s3?file-name=${file.name}&file-type=${file.type}&user-code=${userCode}`
      )
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            this.uploadFile(file, response)
          } else {
            alert('Could not get signed URL.')
            this.loading = false
          }
        }
      }
      xhr.send()
    },
    uploadFile(file, response) {
      const xhr = new XMLHttpRequest()
      const code = localStorage.getItem('userCode')
      xhr.open('PUT', response.signedRequest)
      xhr.onreadystatechange = () => {
        this.loading = false
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            if (response.userCode && !code) {
              localStorage.setItem('userCode', response.userCode)
            }
            this.$router.push('/p1/latest')
          } else {
            alert('Could not upload file.')
          }
        }
      }
      xhr.send(file)
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

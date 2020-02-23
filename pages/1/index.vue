<template>
  <div
    :style="`background-image: url(${selectedBackground})`"
    class="max-w-xl m-auto font-sans mx-auto h-screen flex flex-col justify-center bg-center bg-cover"
  >
    <p class="text-5xl font-bold mb-24 text-center text-white">meg + kunst</p>
    <p class="text-2xl mb-16 px-10 text-center text-white">
      Når kunsten treffer, tror vi det er fordi det minner oss om noe i oss
      selv, eller omgivelsene våre, som vi ikke får tak i på egen hånd.
    </p>
    <div class="flex flex-col items-center">
      <!--BButton @click="prøve()" :applyClasses="'bg-gray-200'" class="mt-4 w-24"
        >prøve?</BButton
      -->
      <PulseLoader :loading="loading" color="white"></PulseLoader>
      <p v-show="loading" class="pt-4 text-white text-center text-xs px-10">
        Ditt bilde blir nå sammenlignet med 1600 kunstverk (ca 15 sek).
      </p>
      <div v-show="!loading">
        <input
          id="file-input"
          ref="file-input"
          @change="handleFileChange($event)"
          accept="image/png, image/jpeg, image/jpg"
          type="file"
          name="file-input"
          style="display: none"
        />
        <label
          v-show="filesSelected === 0"
          class="mt-4 bg-uia-bg px-24 py-4 cursor-pointer rounded text-white"
          for="file-input"
          >prøve?</label
        >
      </div>
      <!--BButton
        v-if="hasUserCode"
        :applyClasses="'bg-gray-200'"
        @click="previousImage()"
        class="mt-4 w-40"
        >forrige bilde mitt</BButton
      -->
    </div>
    <!--p class="text-sm absolute bottom-0">
      Merk: Vi bruker cookies for å finne dine tidligere bilder
    </p-->
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
      userCode: '',
      filesSelected: 0,
      loading: false,
      selectedBackground: ''
    }
  },
  computed: {
    hasUserCode() {
      return !!this.userCode
    }
  },
  mounted() {
    this.loading = false
    this.userCode = window.localStorage.getItem('userCode')
    const randomBackground = Math.floor(Math.random() * 4) + 1
    this.selectedBackground = `/backgrounds/p1-bg${randomBackground}.jpg`
  },
  methods: {
    prøve() {
      this.$router.push('/1/select')
    },
    previousImage() {
      this.$router.push('/1/latest')
    },
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
    uploadFile(file) {
      const code = window.localStorage.getItem('userCode') || ''
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
  }
}
</script>

<style>
/* .container {
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
  font-weight: bold;
  font-size: 3em;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 400;
  font-size: 1.5em;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
} */
</style>

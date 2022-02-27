<template>
  <div class="max-w-xl m-auto container flex flex-col justify-center relative">
    <p class="text-3xl font-bold mb-4 text-center">meg + kunst</p>
    <div class="flex flex-col">
      <div v-if="userImage" class="relative">
        <img
          id="preview"
          :src="userImage.publicUrl"
          class="w-full rounded-ms"
        />
        <!--div
          class="absolute flex items-center inset-x-0 bottom-0 h-8 p-2"
          style="background: rgba(0, 0, 0, 0.45)"
        >
          <p class="text-white">My image caption</p>
        </div-->
      </div>
      <!--div v-if="museumImage" class="relative flex justify-center m-4"-->
      <div v-if="museumImage" class="relative pt-2">
        <img
          id="museumImage"
          :src="museumImage.url"
          class="w-full rounded-ms"
        />
        <!--div
          class="absolute flex items-center inset-x-0 bottom-0 h-8 p-2"
          \style="background: rgba(0, 0, 0, 0.45)"
        >
          <p class="text-white">Museum image caption</p>
        </div-->
      </div>
      <p v-if="museumImage" class="text-lg text-center pt-4 font-bold">
        <span class="italic">{{
          museumImage.metadata['artifact.ingress.title']
        }}</span>
        {{
          '(' +
            museumImage.metadata['artifact.ingress.production.toYear'] +
            '),'
        }}
        av
        {{ getMuseumImageArtistName }}
      </p>
      <div class="flex flex-row items-center my-8 mx-4 justify-center">
        <div class="flex flex-col justify-center items-center mr-4">
          <label
            v-if="museumImage"
            :class="{ disabled: userImage.shared, pulse: !userImage.shared }"
            class="flex flex-col justify-center items-center"
          >
            <img
              @click="share()"
              src="@/assets/icons/dele.png"
              class="mx-2 w-24"
            />
            <p>del</p>
          </label>
        </div>
        <div class="flex flex-col justify-center items-center ml-4">
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
            for="file-input"
            class="flex flex-col justify-center items-center"
          >
            <img src="@/assets/icons/provigjen2.png" class="mx-2 w-24" />
            <p>prøve igjen?</p>
          </label>
        </div>
        <!--button @click="thankyou = !thankyou" class="z-20">TEST</button-->
      </div>
      <!--p class="text-xs">{{ userCode }}</p-->
    </div>

    <div
      v-if="thankyou"
      class="fixed top-0 left-0 w-full h-full text-8xl italic text-uia-bg font-bold flex flex-col items-center justify-center"
    >
      <p>takk!</p>
    </div>
    <div
      v-if="loading"
      class="fixed z-10 top-0 left-0 w-full h-full bg-gray-800 opacity-75 flex flex-col items-center justify-center"
    >
      <PulseLoader :loading="loading" color="white"></PulseLoader>
    </div>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import axios from 'axios'
export default {
  components: {
    PulseLoader
  },
  data() {
    return {
      filesSelected: 0,
      userImage: undefined,
      museumImage: undefined,
      userCode: '',
      loading: true,
      thankyou: false
    }
  },
  computed: {
    userImageStyle() {
      return this.userImage
        ? `background-image: url(${this.userImage.publicUrl})`
        : ''
    },
    museumImageStyle() {
      return this.museumImage
        ? `background-image: url(${this.museumImage.url})`
        : ''
    },
    getMuseumImageArtistName() {
      const title = this.museumImage.metadata['artifact.ingress.producer']
      const firstSecond = title.split(',')
      console.log(firstSecond)
      return firstSecond.length === 2
        ? firstSecond[1] + ' ' + firstSecond[0]
        : title
    }
  },
  mounted() {
    this.loading = true
    this.userCode = window.localStorage.getItem('userCode')
    axios.get(`/api/image?user-code=${this.userCode}`).then((data) => {
      this.userImage = data.data.userImage
      this.museumImage = data.data.museumImage
      this.loading = false
    })
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
          this.$refs['file-input'].value = null
          this.loading = false
          this.filesSelected = 0
          if (response.status !== 200) {
            console.log(response.statusText)
          } else {
            if (response.data.userCode && !code) {
              window.localStorage.setItem('userCode', response.data.userCode)
            }
            this.$router.go(0)
          }
        })
        .catch((error) => {
          console.log(error.response.data)
        })
    },
    showThankyou() {
      this.thankyou = true
      window.setTimeout(() => {
        this.thankyou = false
      }, 2000)
    },
    share() {
      if (this.userImage.shared) {
        return
      }
      const code = window.localStorage.getItem('userCode')
      const imageCode = this.userImage.imageCode
      axios
        .get(`/api/share?user-code=${code}&image-code=${imageCode}`)
        .then((response) => {
          this.userImage.shared = true
          this.showThankyou()
        })
        .catch((error) => {
          console.log(error.response.data.error.message)
        })
    }
  }
}
</script>

<style>
.pulse {
  -webkit-animation: pulse 2s infinite;
  animation: pulse 2s infinite;
}

@-webkit-keyframes pulse {
  0%,
  20%,
  50%,
  80%,
  100% {
    -webkit-transform: scale(1, 1);
  }
  40%,
  60% {
    -webkit-transform: scale(1.2, 1.2);
  }
}
@-moz-keyframes pulse {
  0%,
  20%,
  50%,
  80%,
  100% {
    -moz-transform: scale(1, 1);
  }
  40%,
  60% {
    -moz-transform: scale(1.2, 1.2);
  }
}
@keyframes pulse {
  0%,
  20%,
  50%,
  80%,
  100% {
    -webkit-transform: scale(1, 1);
    -moz-transform: scale(1, 1);
    -ms-transform: scale(1, 1);
    -o-transform: scale(1, 1);
    transform: scale(1, 1);
  }
  40%,
  60% {
    -webkit-transform: scale(1.2, 1.2);
    -moz-transform: scale(1.2, 1.2);
    -ms-transform: scale(1.2, 1.2);
    -o-transform: scale(1.2, 1.2);
    transform: scale(1.2, 1.2);
  }
}

.disabled {
  /*   -webkit-filter: grayscale();
  -moz-filter: grayscale();
  -ms-filter: grayscale();
  -o-filter: grayscale();
  filter: grayscale(); */
  opacity: 0.3;
}
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
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
.myBackground {
  height: 0;
  padding: 0;
  padding-bottom: 100%;
  width: 100vw;
} */
</style>

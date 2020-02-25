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
          museumImage.metadata['artifact.ingress.title'] +
            ' (' +
            museumImage.metadata['artifact.ingress.production.toYear'] +
            ').'
        }}</span>
        av
        {{ museumImage.metadata['artifact.ingress.producer'] }}
      </p>
      <div
        v-if="museumImage"
        class="flex flex-row items-center justify-center mx-4 mt-4"
      >
        <img src="@/assets/icons/facebook.png" class="mx-2 w-8 h-8" />
        <img
          @click="share()"
          :class="{ disabled: userImage.shared }"
          src="@/assets/icons/share.png"
          class="mx-2 w-24"
        />
        <img src="@/assets/icons/instagram.png" class="mx-2 w-8 h-8" />
      </div>
      <div class="flex flex-col items-center my-8">
        <BButton
          @click="prøveIgjen()"
          class="mt-4 w-36 bg-white border border-uia-bg text-uia-bg"
          >prøv igjen?</BButton
        >
      </div>
      <!--p class="text-xs">{{ userCode }}</p-->
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
import BButton from '~/components/Button.vue'
export default {
  components: {
    BButton
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
    prøveIgjen() {
      this.$router.push('/1')
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
.disabled {
  /*   -webkit-filter: grayscale();
  -moz-filter: grayscale();
  -ms-filter: grayscale();
  -o-filter: grayscale();
  filter: grayscale(); */
  opacity: 50%;
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

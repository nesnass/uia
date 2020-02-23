<template>
  <div class="container flex flex-row max-w-5xl">
    <div class="bg-gray-200 w-1/2 no-print">
      <p class="py-4">Shared With SKMU</p>
      <div v-for="item in sharedImages" class="flex flex-col pt-4">
        <p class="text-xs">usercode: {{ item.userCode }}</p>
        <div v-for="image in item.imageRecords" class="flex flex-row pl-4">
          <p
            @click="itemDetails(image, item.userCode)"
            class="text-blue-500 cursor-pointer"
          >
            Preview&nbsp;
          </p>
          <a
            v-if="userImage"
            :href="userImage.originalUrl"
            class="text-orange-500"
            target="_none"
            >User Image&nbsp;</a
          >
          <a
            v-if="museumImage"
            :href="`${museumImage.url}?dimension=max`"
            class="text-green-500"
            target="_none"
            >Museum Image</a
          >
        </div>
        <hr />
      </div>
    </div>
    <div
      v-if="selectedItem"
      class="max-w-xl flex flex-col justify-center relative"
    >
      <p class="text-3xl font-bold mb-4 text-center">meg + kunst</p>
      <div class="flex flex-col">
        <div v-if="userImage" class="relative">
          <img
            id="preview"
            :src="userImage.publicUrl"
            class="w-full rounded-ms"
          />
        </div>
        <div v-if="museumImage" class="relative pt-2">
          <img
            id="museumImage"
            :src="museumImage.url"
            class="w-full rounded-ms"
          />
        </div>
        <p v-if="museumImage" class="text-lg text-center pt-4 font-bold">
          <span class="italic">{{
            museumImage.metadata['artifact.ingress.title']
          }}</span>
          by
          {{
            museumImage.metadata['artifact.ingress.producer'] +
              ' (' +
              museumImage.metadata['artifact.ingress.production.toYear'] +
              ').'
          }}
        </p>
        <div class="flex flex-col items-center my-8">
          <BButton
            @click="prøveIgjen()"
            class="mt-4 w-36 bg-white border border-uia-bg text-uia-bg"
            >prøv igjen?</BButton
          >
        </div>
      </div>

      <div
        v-if="thankyou"
        class="fixed inset-x-0 text-center mt-48 top-0 h-20 text-8xl italic text-uia-bg font-bold"
      >
        takk!
      </div>
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
      thankyou: false,
      sharedImages: [],
      selectedUserCode: undefined,
      selectedItem: undefined
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
    axios.get('/api/allshared').then((response) => {
      this.sharedImages = response.data
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
    itemDetails(item, userCode) {
      this.selectedUserCode = userCode
      this.selectedItem = item
      axios
        .get(
          `/api/image?user-code=${this.selectedUserCode}&image-code=${this.selectedItem.imageCode}`
        )
        .then((data) => {
          this.userImage = data.data.userImage
          this.museumImage = data.data.museumImage
          this.loading = false
        })
    }
  }
}
</script>

<style>
.disabled {
  -webkit-filter: grayscale();
  -moz-filter: grayscale();
  -ms-filter: grayscale();
  -o-filter: grayscale();
  filter: grayscale();
}
@media print {
  .no-print {
    display: none;
  }
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

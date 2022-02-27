<template>
  <div class="container flex flex-row max-w-5xl relative">
    <div class="bg-gray-200 no-print">
      <div class="p-2 flex flex-row items-center justify-between">
        <div>
          <p class="font-bold">
            Shared With SKMU
          </p>
          <span>{{ imagesByUser.length }} users</span>
          <span>{{ grandTotal }} matches</span>
        </div>
        <div>
          <input id="one" :value="false" v-model="dateViewMode" type="radio" />
          <label for="one">By User</label>
          <input id="two" :value="true" v-model="dateViewMode" type="radio" />
          <label for="two">By Day</label>
        </div>
      </div>
      <!-- View by Day -->
      <div v-if="dateViewMode" class="max-h-screen overflow-auto">
        <div v-for="(day, i) in imagesByDay" :key="'day-' + i">
          <p class="m-2 text-xs">{{ dayStringForMillis(day[0].created) }}</p>
          <ImagePair
            v-for="(imagePair, j) in day"
            :key="'imagepair-' + j"
            :imagePair="imagePair"
            :userCode="imagePair.userCode"
            @click.native="itemDetails(imagePair, imagePair.userCode)"
          />
          <hr class="pb-5 border-t-8 border-gray-800" />
        </div>
      </div>
      <!-- View by user -->
      <div v-else class="max-h-screen overflow-auto">
        <div
          v-for="(item, i) in imagesByUser"
          :key="'item-' + i"
          class="flex flex-col pt-4"
        >
          <p class="text-xs m-2">usercode: {{ item.userCode }}</p>
          <ImagePair
            v-for="(imagePair, j) in sortByDate(item.imageRecords)"
            :key="'imagepair-' + j"
            :imagePair="imagePair"
            :userCode="imagePair.userCode"
            @click.native="itemDetails(imagePair, item.userCode)"
          />
          <hr class="pb-5 border-t-8 border-gray-800" />
        </div>
      </div>
    </div>
    <div
      v-if="selectedItem"
      class="p-4 max-w-xl flex flex-col justify-start relative"
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
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ImagePair from '~/components/ImagePair.vue'
export default {
  components: {
    ImagePair
  },
  data() {
    return {
      filesSelected: 0,
      userImage: undefined,
      museumImage: undefined,
      userCode: '',
      loading: true,
      imagesByUser: [],
      imagesByDay: [],
      selectedUserCode: undefined,
      selectedItem: undefined,
      grandTotal: 0,
      dateViewMode: true
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
      if (response.data && Array.isArray(response.data)) {
        this.imagesByUser = response.data
        this.grandTotal = this.imagesByUser.reduce(
          (acc, curr) => (acc += curr.imageRecords.length),
          0
        )
        let tempImages = []
        this.imagesByUser.forEach((i) => {
          i.imageRecords.forEach((ir) => {
            const newEntry = {
              ...ir,
              userCode: i.userCode,
              latest: i.latest
            }
            tempImages.push(newEntry)
          })
        })
        tempImages = this.sortByDate(tempImages)
        this.imagesByDay = []
        if (tempImages.length > 0) {
          let currentDay = new Date(tempImages[0].created).getDate()
          let currentDayImages = []
          tempImages.forEach((ti) => {
            const tiDay = new Date(ti.created).getDate()
            if (tiDay === currentDay) {
              currentDayImages.push(ti)
            } else {
              currentDay = tiDay
              this.imagesByDay.push(currentDayImages)
              currentDayImages = [ti]
            }
          })
        }
      }
    })
  },
  methods: {
    dayStringForMillis(millis) {
      const d = new Date(millis)
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
      const formatted = new Intl.DateTimeFormat('en-US', options).format(d)
      return formatted
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
    },
    pdf(item, userCode) {
      this.selectedUserCode = userCode
      this.selectedItem = item
      axios.get(
        `/api/pdf?user-code=${this.selectedUserCode}&image-code=${this.selectedItem.imageCode}`
      )
    },
    sortByDate(records) {
      if (records) {
        return records.sort((a, b) => {
          return a.created < b.created ? 1 : -1
        })
      }
      return []
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
  header,
  footer,
  aside,
  nav,
  form,
  iframe,
  .menu,
  .hero,
  .adslot {
    display: none;
  }
  .no-print {
    display: none;
  }
  div {
    break-inside: avoid;
  }
}
@page {
  size: landscape;
  margin: 1cm;
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

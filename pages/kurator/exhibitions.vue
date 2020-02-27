<template>
  <div class="flex flex-col justify-center">
    <PulseLoader :loading="loading"></PulseLoader>
    <p class="text-4xl font-black my-4 text-center">kuratert</p>
    <div class="flex flex-wrap">
      <VJItem
        v-for="(item, index) in exhibitionList"
        :key="item.id"
        :primary="index === 0"
        :artwork="item"
        :disabled="idSelected != ''"
        @change="dataChanged"
        :class="index == 0 ? 'w-full' : 'w-1/2'"
        arttype="exhibition"
      ></VJItem>
    </div>
    <div
      class="fixed margin-auto bottom-0 mb-6 w-full flex flex-row justify-center"
    >
      <!--BButton
        @click="selectExhibition()"
        :applyClasses="'bg-uia-pink text-white'"
        :disabled="idSelected == ''"
        class="mt-4 w-48"
        >velg utstilling
      </BButton-->
    </div>
  </div>
</template>

<script>
// import io from 'socket.io-client'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import VJItem from '~/components/VJItem.vue'
// import BButton from '~/components/Button.vue'
import exhibitions from '~/pages/kurator/exhibitions.json'

export default {
  components: {
    PulseLoader,
    VJItem
    // BButton
  },
  data() {
    return {
      filesSelected: 0,
      loading: false,
      userCode: undefined,
      exhibitions,
      exhibitionList: [],
      idSelected: ''
    }
  },
  computed: {
    itemIsSelected() {
      return this.exhibitionList.some((i) => i.checked)
    }
  },
  mounted() {
    this.exhibitions.forEach((i) => {
      i.checked = false
      this.exhibitionList.push(i)
    })
  },
  methods: {
    dataChanged(data) {
      const item = this.exhibitionList.find((el) => el.id === data.id)
      item.checked = data.checked
      if (!this.idSelected) {
        this.idSelected = data.id
      } else if (this.idSelected === data.id) {
        this.idSelected = ''
      }
      if (this.idSelected) {
        this.selectExhibition()
      }
    },
    selectExhibition() {
      this.$router.push(`/kurator/select?id=${this.idSelected}`)
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

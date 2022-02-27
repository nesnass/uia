<template>
  <div class="flex flex-col m-1 p-2 bg-gray-100 rounded-md">
    <!--img :src="image.originalUrl" class="w-5 h-5" /-->
    <div class="flex flex-row">
      <span>{{ timeStringForMillis(imagePair.created) }}</span>
    </div>
    <div class="flex flex-row">
      <div class="flex flex-col">
        <div>
          <a :href="imagePair.originalUrl" target="_none"
            ><img :src="imagePair.publicUrl" class="rounded-ms w-12 mr-2" />
          </a>
        </div>
        <p class="text-xs">
          faces:
          {{
            imagePair.labels.number_of_faces
              ? imagePair.labels.number_of_faces[0]
              : '?'
          }}
        </p>
      </div>
      <div v-if="museumImage" class="flex flex-col">
        <div>
          <a :href="`${museumImage}?dimension=max`" target="_none"
            ><img :src="museumImage" class="rounded-ms w-12" />
          </a>
        </div>
        <p v-if="imagePair.bestMatch.faces >= 0" class="text-xs">
          faces: {{ imagePair.bestMatch.faces }}
        </p>
      </div>
      <div v-if="imagePair.imageCode">
        <a
          :href="
            `/api/pdf?user-code=${userCode}&image-code=${imagePair.imageCode}`
          "
          :class="[imagePair.pdf ? 'text-gray-500' : 'text-purple-600']"
          class="ml-2"
          target="_none"
          >{{ imagePair.pdf ? '✔︎' : '' }} PDF</a
        >
      </div>
    </div>
    <div class="flex flex-row">
      <p class="text-xs">{{ imagePair.userCode }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imagePair: {
      type: Object,
      default: () => {}
    },
    userCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      checked: false
    }
  },
  computed: {
    museumImage() {
      const matchName = this.imagePair.bestMatch.filename
      if (matchName.substring(0, 4) === 'SKMU') {
        return `https://storage.googleapis.com/uia-curated/${matchName}.jpg`
      } else {
        return `https://dms01.dimu.org/image/${matchName}`
      }
    }
  },
  methods: {
    timeStringForMillis(millis) {
      const d = new Date(millis)
      const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
      const minutes =
        d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
      return `${hours}:${minutes} - ${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
    }
  }
}
</script>

<style scoped>
.redDot {
  height: 20px;
  width: 20px;
  background-color: #ed595d;
  border-radius: 50%;
  display: inline-block;
}
</style>

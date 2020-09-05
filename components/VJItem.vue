<template>
  <div class="p-1 h-full select-none">
    <div
      :style="cardStyle"
      @click="clickItem"
      class="bg-local rounded bg-cover flex flex-col cursor-pointer relative"
    >
      <div v-if="checked" class="redDot absolute top-0 right-0 m-4"></div>
      <div
        v-if="arttype == 'exhibition'"
        class="h-48 md:h-100 lg:h-150 relative"
      >
        <p
          :class="primary ? 'text-2xl' : ''"
          class="absolute text-white font-bold top-0 m-8"
        >
          {{ artwork.title }}
        </p>
        <p v-if="artwork.dates" class="absolute text-gray-500 bottom-0 m-8">
          {{ artwork.dates }}
        </p>
      </div>
      <div v-else class="relative h-24 md:h-48">
        <p
          :class="primary ? 'text-2xl' : ''"
          class="absolute text-white font-bold top-0 m-8"
        >
          {{ artwork.title }}
        </p>
        <p v-if="artwork.dates" class="absolute text-gray-500 bottom-0 m-8">
          {{ artwork.dates }}
        </p>
      </div>
      <!--input
      @change="emitChange"
      :disabled="!artwork.checked && disabled"
      type="checkbox"
    /-->
    </div>
    <!-- Show Exhibition info under each block -->
    <!--div v-if="arttype == 'exhibition'" class="relative p-1 text-sm">
      <p class="font-bold">
        {{ artwork.title }}
      </p>
      <p v-if="artwork.abstract" class="">
        {{ artwork.abstract }}
      </p>
    </div-->
  </div>
</template>

<script>
export default {
  props: {
    artwork: {
      type: Object,
      default: () => {}
    },
    arttype: {
      type: String,
      default: 'artwork'
    },
    primary: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checked: false
    }
  },
  computed: {
    cardStyle() {
      const filename =
        this.artwork.filename.substring(0, this.artwork.filename.length - 4) +
        '_s.jpg'
      const url = `https://storage.googleapis.com/uia-p2/${this.artwork.path}/${filename}`
      return {
        'background-image': `url(${url})`
        // border: this.checked ? 'solid red 3px' : ''
      }
    }
  },
  methods: {
    clickItem() {
      if (!this.disabled || this.checked) {
        this.checked = !this.checked
        this.$emit('change', {
          checked: this.checked,
          id: this.artwork.id
        })
      }
    }
    /*     emitChange($event) {
      if (!this.disabled || this.artwork.checked) {
        const checked = $event.target.checked
        this.artwork.checked = checked
        this.$emit('change', {
          checked,
          id: this.artwork.id
        })
      }
    } */
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

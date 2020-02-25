<template>
  <div class="p-1">
    <div
      :style="cardStyle"
      @click="clickItem"
      class="bg-local rounded bg-cover h-full"
    >
      <div v-if="arttype == 'exhibition'" class="h-full relative">
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
      <div v-else>
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
      return {
        'background-image': `url(${'/' +
          this.artwork.path +
          '/' +
          this.artwork.filename})`,
        border: this.checked ? 'solid red 3px' : ''
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

<style scoped></style>

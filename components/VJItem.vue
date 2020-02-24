<template>
  <div :style="cardStyle" class="bg-local rounded">
    <p>{{ artwork.filename }}</p>
    <input
      @change="emitChange"
      :disabled="!artwork.checked && disabled"
      type="checkbox"
    />
  </div>
</template>

<script>
export default {
  props: {
    artwork: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    cardStyle() {
      return {
        'background-image': `url(${this.artwork.url})`
      }
    }
  },
  methods: {
    emitChange($event) {
      if (!this.disabled || this.artwork.checked) {
        const checked = $event.target.checked
        this.artwork.checked = checked
        this.$emit('change', {
          checked,
          id: this.artwork.id
        })
      }
    }
  }
}
</script>

<style scoped></style>

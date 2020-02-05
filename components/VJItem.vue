<template>
  <div :style="cardStyle" class="bg-local rounded-lg"></div>
</template>

<script>
export default {
  props: {
    artwork: {
      type: Object,
      default: () => {}
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
  methods: {}
}
</script>

<style scoped></style>

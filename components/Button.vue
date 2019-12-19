<template>
  <button
    :class="{ 'text-gray-400': disabled }"
    @click="click"
    class="p-4 bg-gray-200 rounded-lg justify-center"
  >
    <span v-if="text" class="text-xl text-black">{{ text }}</span>
    <slot></slot>
    <img v-if="logo" :src="logo" class="w-24" />
  </button>
</template>

<script>
export default {
  props: {
    logo: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    click($event) {
      if (!this.disabled) {
        this.$emit('click', $event)
      }
    }
  }
}
</script>

<style scoped></style>

<template>
  <button
    :class="customClasses"
    @click="click"
    class="p-4 rounded justify-center"
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
    },
    applyClasses: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    customClasses() {
      const classes = {
        'text-white': this.disabled,
        'bg-gray-400': this.disabled
      }
      const extraClasses = this.applyClasses.split(' ')
      if (extraClasses) {
        extraClasses.forEach((element) => {
          classes[element] = true
        })
      }
      return classes
    }
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

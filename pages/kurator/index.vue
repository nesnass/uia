<template>
  <div class="mx-auto h-screen flex flex-col justify-center main-background">
    <p class="pt-4 text-center text-white text-6xl font-bold">kuratert</p>
    <p class="p-4 text-center text-white">
      Velkommen! Her i KUNSTSILO har vi lyst til å overlate litt av kontrollen
      til deg. Hvilke verk fra den pågående utstillingen vil du se nærmere på?
    </p>
    <div class="flex flex-col items-center">
      <BButton @click="kuratere()" :applyClasses="'bg-white'" class="mt-4 w-48"
        >la meg kuratere</BButton
      >
    </div>
  </div>
</template>

<script>
import BButton from '~/components/Button.vue'

export default {
  components: {
    BButton
  },
  data() {
    return {
      userCode: '',
      socket: undefined
    }
  },
  computed: {
    hasUserCode() {
      return !!this.userCode
    }
  },
  mounted() {
    this.userCode = window.localStorage.getItem('userCode')
  },
  methods: {
    kuratere() {
      this.$router.push('/kurator/exhibitions')
    }
  }
}
</script>

<style>
.main-background {
  background-color: #e65a5a;
}
</style>

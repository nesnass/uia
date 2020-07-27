<template>
  <div class="container flex flex-row max-w-5xl">
    <UploadFile />
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile'
export default {
  components: {
    UploadFile
  },
  data() {
    return {
      selectedTab: 'upload'
    }
  },
  methods: {}
}
</script>

<style></style>

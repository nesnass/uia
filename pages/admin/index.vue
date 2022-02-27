<template>
  <div class="container flex flex-col max-w-5xl p-4">
    <div class="flex flex-col w-full no-print">
      <ul class="flex border-b">
        <li class="-mb-px mr-1">
          <a
            :class="{ tabSelected: selectedTab === 'shared' }"
            @click="selectedTab = 'shared'"
            class="bg-white inline-block py-2 px-4 font-semibold cursor-pointer"
            >Shared</a
          >
        </li>
        <!--li class="-mb-px mr-1">
          <a
            :class="{ tabSelected: selectedTab === 'upload' }"
            @click="selectedTab = 'upload'"
            class="bg-white inline-block py-2 px-4 hover:text-blue-800 font-semibold cursor-pointer"
            >Upload</a
          >
        </li-->
        <li class="-mb-px mr-1">
          <a
            @click="test"
            class="bg-white inline-block py-2 px-4 hover:text-blue-800 font-semibold cursor-pointer"
            >Ping</a
          >
        </li>
        <li class="-mb-px mr-1">
          <a
            @click="ai()"
            class="bg-white text-uia-korall inline-block py-2 px-4 hover:text-blue-800 font-semibold cursor-pointer"
            >AI</a
          >
        </li>
      </ul>
    </div>
    <Upload v-if="selectedTab === 'upload'" class="no-print" />
    <Shared v-if="selectedTab === 'shared'" />
  </div>
</template>

<script>
import axios from 'axios'
import Upload from './upload'
import Shared from './shared'
export default {
  components: {
    Upload,
    Shared
  },
  data() {
    return {
      selectedTab: 'shared'
    }
  },
  methods: {
    ai() {
      axios.get('/api/auth/logout')
      this.$router.push('/')
    },
    logout() {
      axios.get('/api/auth/logout')
      this.$router.push('/')
    },
    async test() {
      const result = await axios.get('/api/auth/test')
      console.dir(result)
    }
  }
}
</script>

<style scoped lang="postcss">
.tabSelected {
  @apply border-l border-t border-r border-b-0 rounded-t text-blue-700;
}
@media print {
  .no-print {
    display: none;
  }
}
@page {
  size: landscape;
  margin: 1cm;
}
</style>

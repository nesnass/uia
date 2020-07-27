<template>
  <div class="container flex flex-col max-w-5xl p-4">
    <div class="flex flex-col w-full">
      <ul class="flex border-b">
        <li class="-mb-px mr-1">
          <a
            :class="{ tabSelected: selectedTab === 'shared' }"
            @click="selectedTab = 'shared'"
            class="bg-white inline-block py-2 px-4 font-semibold cursor-pointer"
            >Shared</a
          >
        </li>
        <li class="-mb-px mr-1">
          <a
            :class="{ tabSelected: selectedTab === 'upload' }"
            @click="selectedTab = 'upload'"
            class="bg-white inline-block py-2 px-4 hover:text-blue-800 font-semibold cursor-pointer"
            >Upload</a
          >
        </li>
        <li class="-mb-px mr-1">
          <a
            @click="logout"
            class="bg-white inline-block py-2 px-4 hover:text-blue-800 font-semibold cursor-pointer"
            >Log out</a
          >
        </li>
      </ul>
    </div>
    <Upload v-if="selectedTab === 'upload'" />
    <Shared v-if="selectedTab === 'shared'" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Upload from './upload'
import Shared from './shared'
export default {
  middleware: 'auth',
  components: {
    Upload,
    Shared
  },
  data() {
    return {
      selectedTab: 'upload'
    }
  },
  computed: {
    ...mapState('auth', ['loggedIn', 'user'])
  },
  methods: {
    async logout() {
      await this.$auth.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped lang="postcss">
.tabSelected {
  @apply border-l border-t border-r border-b-0 rounded-t text-blue-700;
}
</style>

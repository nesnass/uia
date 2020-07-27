import axios from 'axios'

export const state = () => ({
  authUser: null,
  incorrectLogin: false
})

export const mutations = {
  SET_USER(state, data) {
    state.authUser = data.user
  },
  INCORRECT_LOGIN(state, is) {
    state.incorrectLogin = is
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  /*   nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.authUser) {
      commit('SET_USER', req.session.authUser)
    }
  }, */
  async login({ commit }, { username, password }) {
    try {
      const { data } = await axios.post('/api/auth/login', {
        username,
        password
      })
      if (data.user) {
        commit('SET_USER', data)
        this.$router.push('/admin')
      } else {
        console.log('app: Incorrect login')
        commit('INCORRECT_LOGIN', true)
        setTimeout(() => {
          commit('INCORRECT_LOGIN', false)
        }, 1000)
      }
    } catch (error) {
      console.log('app: Login ERROR')
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  async logout({ commit }) {
    await axios.post('/api/auth/logout')
    commit('SET_USER', null)
  }
}

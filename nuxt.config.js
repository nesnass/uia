import bodyParser from 'body-parser'
import session from 'express-session'
import dotenv from 'dotenv'
const MemoryStore = require('memorystore')(session)
dotenv.config()

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  rolling: true,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: Number(process.env.SESSION_VALIDITY_MS) },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  })
}

export default {
  // mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/main.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/axios'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
    // '~/io'  // Turn on io to inlcude sockets for running Prototype 2
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    }
  },
  serverMiddleware: [
    bodyParser.json(),
    // session middleware
    session(sessionOptions),
    // Api middleware
    // We add /api/login & /api/logout routes
    '~/api'
  ]
}

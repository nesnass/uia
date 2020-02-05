const http = require('http')
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

// Database connection
const { mongoose } = require('./database/mongodb.js')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('DB Connected')
})

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  let { host, port } = nuxt.options.server
  if (process.env.NODE_ENV === 'development') {
    host = process.env.HOST || '0.0.0.0'
    port = process.env.PORT || 3000
  }

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  server.listen(port, host)

  // Configure Playlist with Socket.io
  require('./vjPlaylist.js').start(io)

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()

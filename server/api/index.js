import express from 'express'
const url = require('url')
const vjPlaylist = require('../vjPlaylist.js')
const utilities = require('../utilities.js')
const upload = require('./GCPUpload.js')
const matches = require('./GCPMatches.js')

const router = express.Router()

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const base = `${protocol}://${req.headers.host}`
  const fullURL = new url.URL(req.url, base)
  const searchparams = new url.URLSearchParams(fullURL.searchParams)
  req.searchParams = searchparams
  next()
})

// Send a file directly via this server
router.post('/upload', (req, res, next) => {
  utilities.uploadHandler.single('uploadedFile')(req, res, (err) => {
    if (err) {
      console.log(err)
      return res.status(500).send(`File upload error: ${err.message}`)
    }
    upload.send(req, res, next)
  })
})

// Get most recently uploaded image for a given userCode
router.get('/image', (req, res) => {
  matches.getImage(req, res)
})

// Sign a file in preparation for upload
router.get('/share', (req, res) => {
  matches.share(req, res)
})

// Sign a file in preparation for upload
router.get('/allshared', (req, res) => {
  matches.allSharedItems(req, res)
})

// --------------   P2 -----------------

// Playlist routes
router.get('/playlist', (req, res) => {
  const playlist = vjPlaylist.getPlaylist()
  res
    .send({ playlist })
    .status(200)
    .end()
})
router.get('/playlist/allitems', (req, res) => {
  const items = vjPlaylist.getAllItems()
  res
    .send({ items })
    .status(200)
    .end()
})
router.put('/playlist/additems', (req, res) => {
  vjPlaylist.addItems(req.query.itemIds, req.query.exId, req.query.userId)
  res.status(200).send()
})
// Export the server middleware
export default {
  path: '/api',
  handler: router
}

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

// Sign a file in preparation for upload
router.get('/signedUpload', (req, res) => {
  upload.signUpload(req, res)
})

// Send a file directly via this server
router.post(
  '/upload',
  utilities.uploadHandler.single('uploadedFile'),
  (req, res, next) => {
    upload.send(req, res, next)
  }
)

// Attempt to match an uploaded image with one in the collection
router.get('/match', (req, res) => {
  upload.matchUpload(req, res)
})

// Get most recently uploaded image for a given userCode
router.get('/latest', (req, res) => {
  matches.getLatestImage(req, res)
})

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
router.put('/playlist/additem', (req, res) => {
  vjPlaylist.addItems(req.query.itemIds, req.query.userId)
  res.status(200).send()
})
// Export the server middleware
export default {
  path: '/api',
  handler: router
}

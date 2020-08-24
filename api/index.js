import url from 'url'
import express from 'express'
// import session from 'express-session'
import vjPlaylist from './vjPlaylist.js'
import utilities from './utilities.js'
import auth from './auth.js'
import upload from './GCPUpload.js'
import matches from './GCPMatches.js'

// const MemoryStore = require('memorystore')(session)
const router = express.Router()
// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// session middleware
/* const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  rolling: true,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: Number(process.env.SESSION_VALIDITY_MS) },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  })
}
session(sessionOptions)
app.use(session(sessionOptions)) */

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

// Get all items shared to the DB
router.get('/allshared', auth.checkAuthentication, (req, res) => {
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
  const itemIds = req.searchParams.get('itemIds')
  const exId = req.searchParams.get('exId')
  const userId = req.searchParams.get('userId')
  vjPlaylist.addItems(itemIds, exId, userId)
  res.status(200).send()
})

// --------------- PDF ------------------

router.get('/pdf', auth.checkAuthentication, (req, res, next) => {
  matches.pdf(req, res)
})

// ---------------  Auth ----------------

router.get('/auth/login', (req, res, next) => {
  auth.login(req, res)
})

router.get('/auth/logout', auth.checkAuthentication, (req, res) => {
  auth.logout(req, res)
})

router.get('/auth/test', auth.checkAuthentication, (req, res) => {
  auth.test(req, res)
})

// Export the server middleware
export default {
  path: '/api',
  handler: router
}

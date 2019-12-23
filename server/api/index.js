import express from 'express'
const url = require('url')
const upload = require('./upload.js')
const matches = require('./matches.js')
// Create express router
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
router.get('/sign-s3', (req, res) => {
  upload.signUpload(req, res)
})

// Get most recently uploaded image for a given userCode
router.get('/latest', (req, res) => {
  matches.getLatestImage(req, res)
})

// Export the server middleware
export default {
  path: '/api',
  handler: router
}

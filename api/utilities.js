/*
 Designed and developed by Richard Nesnass
*/
import http from 'http'
import sharp from 'sharp'
import multer from 'multer'

function shuffleArray(array) {
  const a = array.slice()
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function resizeImage(image) {
  return sharp(image.buffer)
    .toFormat('jpg')
    .rotate()
    .resize(400)
    .toBuffer()
}

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const uploadHandler = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter
})

function httpRequest(params, postData) {
  return new Promise(function(resolve, reject) {
    const req = http.request(params, function(res) {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode))
      }
      let body = []
      res.on('data', function(chunk) {
        body.push(chunk)
      })
      res.on('end', function() {
        try {
          body = JSON.parse(Buffer.concat(body).toString())
        } catch (error) {
          reject(error)
        }
        resolve(body)
      })
    })
    req.on('error', function(error) {
      reject(error)
    })
    if (postData) {
      req.write(postData)
    }
    req.end()
  })
}

export default {
  shuffleArray,
  getRandomInt,
  httpRequest,
  resizeImage,
  uploadHandler
}

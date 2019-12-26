/*
 Designed and developed by Richard Nesnass
*/
const https = require('https')

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

function httpRequest(params, postData) {
  return new Promise(function(resolve, reject) {
    const req = https.request(params, function(res) {
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

module.exports = {
  shuffleArray,
  getRandomInt,
  httpRequest
}

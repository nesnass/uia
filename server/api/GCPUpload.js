const fs = require('fs')
const mime = require('mime-types')
const uuidv4 = require('uuid/v4')
const FormData = require('form-data')
const dirPath = process.cwd() + '/server'
const { Storage } = require('@google-cloud/storage')
const Firestore = require('@google-cloud/firestore')
const utilities = require('../utilities')
const { UserRecord, ImageRecord } = require('./Models')
const UPLOAD_BUCKET = process.env.GCP_UPLOAD_BUCKET
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID
const GCP_KEY_FILENAME = process.env.GCP_KEY_FILENAME
const SIMILARITY_API = process.env.SIMILARITY_API

const dimuSkmu = JSON.parse(
  fs.readFileSync(`${dirPath}/data/dimu_skmu.json`, 'utf8')
)

const config =
  process.env.NODE_ENV !== 'production'
    ? {
        projectId: GCP_PROJECT_ID,
        keyFilename: GCP_KEY_FILENAME
      }
    : {}

const storage = new Storage(config)
const database = new Firestore(config)

// Test that storage connection works
/*
async function testStorageConnection() {
  try {
    const results = await storage.getBuckets()
    const [buckets] = results
    console.log(`Storage buckets found: ${buckets.length}`)
  } catch (err) {
    console.error('ERROR:', err)
  }
}
testStorageConnection()

function testDBConnection() {
  database
    .collection('userMatches')
    .get()
    .then((snapshot) => {
      console.log(`Documents in DB: ${snapshot.size}`)
    })
    .catch((err) => {
      console.log('Error getting database documents', err)
    })
}
testDBConnection()
 */

// Update a user in GCP Database
function updateUserInDB(userData) {
  const {
    userCode,
    fileName,
    originalUrl,
    fileType,
    publicUrl,
    matches,
    labels,
    bestMatch
  } = userData
  return new Promise((resolve, reject) => {
    const userRef = database.collection('userMatches').doc(userCode)
    userRef
      .get()
      .then((doc) => {
        let userRecord
        if (!doc.exists) {
          userRecord = UserRecord({ userCode })
        } else {
          userRecord = doc.data()
        }
        const imageRecord = ImageRecord({
          fileName,
          originalUrl,
          fileType,
          publicUrl,
          matches,
          labels,
          bestMatch
        })
        userRecord.imageRecords[imageRecord.imageCode] = imageRecord
        userRecord.latest = imageRecord.imageCode
        const updatedDoc = database.collection('userMatches').doc(userCode)
        updatedDoc.set(userRecord).then(() => resolve(userRecord))
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// Given an imageData stream (UInt8Array) make a FormData request to the Similarity engine
function discoverSimilarImages(imageData) {
  return new Promise((resolve, reject) => {
    const form = new FormData()
    form.append('file', imageData, {
      // 'file' key required by destination
      filename: 'file.jpg', // Filename with extension required by destination
      contentType: 'image/jpeg',
      knownLength: imageData.length
    })
    form.submit(`${SIMILARITY_API}/api`, function(err, res) {
      if (err) {
        return reject(err)
      }
      res.resume()
      let body = ''
      res.on('readable', function() {
        body += res.read()
      })
      res.on('end', function() {
        resolve(body)
      })
    })
  })
}

function saveImageToBucket(userData) {
  const { fileName, fileType, file } = userData
  const bucket = storage.bucket(UPLOAD_BUCKET)
  const blob = bucket.file(fileName)
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`

  return new Promise((resolve, reject) => {
    const stream = blob.createWriteStream({
      metadata: {
        contentType: fileType // req.file.mimetype
      },
      resumable: false
    })
    stream.on('error', (err) => {
      reject(err)
    })
    stream.on('finish', () => {
      // If using GCP ACL, make the image public to the web
      /* blob.makePublic().then(() => {
        res.status(200).send(`Success!\n Image uploaded to ${publicUrl}`)
      }) */
      resolve(publicUrl)
    })
    stream.end(file)
  })
}

function send(req, res, next) {
  utilities
    .resizeImage(req.file)
    .then((resizedFile) => {
      const fileType = mime.lookup(req.file.originalname)
      const mimeName = mime.extensions[fileType][1]
      let fileName = uuidv4()
      const originalFilename = fileName + '_original.' + mimeName
      fileName = fileName + '.' + mimeName
      const userCode = req.query['user-code'] || uuidv4()

      function filterForFaces(faces, matches) {
        return matches.find(
          (m) => dimuSkmu[m.filename].number_of_detected_faces <= faces
        )
      }

      if (!['image/jpg', 'image/jpeg', 'image/png'].includes(fileType)) {
        return res.status(415).send({ error: new Error('Unsupported Media') })
      }

      saveImageToBucket({
        fileName: originalFilename,
        fileType,
        file: req.file.buffer
      })
        .then((originalUrl) => {
          saveImageToBucket({ fileName, fileType, file: resizedFile })
            .then((publicUrl) => {
              discoverSimilarImages(resizedFile)
                .then((response) => {
                  const r = JSON.parse(response)
                  const matches = r.length > 0 ? r[0] : []
                  const labels = r.length > 1 ? r[1] : []
                  // First item is the user image, remove it
                  matches.shift()
                  // adjust to face count greater than one if necessary
                  const faces = labels.number_of_faces
                    ? labels.number_of_faces[0]
                    : 0
                  const bestMatch = filterForFaces(faces, matches)
                  updateUserInDB({
                    userCode,
                    fileName,
                    originalUrl,
                    fileType,
                    publicUrl,
                    matches,
                    labels,
                    bestMatch
                  }).then((userRecord) =>
                    res.status(200).send({
                      userRecord,
                      userCode
                    })
                  )
                })
                .catch((err) => {
                  console.log('Error setting document in DB', err)
                  return res.status(500).send({ error: err })
                })
            })
            .catch((err) => next(err))
        })
        .catch((err) => next(err))
    })
    .catch((err) => {
      console.log(err)
      next()
    })
}

module.exports = {
  send
}

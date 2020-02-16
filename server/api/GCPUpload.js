const mime = require('mime-types')
const uuidv4 = require('uuid/v4')
const FormData = require('form-data')
const { Storage } = require('@google-cloud/storage')
const Firestore = require('@google-cloud/firestore')
const utilities = require('../utilities')
const { UserRecord, ImageRecord } = require('./Models')
const UPLOAD_BUCKET = process.env.GCP_UPLOAD_BUCKET
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID
const GCP_KEY_FILENAME = process.env.GCP_KEY_FILENAME
const SIMILARITY_API = process.env.SIMILARITY_API

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
          fileType,
          publicUrl,
          matches,
          labels,
          bestMatch
        })
        userRecord.imageRecords.push(imageRecord)
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
  utilities.resizeImage(req.file).then((resizedFile) => {
    const fileType = 'image/jpeg' // mime.lookup(req.file.originalname)
    const fileName = `${uuidv4()}.${mime.extensions[fileType][1]}`
    const userCode = req.query['user-code'] || uuidv4()

    saveImageToBucket({ fileName, fileType, file: resizedFile })
      .then((publicUrl) => {
        discoverSimilarImages(resizedFile)
          .then((response) => {
            const r = JSON.parse(response)
            const matches = r.length > 0 ? r[0] : []
            const labels = r.length > 1 ? r[1] : []
            const bestMatch = matches.length > 1 ? matches[1] : undefined
            updateUserInDB({
              userCode,
              fileName,
              fileType,
              publicUrl,
              matches,
              labels,
              bestMatch
            }).then((userRecord) => res.send({ userRecord, userCode }))
          })
          .catch((err) => {
            console.log('Error setting document in DB', err)
            return res.send(500, { error: err })
          })
      })
      .catch((err) => next(err))
  })
}

module.exports = {
  send
}

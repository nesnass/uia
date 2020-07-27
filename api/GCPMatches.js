import fs from 'fs'
import Firestore from '@google-cloud/firestore'

const dirPath = process.cwd() + '/api'
const CURATED_BUCKET = process.env.GCP_CURATED_BUCKET
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID
const GCP_KEY_FILENAME = process.env.GCP_KEY_FILENAME

const dimuSkmu = JSON.parse(
  fs.readFileSync(`${dirPath}/data/dimu_skmu.json`, 'utf8')
)
/*
const dimuRegular = JSON.parse(
  fs.readFileSync(`${dirPath}/data/museumItems.json`, 'utf8')
) */

const config =
  process.env.NODE_ENV !== 'production'
    ? {
        projectId: GCP_PROJECT_ID,
        keyFilename: GCP_KEY_FILENAME
      }
    : {}

const database = new Firestore(config)

const getImage = function(req, res) {
  const userCode = req.searchParams.get('user-code')
  const imageCode = req.searchParams.get('image-code')
  if (!userCode) {
    return res.send(400)
  }
  const userRef = database.collection('userMatches').doc(userCode)
  userRef.get().then((doc) => {
    if (!doc.exists) {
      return res.send({ userImage: null, museumImage: null })
    }
    const userRecord = doc.data()
    const code = imageCode || userRecord.latest
    const userImage = userRecord.imageRecords[code]
    const matchName = userImage.bestMatch.filename
    const museumImage = {}
    if (matchName.substring(0, 4) === 'SKMU') {
      museumImage.url = `https://storage.googleapis.com/${CURATED_BUCKET}/${matchName}.jpg`
    } else {
      museumImage.url = `https://dms01.dimu.org/image/${matchName}`
    }
    museumImage.metadata = dimuSkmu[matchName]

    // Filter brackets from title
    const titleRegex = /\[.*\]+/
    const title = museumImage.metadata['artifact.ingress.title']
    if (title) {
      museumImage.metadata['artifact.ingress.title'] = title.replace(
        titleRegex,
        ''
      )
    }
    return res.send({ userImage, museumImage })
  })
}

const share = function(req, res) {
  const userCode = req.searchParams.get('user-code')
  const imageCode = req.searchParams.get('image-code')
  if (!userCode || !imageCode) {
    return res.send(400)
  }
  const userRef = database.collection('userMatches').doc(userCode)
  userRef.get().then((doc) => {
    if (!doc.exists) {
      return res.send({ userImage: null, museumImage: null })
    }
    const userRecord = doc.data()
    const userImage = userRecord.imageRecords[imageCode]
    if (userImage) {
      userImage.shared = true
    }
    userRef.set(userRecord)
    return res.status(200).end()
  })
}

const allSharedItems = function(req, res) {
  database
    .collection('userMatches')
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return res.status(200).send([])
      }
      const data = []
      snapshot.forEach((i) => data.push(i.data()))
      // Remove imageRecord items not marked as shared
      data.forEach((userRecord) => {
        const keys = Object.keys(userRecord.imageRecords)
        userRecord.imageRecords = keys
          .filter((k) => userRecord.imageRecords[k].shared)
          .map((k) => userRecord.imageRecords[k])
      })
      res.status(200).send(data)
    })
    .catch((err) => {
      console.log('Error getting documents', err)
    })
}

export default {
  getImage,
  share,
  allSharedItems
}

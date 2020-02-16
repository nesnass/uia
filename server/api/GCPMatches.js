const fs = require('fs')
const dirPath = process.cwd() + '/server'
const Firestore = require('@google-cloud/firestore')
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

const getLatestImage = function(req, res) {
  const userCode = req.searchParams.get('user-code')
  if (!userCode) {
    return res.send(400)
  }
  const userRef = database.collection('userMatches').doc(userCode)
  userRef.get().then((doc) => {
    if (!doc.exists) {
      return res.send({ userImage: null, museumImage: null })
    }
    const userRecord = doc.data()
    const userImage =
      userRecord.imageRecords[userRecord.imageRecords.length - 1]
    const matchName = userImage.bestMatch.filename
    const museumImage = {}
    if (matchName.substring(0, 5) === 'SKMU') {
      museumImage.url = `https://storage.googleapis.com/${CURATED_BUCKET}/${matchName}.jpg`
    } else {
      museumImage.url = `https://dms01.dimu.org/image/${matchName}`
    }
    museumImage.metadata = dimuSkmu[matchName]
    return res.send({ userImage, museumImage })
  })
}

module.exports = {
  getLatestImage
}

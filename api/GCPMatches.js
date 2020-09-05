import fs from 'fs'
import request from 'request'
import sizeOf from 'image-size'
import Firestore from '@google-cloud/firestore'
import PDFDocument from 'pdfkit'
import sharp from 'sharp'

const imageRequest = request.defaults({ encoding: null })
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
          // .map((k) => userRecord.imageRecords[k])
          .map((k) => {
            const r = userRecord.imageRecords[k]
            r.created = r.created.toMillis()
            return r
          })
      })
      res.status(200).send(data)
    })
    .catch((err) => {
      console.log('Error getting documents', err)
    })
}

const pdf = (req, res) => {
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
    imageRequest(museumImage.url, function(err, response, museumImageBuffer) {
      if (err) {
        console.log('Error retrieving museum image', err)
      }
      imageRequest(userImage.publicUrl, function(
        err,
        response,
        userImageBuffer
      ) {
        if (err) {
          console.log('Error retrieving museum image', err)
        }
        const museumImageDims = sizeOf(museumImageBuffer)
        const userImageDims = sizeOf(userImageBuffer)
        /*         const mPortrait = museumImageDims.width < museumImageDims.height
        const uPortrait = userImageDims.width < userImageDims.height */

        const pdfDoc = new PDFDocument({
          layout: 'landscape',
          size: 'A4',
          margin: 20
        })
        // Stripping special characters
        const filename = 'combined.pdf'
        // Setting response to 'attachment' (download).
        // If you use 'inline' here it will automatically open the PDF
        res.setHeader(
          'Content-disposition',
          'attachment; filename="' + filename + '"'
        )
        res.setHeader('Content-type', 'application/pdf')

        const title = museumImage.metadata['artifact.ingress.title']
        const producer = museumImage.metadata['artifact.ingress.producer']
        const toYear =
          museumImage.metadata['artifact.ingress.production.toYear']

        // Round corners - museum image
        const rect = Buffer.from(
          `<svg><rect x="0" y="0" width="${museumImageDims.width}" height="${museumImageDims.height}" rx="10" ry="10"/></svg>`
        )
        sharp(rect)
          .composite([{ input: museumImageBuffer, blend: 'in' }])
          .toBuffer((err, museumData, info) => {
            if (err) console.log(err)
            // Round corners - user image
            const rect = Buffer.from(
              `<svg><rect x="0" y="0" width="${userImageDims.width}" height="${userImageDims.height}" rx="10" ry="10"/></svg>`
            )
            sharp(rect)
              .composite([{ input: userImageBuffer, blend: 'in' }])
              .toBuffer((err, userData, info) => {
                if (err) console.log(err)

                // Create the PDF
                pdfDoc
                  .fontSize(48)
                  .font('Helvetica-Bold')
                  .text('meg + kunst')
                  .fontSize(18)
                  .font('Helvetica')
                  .text(
                    `Når kunst treffer, tror vi det er fordi kunsten uttrykker noe om oss, eller omgivelsene våre,\nsom ikke kunne blitt kommunisert på noe annen måte.`
                  )
                  .moveDown(1)

                pdfDoc.image(userData, 20, 150, { fit: [300, 400] })
                pdfDoc.image(museumData, 330, 150, { fit: [300, 400] })

                pdfDoc
                  .fontSize(14)
                  .font('Helvetica-BoldOblique')
                  .text(`${title} by ${producer} ${toYear}`, 330, 555)

                pdfDoc.pipe(res)

                userImage.pdf = true
                userRef.set(userRecord)
                pdfDoc.end()
              })
          })
      })
    })
  })
}

export default {
  getImage,
  share,
  allSharedItems,
  pdf
}

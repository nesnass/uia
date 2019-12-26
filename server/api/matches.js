const AWS = require('aws-sdk')
const UserImage = require('../database/UserImage')
const utilities = require('../utilities')

AWS.config.update({ region: 'eu-north-1' })
const S3_BUCKET = process.env.S3_BUCKET

function requestMuseumImages(q, fq) {
  const options = {
    host: 'api.dimu.org',
    path: `/api/solr/select?q=${q}&fq=${fq}&wt=json&api.key=demo`,
    method: 'GET'
  }
  return utilities.httpRequest(options)
}

const getLatestImage = function(req, res) {
  const s3 = new AWS.S3()
  const userCode = req.searchParams.get('user-code')
  if (!userCode) {
    return res.send(400)
  }
  const query = { userCode }
  UserImage.findOne(query, function(err, userImage) {
    if (err) {
      console.log(err)
      return res.send(500, { error: err })
    }
    if (!userImage || userImage.images.length === 0) {
      return res.send(400)
    }
    const { fileName } = userImage.images[userImage.images.length - 1]
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName
    }
    // S3 SDK does not support promise
    s3.getSignedUrlPromise('getObject', s3Params).then(
      async (data) => {
        const results = await requestMuseumImages('*', 'identifier.owner:NMK*')
        const docs = results.response.docs
        let selectedImage = ''

        if (docs.length > 0) {
          const randomIndex = utilities.getRandomInt(docs.length - 1)
          const identifier =
            docs[randomIndex]['artifact.defaultMediaIdentifier']
          selectedImage = 'https://dms01.dimu.org/image/' + identifier
        }
        const returnData = {
          signedRequest: data,
          museumImage: selectedImage
        }
        res.write(JSON.stringify(returnData))
        res.end()
      },
      (error) => {
        if (error) {
          console.log(error)
          return res.end()
        }
      }
    )
  })
}

module.exports = {
  getLatestImage
}

const AWS = require('aws-sdk')
const UserImage = require('../database/UserImage')

AWS.config.update({ region: 'eu-north-1' })
const S3_BUCKET = process.env.S3_BUCKET

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
    s3.getSignedUrlPromise('getObject', s3Params).then(
      (data) => {
        const returnData = {
          signedRequest: data
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

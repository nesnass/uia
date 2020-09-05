import AWS from 'aws-sdk'
import uuidv4 from 'uuid/v4'
import UserImage from '../database/UserImage'

AWS.config.update({ region: 'eu-north-1' })
const S3_BUCKET = process.env.S3_BUCKET

const signUpload = function(req, res) {
  const s3 = new AWS.S3()
  // const fileName = req.searchParams.get('file-name')
  const fileType = req.searchParams.get('file-type')
  const userCode = req.searchParams.get('user-code') || uuidv4()
  const fileName = uuidv4()
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    ContentType: fileType
  }

  s3.getSignedUrlPromise('putObject', s3Params).then(
    (data) => {
      const returnData = {
        signedRequest: data,
        // url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
        userCode
      }
      const query = { userCode }
      UserImage.findOne(query, function(err, userImage) {
        if (err) {
          console.log(err)
          return res.send(500, { error: err })
        }
        if (!userImage) {
          userImage = new UserImage()
          userImage.userCode = userCode
        }
        userImage.images.push({ fileName, fileType })
        userImage.save()
        res.write(JSON.stringify(returnData))
        res.end()
      })
    },
    (error) => {
      if (error) {
        console.log(error)
        return res.end()
      }
    }
  )
}

export default {
  signUpload
}

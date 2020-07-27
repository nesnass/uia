const crypto = require('crypto')
const Firestore = require('@google-cloud/firestore')
const express = require('express')
const uuidv4 = require('uuid/v4')
// const { User } = require('./Models')
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID
const GCP_KEY_FILENAME = process.env.GCP_KEY_FILENAME

const router = express.Router()
const activeLogins = {}

function createReference(data) {
  return crypto
    .createHash('sha1')
    .update(data)
    .digest('base64')
}

function dateDiff(dateOld, dateNew) {
  return dateNew.valueOf() - dateOld.valueOf()
}

function checkAuthentication(req, res, next) {
  const date = activeLogins[req.session.id]
  if (date && dateDiff(date, new Date()) < process.env.SESSION_VALIDITY_MS) {
    return next()
  } else if (date) {
    delete activeLogins[req.session.id]
  }
  return res.status(401).send()
}

const config =
  process.env.NODE_ENV !== 'production'
    ? {
        projectId: GCP_PROJECT_ID,
        keyFilename: GCP_KEY_FILENAME
      }
    : {}

const database = new Firestore(config)

router.get('/logout', checkAuthentication, (req, res) => {
  if (req.session.id) {
    delete activeLogins[req.session.id]
  }
  res.status(200).redirect('/')
})

router.post('/login', (req, res, next) => {
  const { username, password } = req.body.data
  if (!username || !password) {
    return res.tatus(401).end
  }
  if (req.session.id) {
    delete activeLogins[req.session.id]
  }
  const passwordHash = createReference(password)
  const query = database
    .collection('users')
    .where('username', '==', username)
    .where('passwordHash', '==', passwordHash)
  query
    .limit(1)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return res.status(401).end()
      } else {
        // const doc = snapshot.docs[0].data()
        const myId = uuidv4()
        activeLogins[myId] = new Date()
        req.session.id = myId
        res.status(200).end()
      }
    })
    .catch((err) => {
      return res.status(401).send(new Error(err))
    })
})

/* module.exports = {
  checkAuthentication,
  login,
  logout
} */
export default {
  path: '/auth',
  handler: router
}

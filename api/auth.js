import crypto from 'crypto'
import Firestore from '@google-cloud/firestore'
import uuidv4 from 'uuid/v4'

// const { User } = require('./Models')
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID
const GCP_KEY_FILENAME = process.env.GCP_KEY_FILENAME

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
  const date = activeLogins[req.session.ref]
  if (date && dateDiff(date, new Date()) < process.env.SESSION_VALIDITY_MS) {
    return next()
  } else if (date) {
    delete activeLogins[req.session.ref]
    req.session.ref = ''
  }
  res.status(200).send({ message: 'not authorised' })
}

const config =
  process.env.NODE_ENV !== 'production'
    ? {
        projectId: GCP_PROJECT_ID,
        keyFilename: GCP_KEY_FILENAME
      }
    : {}

const database = new Firestore(config)

const logout = (req, res) => {
  if (req.session.ref && activeLogins[req.session.ref]) {
    delete activeLogins[req.session.ref]
    req.session.ref = ''
  }
  res.status(200).end()
}

const login = (req, res) => {
  const username = req.searchParams.get('username')
  const password = req.searchParams.get('password')
  if (!username || !password) {
    return res.status(200).end()
  }
  if (req.session && req.session.ref && activeLogins[req.session.ref]) {
    delete activeLogins[req.session.ref]
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
        return res.status(200).send({ route: '/' })
      } else {
        // const doc = snapshot.docs[0].data()
        const myId = uuidv4()
        activeLogins[myId] = new Date()
        req.session.ref = myId
        return res.status(200).send({ user: true })
      }
    })
    .catch((err) => {
      console.log('Error' + err)
      return res.status(401).send(new Error(err))
    })
}

const test = (req, res) => {
  return res.status(200).send({ test: 'works' })
}

export default { test, login, logout, checkAuthentication }

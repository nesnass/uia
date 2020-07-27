/*
 Designed and developed by Richard Nesnass
*/
const uuidv4 = require('uuid/v4')

// Data Models

function ImageRecord(spec) {
  return {
    imageCode: uuidv4(),
    fileName: spec.fileName,
    originalUrl: spec.originalUrl,
    fileType: spec.fileType,
    publicUrl: spec.publicUrl,
    matches: spec.matches,
    labels: spec.labels,
    bestMatch: spec.bestMatch,
    shared: false,
    created: new Date()
  }
}

function UserRecord(spec) {
  return {
    userCode: spec.userCode || '',
    imageRecords: spec.images || {},
    latest: undefined
  }
}

function User(spec) {
  return {
    userCode: spec.userCode || '',
    imageRecords: spec.images || {},
    latest: undefined
  }
}

module.exports = {
  UserRecord,
  ImageRecord,
  User
}

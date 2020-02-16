/*
 Designed and developed by Richard Nesnass
*/

// Data Models

function ImageRecord(spec) {
  return {
    fileName: spec.fileName,
    fileType: spec.fileType,
    publicUrl: spec.publicUrl,
    matches: spec.matches,
    labels: spec.labels,
    bestMatch: spec.bestMatch
  }
}

function UserRecord(spec) {
  return {
    userCode: spec.userCode || '',
    imageRecords: spec.images || []
  }
}

module.exports = {
  UserRecord,
  ImageRecord
}

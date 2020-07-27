/*
 Designed and developed by Richard Nesnass
*/
import uuidv4 from 'uuid/v4'

// Data Models

export function ImageRecord(spec) {
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

export function UserRecord(spec) {
  return {
    userCode: spec.userCode || '',
    imageRecords: spec.images || {},
    latest: undefined
  }
}

export function User(spec) {
  return {
    userCode: spec.userCode || '',
    imageRecords: spec.images || {},
    latest: undefined
  }
}

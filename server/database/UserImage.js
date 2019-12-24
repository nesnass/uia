/*
 Designed and developed by Richard Nesnass
 */

const { mongoose } = require('./mongodb.js')

const userImageSchema = new mongoose.Schema({
  userCode: { type: String },
  images: { type: Array, default: [] }
})

// Duplicate the ID field.
// eslint-disable-next-line
userImageSchema.virtual("id").get(function() {
  // eslint-disable-next-line
  return this._id.toString();
})

// Ensure virtual fields are serialised.
userImageSchema.set('toJSON', {
  getters: true,
  virtuals: true
})
userImageSchema.set('toObject', {
  getters: true,
  virtuals: true
})

module.exports = mongoose.model('UserImage', userImageSchema)

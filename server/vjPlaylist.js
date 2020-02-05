const items = require('./items.json')
const playlist = []

// Push a newly selected item, if found, to the bottom of the playlist
function addItem(itemID, userID) {
  const itemToAdd = items.find((i) => i.id === itemID)
  itemToAdd.userID = userID
  if (itemToAdd) {
    playlist.push(itemToAdd)
  }
}

// Moves playlist to the next item
function nextItem() {
  playlist.shift()
}

// Returns the currently playing item
function currentItem() {
  return playlist.length > 0 ? playlist[0] : undefined
}

function getPlaylist() {
  return playlist
}

function getAllItems() {
  return items
}

function start(io) {
  io.on('connection', function(socket) {
    console.log('a user loaded Kuratere')
    socket.on('disconnect', function() {
      console.log('user disconnected from Kuratere')
    })
    socket.on('userStart', function(data) {
      console.log(`userCode: ${data.userCode} Message: ${data.message}`)
    })
  })
}

module.exports = {
  addItem,
  nextItem,
  currentItem,
  getPlaylist,
  getAllItems,
  start
}

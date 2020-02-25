const PLAYLIST_INTERVAL = process.env.PLAYLIST_INTERVAL
let playlist = []

function getTime() {
  const l = playlist.length
  const d = new Date()
  d.setSeconds(d.getSeconds() + 30 * l)
  return d
}

function checkList() {
  const nowPlusPlaytime = new Date()
  nowPlusPlaytime.setSeconds(nowPlusPlaytime.getSeconds() + PLAYLIST_INTERVAL)
  playlist = playlist.filter((i) => i.start < nowPlusPlaytime)
  if (playlist.length > 0) {
    setTimeout(checkList, 2000)
  }
}

// Push a newly selected item, if found, to the bottom of the playlist
function addItems(itemIDs, exID, userID) {
  const items = itemIDs.split(',')
  items.forEach((i) => {
    const item = {
      itemID: i,
      exID,
      userID,
      start: getTime()
    }
    playlist.push(item)
  })
  setTimeout(checkList, 2000)
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
  addItems,
  nextItem,
  currentItem,
  getPlaylist,
  start
}

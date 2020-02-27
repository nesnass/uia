const PLAYLIST_INTERVAL = process.env.PLAYLIST_INTERVAL
let playlist = []
let ioRef

function getFinishTime() {
  const l = playlist.length + 1
  const d = new Date()
  d.setSeconds(d.getSeconds() + parseInt(PLAYLIST_INTERVAL) * l)
  return d
}

// Remove expired items
function checkList() {
  /* const nowPlusPlaytime = new Date()
   nowPlusPlaytime.setSeconds(
    nowPlusPlaytime.getSeconds() + parseInt(PLAYLIST_INTERVAL)
  ) */
  const now = new Date()
  playlist = playlist.filter((i) => i.finish > now)
  if (playlist.length > 0) {
    setTimeout(checkList, 1000)
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
      finish: getFinishTime()
    }
    playlist.push(item)
  })
  ioRef.sockets.emit('newPlaylistItem')
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
  ioRef = io
  ioRef.on('connection', function(socket) {
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

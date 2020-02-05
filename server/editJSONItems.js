const fs = require('fs')
const dirPath = process.cwd() + '/server/'

let data = {}

function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${dirPath}${filename}`, 'utf8', function readFileCallback(
      err,
      filedata
    ) {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        const data = JSON.parse(filedata)
        resolve(data)
      }
    })
  })
}

function writeFile(filename, filedata) {
  return new Promise((resolve, reject) => {
    const json = JSON.stringify(filedata)
    fs.writeFile(
      `${dirPath}${filename}`,
      json,
      'utf8',
      function writeFileCallback(err) {
        if (err) {
          reject(err)
        }
      }
    )
  })
}

function processData() {
  return new Promise((resolve, reject) => {
    let id = 0
    data.forEach((item) => {
      item.id = id
      id++
    })
    resolve()
  })
}

readFile('items.json')
  .then((jsondata) => {
    data = jsondata
    processData().then(() => {
      writeFile('items.json', data).catch((err) => console.error(err))
    })
  })
  .catch((err) => console.error(err))

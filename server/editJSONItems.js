const fs = require('fs')
const dirPath = process.cwd() + '/server/'

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

function processData(jsondata) {
  return new Promise((resolve, reject) => {
    const formattedData = {}
    jsondata.forEach((item) => {
      const key = item['artifact.defaultMediaIdentifier']
      formattedData[key] = item.Other_details[0]
    })
    resolve(formattedData)
  })
}

readFile('dimu_final2_key_imageID.json')
  .then((jsondata) => {
    processData(jsondata).then((formattedData) => {
      writeFile('file.json', formattedData).catch((err) => console.error(err))
    })
  })
  .catch((err) => console.error(err))

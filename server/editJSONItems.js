const fs = require('fs')
const dirPath = process.cwd() + '/'

function readFile(filename, type) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${dirPath}${filename}`, 'utf8', function readFileCallback(
      err,
      filedata
    ) {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        let data
        if (type === 'json') {
          data = JSON.parse(filedata)
        } else {
          data = filedata
        }
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

function processData(data, type) {
  return new Promise((resolve, reject) => {
    let formattedData
    if (type === 'json') {
      formattedData = {}
      data.forEach((item) => {
        const key = item['artifact.defaultMediaIdentifier']
        formattedData[key] = item.Other_details[0]
      })
    } else if (type === 'csv') {
      formattedData = []
      let titles = []
      const lines = data.split('\n')
      lines.forEach((l, index) => {
        let columns = []
        if (index === 0) {
          titles = l.split(';')
        } else {
          columns = l.split(';')
        }
        const newItem = {}
        columns.forEach((c, i) => {
          newItem[titles[i]] = c
        })
        formattedData.push(newItem)
      })
      console.dir(formattedData)
    }
    resolve(formattedData)
  })
}

function processFile(filename, type) {
  readFile(filename, type)
    .then((data) => {
      processData(data, type).then((formattedData) => {
        writeFile('exhibition2.json', formattedData).catch((err) =>
          console.error(err)
        )
      })
    })
    .catch((err) => console.error(err))
}

processFile('values2.csv', 'csv')

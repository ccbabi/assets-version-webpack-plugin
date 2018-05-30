const path = require('path')
const querystring = require('querystring')

class AssetsVersionWebpackPlugin {
  constructor (option) {
    this.option = {
      filename: 'version.json',
      includeDate: true,
      includeHash: true,
      callback: null,
      version: 'v',
      ...option
    }

    this.count = 0
  }

  apply (compiler) {
    const option = this.option

    compiler.plugin('emit', (compilation, callback) => {
      const assets = Object.keys(compilation.assets)
      const version = {}
      let json, file

      if (option.includeDate) {
        version.date = Date.now()
      }

      if (option.includeHash) {
        version.hash = compilation.fullHash
      }

      json = this.toJson(assets)
      version.version = json

      if (option.callback && typeof callback === 'function') {
        option.callback(version)
      } else {
        file = JSON.stringify(version, null, 2) + '\n'
        compilation.assets[option.filename] = {
          source: () => file,
          size: () => file.length
        }
        this.check(json)
      }

      callback()
    })
  }

  toJson (assets) {
    let queryIndex, sliceEndIndex, filename, query

    return assets.reduce((previousValue, currentValue) => {
      queryIndex = currentValue.indexOf('?')
      sliceEndIndex = ~queryIndex ? queryIndex : currentValue.length
      filename = path.basename(currentValue.slice(0, sliceEndIndex))

      if (!filename.endsWith('.html')) {
        query = querystring.parse(currentValue.slice(sliceEndIndex + 1))
        previousValue[filename] = query
      }

      return previousValue
    }, {})
  }

  check (json) {
    const book = {}
    let version
    return Object.values(json).some(value => {
      version = value[this.option.version]
      if (book[version]) {
        console.warn('\nThere are files with the same hash, and package optimization is recommended.')
        return true
      }
      book[version] = 1
    })
  }
}

module.exports = AssetsVersionWebpackPlugin

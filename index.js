const path = require('path')
const querystring = require('querystring')

class AssetsVersionWebpackPlugin {
  constructor (option) {
    this.option = {
      filename: 'version.json',
      includeDate: true,
      includeHash: true,
      callback: null,
      ...option
    }

    this.count = 0
  }

  apply (compiler) {
    const option = this.option

    compiler.plugin('emit', (compilation, callback) => {
      console.log(require('util').inspect(compilation, true, true, true))
      const assets = Object.keys(compilation.assets)
      const version = {}
      let file

      if (option.includeDate) {
        version.date = Date.now()
      }

      if (option.includeHash) {
        version.hash = compilation.fullHash
      }

      version.version = this.toJson(assets)

      if (option.callback && typeof callback === 'function') {
        setTimeout(() => option.callback(version), 0)
      } else {
        file = JSON.stringify(version, null, 2) + '\n'
        compilation.assets[option.filename] = {
          source: () => file,
          size: () => file.length
        }
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
}

module.exports = AssetsVersionWebpackPlugin

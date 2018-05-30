import test from 'ava'
import AssetsVersionWebpackPlugin from '.'

test('test option', t => {
  const instace = new AssetsVersionWebpackPlugin({ includeDate: false })

  t.is(instace.option.filename, 'version.json')
  t.is(instace.option.includeDate, false)
  t.is(instace.option.includeHash, true)
})

test('test hook', t => {
  t.plan(7)

  const filename = 'hash.json'
  const instace = new AssetsVersionWebpackPlugin({ filename })
  const fullHash = Math.random().toString(36).slice(2)
  const beginNow = Date.now()
  const assets = {
    'js/home.js?v=12': 0,
    'css/home.css?v=13': 0,
    'about.js?v=14': 0,
    'about.css?v=15': 0,
    'html/index.html': 0
  }

  const compiler = {
    plugin (event, handler) {
      t.is(event, 'emit')

      const compilation = { fullHash, assets }

      handler(compilation, () => {
        const hashAsset = compilation.assets[filename]

        t.truthy(hashAsset)
        t.true(hashAsset.size() > 0)

        t.notThrows(() => {
          const hashJson = JSON.parse(hashAsset.source())
          t.is(hashJson.hash, fullHash)
          t.true(beginNow <= hashJson.date && Date.now() >= hashJson.date)
          t.truthy(hashJson.version)
        })
      })
    }
  }

  instace.apply(compiler)
})

test('test check', t => {
  t.plan(5)

  const instace = new AssetsVersionWebpackPlugin()
  const assets = {
    'js/home.js?v=12': 0,
    'css/home.css?v=13': 0,
    'about.js?v=14': 0,
    'about.css?v=15': 0,
    'common.js': 0,
    'common.css?v=13': 0,
    'html/index.html': 0
  }

  const compiler = {
    plugin (event, handler) {
      const compilation = { assets }

      handler(compilation, () => {
        const hashAsset = compilation.assets['version.json']

        t.truthy(hashAsset)
        t.true(hashAsset.size() > 0)

        t.notThrows(() => {
          const hashJson = JSON.parse(hashAsset.source())
          t.truthy(hashJson.version)
          t.true(instace.check(hashJson.version))
        })
      })
    }
  }

  instace.apply(compiler)
})

test('test filter', t => {
  t.plan(4)

  const instace = new AssetsVersionWebpackPlugin()
  const assets = {
    'js/home.js?v=12': 0,
    'css/home.css?v=13': 0,
    'html/index.html': 0
  }

  const compiler = {
    plugin (event, handler) {
      const compilation = { assets }

      handler(compilation, () => {
        const hashAsset = compilation.assets['version.json']

        t.truthy(hashAsset)
        t.true(hashAsset.size() > 0)

        t.notThrows(() => {
          const hashJson = JSON.parse(hashAsset.source())
          t.is(Object.keys(hashJson.version).length, 2)
        })
      })
    }
  }

  instace.apply(compiler)
})

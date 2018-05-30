# assets-version-webpack-plugin
Generate the version number of the webpack resource into the JSON file

## Install
```sh
$ npm install --dev-save assets-version-webpack-plugin
```

## Usage
```javascript
import AssetsVersionWebpackPlugin from 'assets-version-webpack-plugin'

// webpack config
module.exports = {
  ...
  plugins: [ new AssetsVersionWebpackPlugin([<option>]) ]
}
```

**option:**
| optionName | Type | DefaultValue | Description |
| :--- | :--- | :--- | :--- |
| filename | String | 'version.json' | Generated file name |
| includeDate | Boolean | true | File generation time |
| includeHash | Boolean | true | Application fullBash value |
| callback | Function | null | Used to customize the output and pass in version information |
| version | String | 'v' | The key corresponding to the hash value of the file is used to check if the same file exists |

**notice:**
- Specify the callback option, which will no longer perform hash value checking
- The check does not abort the program, it just gives you an optimization tip

## Output Reference
```json
{
  "date": 1527645239415,
  "hash": "418c794ac6787d177c493d4044427a0f",
  "version": {
    "index.js": {
      "v": "dca493a"
    },
    "home.js": {
      "v": "c9fcf41"
    },
    "common.js": {
      "v": "e7ff292"
    },
    "home.css": {
      "v": "0aa377a"
    },
    "index.css": {
      "v": "6700e3e"
    }
  }
}
```

## License
MIT

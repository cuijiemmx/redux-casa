const wxApis = [
  'getStorage',
  'setStorage',
  'removeStorage',
  'clearStorage',
  'getStorageInfo'
]

function promisify() {
  let apis = Object.create(null)

  wxApis.forEach(name => {
    apis[name] = args => {
      return new Promise(function(resolve, reject) {
        wx[name]({
          ...args,

          success: function(res) {
            resolve(res)
          },
          fail: function(res) {
            reject(res)
          }
        })
      })
    }
  })

  return apis
}

export default promisify()

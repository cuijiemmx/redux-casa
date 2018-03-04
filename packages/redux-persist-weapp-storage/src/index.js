const wxApis = [
  'getStorage',
  'setStorage',
  'removeStorage',
  'clearStorage',
  'getStorageInfo'
]

let api = Object.create(null)

wxApis.forEach(name => {
  api[name] = args => new Promise(function(resolve, reject) {
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
})

export default {
  getItem(key) {
    return api.getStorage({ key }).then(res => {
      return res.data
    })
  },

  setItem(key, data) {
    return api.setStorage({ key, data })
  },

  removeItem(key) {
    return api.removeStorage({ key })
  },

  clear() {
    return api.clearStorage()
  },

  getAllKeys() {
    return api.getStorageInfo().then(res => {
      return res.keys
    })
  }
}

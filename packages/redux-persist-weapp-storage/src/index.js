import api from './api'

export default {

  /**
   * @param key
   * @param callback
   * @returns {*}
   */
  async getItem(key, callback) {
    try {
      let res = await api.getStorage({ key })
      if (callback) callback(null, res.data)
      return res.data
    } catch (error) {
      if (callback) callback(error)
      throw error
    }
  },

  /**
   * @param key
   * @param data
   * @param callback
   */
  async setItem(key, data, callback) {
    try {
      await api.setStorage({ key, data })
      if (callback) callback(null)
    } catch (error) {
      if (callback) callback(error)
      throw error
    }
  },

  /**
   * @param key
   * @param callback
   */
  async removeItem(key, callback) {
    try {
      await api.removeStorage({ key })
      if (callback) callback(null)
    } catch (error) {
      if (callback) callback(error)
      throw error
    }
  },

  /**
   * @param callback
   */
  async clear(callback) {
    await api.clearStorage()
    if (callback) callback(null)
  },

  /**
   * @param callback
   */
  async getAllKeys(callback) {
    try {
      let res = await api.getStorageInfo()
      if (callback) callback(null, res.keys)
    } catch (error) {
      if (callback) callback(error)
      throw error
    }
  }
}

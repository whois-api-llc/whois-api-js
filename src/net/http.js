'use strict'

const httpClient = require('urllib')

const { ApiAuthError, HttpApiError } = require('../exceptions/error')

const DEFAULT_TIMEOUT = 30000
const LIB_NAME = require('../../package.json').name
const LIB_VERSION = require('../../package.json').version

class ApiRequester {
  /**
   * @param {string} url
   * @param {number} [timeout=DEFAULT_TIMEOUT]
   * @throws {RangeError}
   * @throws {URIError}
   */
  constructor (url, timeout = DEFAULT_TIMEOUT) {
    this.timeout = timeout
    this.url = url

    /**
     * @type {string}
     * @private
     */
    this._userAgent = `${LIB_NAME}-js/${LIB_VERSION}`
  }

  /**
   * @returns {number}
   */
  get timeout () {
    return this._timeout
  }

  /**
   * @param {number} value
   * @throws {RangeError}
   */
  set timeout (value) {
    if (isNaN(value) || (value < 1000) || (value > 60000)) {
      throw new RangeError('Timeout should be from 1 to 60 s')
    }

    this._timeout = value
  }

  /**
   * @returns {string}
   */
  get url () {
    return this._url
  }

  /**
   * @param {string} value
   * @throws {URIError}
   */
  set url (value) {
    if ((typeof value !== 'string') ||
          (value.length < 9) ||
          !value.startsWith('https://')) {
      throw new URIError('Invalid URL specified')
    }

    this._url = value
  }

  /**
   * @param {Object} data
   * @return {Promise}
   */
  get (data) {
    const self = this

    return new Promise(function (resolve, reject) {
      const options = {
        method: 'GET',
        timeout: self.timeout,
        data: data,
        headers: {
          'User-Agent': self._userAgent,
          Connection: 'close'
        }
      }

      self._request(resolve, reject, self.url, options)
    })
  }

  /**
   * @param {*} resolve
   * @param {*} reject
   * @param {string} url
   * @param {Object} options
   * @private
   */
  _request (resolve, reject, url, options) {
    httpClient.request(
      url,
      options
    ).then(
      function (response) {
        const status = response.res.statusCode
        const data = response.data.toString()

        if ([401, 402, 403].indexOf(status) > -1) {
          reject(new ApiAuthError(response.data.toString()))
          return
        } else if (status >= 300) {
          reject(new HttpApiError(response.data.toString()))
          return
        }

        resolve(data)
      }
    ).catch(
      function (error) {
        return reject(error)
      }
    )
  }
}

module.exports = {
  ApiRequester
}

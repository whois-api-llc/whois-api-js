'use strict'

const { ParameterError } = require('./exceptions/error')
const { RequestParameters } = require('./models/request')
const { ApiRequester } = require('./net/http')

const DEFAULT_URL = 'https://www.whoisxmlapi.com/whoisserver/WhoisService'

const JSON_FORMAT = 'json'
const XML_FORMAT = 'xml'

class ApiClient {
  /**
   * @param {string} apiKey
   * @param {string} [url]
   * @param {number} [timeout]
   * @throws {ParameterError}
   * @throws {RangeError}
   * @throws {URIError}
   */
  constructor (apiKey, url, timeout) {
    this.apiKey = apiKey

    /**
     * @type {ApiRequester}
     * @private
     */
    this._apiRequester = new ApiRequester(url || DEFAULT_URL, timeout)
  }

  /**
   * @returns {string}
   */
  get apiKey () {
    return this._apiKey
  }

  /**
   * @param {string} value
   * @throws {ParameterError}
   */
  set apiKey (value) {
    const regexp = /^at_[a-z0-9]{29}$/i

    if (!regexp.test(value || '')) {
      throw new ParameterError('Invalid API key format')
    }

    this._apiKey = value
  }

  /**
   * @returns {number}
   */
  get timeout () {
    return this._apiRequester.timeout
  }

  /**
   * @param {number} value
   * @throws {RangeError}
   */
  set timeout (value) {
    this._apiRequester.timeout = value
  }

  /**
   * @returns {string}
   */
  get url () {
    return this._apiRequester.url
  }

  /**
   * @param {string} value
   * @throws {URIError}
   */
  set url (value) {
    this._apiRequester.url = value
  }

  /**
   * @param {string} domainName
   * @param {RequestParameters} params
   * @return {Promise<string>}
   */
  get (domainName, params) {
    return this.getRaw(domainName, JSON_FORMAT, params)
  }

  /**
   * @param {string} domainName
   * @param {string} format
   * @param {RequestParameters} params
   * @returns {Promise<string>}
   */
  getRaw (domainName, format, params) {
    const self = this

    domainName = domainName || ''
    format = format || ''
    params = params || new RequestParameters()

    const err = this._validateParams(domainName, format, params)

    return new Promise(function (resolve, reject) {
      if (err !== undefined) {
        reject(err)
      }

      const data = self._buildPayload(self.apiKey, domainName, format, params)

      self._request(resolve, reject, data, self._apiRequester)
    })
  }

  /**
   * @param {string} apiKey
   * @param {string} domainName
   * @param {string} format
   * @param {RequestParameters} params
   * @returns {Object}
   * @private
   */
  _buildPayload (apiKey, domainName, format, params) {
    const result = {}

    const tmp = {
      apiKey: apiKey,
      domainName: domainName,
      outputFormat: format.toLowerCase(),
      preferFresh: params.preferFresh,
      da: params.da,
      ip: params.ip,
      ipWhois: params.ipWhois,
      checkProxyData: params.checkProxyData,
      thinWhois: params.thinWhois,
      ignoreRawTexts: params.ignoreRawTexts
    }

    const keys = Object.keys(tmp)
    let key = ''
    for (let i = 0; i < keys.length; i++) {
      key = keys[i]
      if (tmp[key] !== undefined) {
        result[key] = tmp[key]
      }
    }

    return result
  }

  /**
   * @param {*} resolve
   * @param {*} reject
   * @param {Object} data
   * @param {ApiRequester} client
   * @private
   */
  _request (resolve, reject, data, client) {
    client.get(data)
      .then(
        function (data) {
          resolve(data)
        }
      ).catch(
        function (error) {
          return reject(error)
        }
      )
  }

  /**
   * @param {string} domainName
   * @param {string} format
   * @param {RequestParameters} params
   * @returns {ParameterError|undefined}
   * @private
   */
  _validateParams (domainName, format, params) {
    if ([JSON_FORMAT, XML_FORMAT].indexOf(format.toLowerCase()) <= -1) {
      return new ParameterError(
        `Output format must be ${JSON_FORMAT} or ${XML_FORMAT}`)
    }

    if ((typeof domainName !== 'string') || (domainName.length < 3)) {
      return new ParameterError('Invalid domain name')
    }

    if (!(params instanceof RequestParameters)) {
      return new ParameterError('Invalid request parameters')
    }

    return undefined
  }
}

module.exports = {
  JSON_FORMAT,
  XML_FORMAT,
  ApiClient
}

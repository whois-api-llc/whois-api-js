'use strict'

const {
  ApiAuthError, HttpApiError, ParameterError,
  ResponseError, UnparsableApiResponseError, WhoisApiError
} = require('./src/exceptions/error')

const { RequestParameters } = require('./src/models/request')

const {
  Audit, Contact, ErrorMessage,
  NameServers, Registrant, RegistryData,
  WhoisRecord
} = require('./src/models/response')

const { ApiClient, JSON_FORMAT, XML_FORMAT } = require('./src/client')

/**
 * @callback RequestCallback
 * @param {Error} err
 * @param {WhoisRecord|string} data
 * @returns {WhoisRecord|string|Error}
 */

/**
 * @param {*} resolve
 * @param {*} reject
 * @return {RequestCallback}
 */
function makeCallback (resolve, reject) {
  return function (err, data) {
    if (err) {
      return reject(err)
    }
    return resolve(data)
  }
}

/**
 * Client for Whois XML API services.
 */
class Client {
  /**
   * @param {string} apiKey
   * @param {string} [url] - Rewrite base URL to the API endpoint
   * @param {number} [timeout] - Request timeout in ms, default: 30,000
   * @throws {ParameterError}
   * @throws {RangeError}
   * @throws {URIError}
   */
  constructor (apiKey, url, timeout) {
    /**
     * @type {ApiClient}
     * @private
     */
    this._apiClient = new ApiClient(apiKey, url, timeout)
  }

  /**
   * @returns {string}
   */
  get apiKey () {
    return this._apiClient.apiKey
  }

  /**
   * @param {string} value
   * @throws {ParameterError}
   */
  set apiKey (value) {
    this._apiClient.apiKey = value
  }

  /**
   * @returns {number}
   */
  get timeout () {
    return this._apiClient.timeout
  }

  /**
   * @param {number} value
   * @throws {RangeError}
   */
  set timeout (value) {
    this._apiClient.timeout = value
  }

  /**
   * @returns {string}
   */
  get url () {
    return this._apiClient.url
  }

  /**
   * @param {string} value
   * @throws {URIError}
   */
  set url (value) {
    this._apiClient.url = value
  }

  /**
   * Retrieve parsed Whois record
   *
   * @param {string} domainName - domain name
   * @param {RequestParameters} [params] - optional parameters
   * @param {RequestCallback} [cb] - callback function(err, data)
   * @returns {WhoisRecord|Error|Promise<WhoisRecord>}
   */
  get (domainName, params, cb) {
    if (!cb || typeof cb !== 'function') {
      const self = this
      return new Promise(function (resolve, reject) {
        self._getCallback(domainName, params, makeCallback(resolve, reject))
      })
    }

    this._getCallback(domainName, params, cb)
  }

  /**
   * Get raw response
   *
   * @param {string} domainName - domain name
   * @param {string} format - output format (json/xml)
   * @param {RequestParameters} [params] - optional parameters
   * @param {RequestCallback} [cb] - Callback function(err, data)
   * @returns {string|Error|Promise<string>}
   */
  getRaw (domainName, format, params, cb) {
    if (!cb || typeof cb !== 'function') {
      const self = this
      return new Promise(function (resolve, reject) {
        self._getRawCallback(
          domainName,
          format,
          params,
          makeCallback(resolve, reject)
        )
      })
    }

    this._getRawCallback(domainName, format, params, cb)
  }

  /**
   *
   * @param {string} domainName
   * @param {RequestParameters} [params]
   * @param {RequestCallback} [cb]
   * @returns {WhoisRecord|Error}
   * @private
   */
  _getCallback (domainName, params, cb) {
    this._apiClient.get(domainName, params)
      .then(function (response) {
        try {
          const parsed = JSON.parse(response)
          if ('ErrorMessage' in parsed) {
            const error = new ErrorMessage(parsed.ErrorMessage)
            return cb(new ResponseError(response, error), null)
          } else if ('WhoisRecord' in parsed) {
            return cb(null, new WhoisRecord(parsed.WhoisRecord))
          } else {
            const error = new UnparsableApiResponseError(
              'Expected root element not found'
            )
            return cb(error, null)
          }
        } catch (e) {
          if (e instanceof SyntaxError) {
            const err =
              new UnparsableApiResponseError('Cannot parse API response', e)

            return cb(err, null)
          }
          return cb(e, null)
        }
      })
      .catch(function (err) {
        if (err instanceof ApiAuthError) {
          const error = JSON.parse(err.message).ErrorMessage
          const msg = new ErrorMessage(error)
          return cb(new ApiAuthError(err.message, msg), null)
        }
        return cb(err, null)
      })
  }

  /**
   *
   * @param {string} domainName
   * @param {string} format
   * @param {RequestParameters} [params]
   * @param {RequestCallback} [cb]
   * @returns {string|Error}
   * @private
   */
  _getRawCallback (domainName, format, params, cb) {
    this._apiClient.getRaw(domainName, format, params)
      .then(function (data) {
        try {
          return cb(null, data)
        } catch (e) {
          return cb(e, null)
        }
      })
      .catch(function (err) {
        return cb(err, null)
      })
  }
}

module.exports = {
  JSON_FORMAT,
  XML_FORMAT,
  ApiAuthError,
  Audit,
  Client,
  Contact,
  ErrorMessage,
  HttpApiError,
  NameServers,
  ParameterError,
  Registrant,
  RegistryData,
  RequestParameters,
  ResponseError,
  UnparsableApiResponseError,
  WhoisApiError,
  WhoisRecord
}

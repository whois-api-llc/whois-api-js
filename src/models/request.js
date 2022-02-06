'use strict'

const ParameterError = require('../exceptions/error').ParameterError

/**
 * Optional request parameters
 */
class RequestParameters {
  /**
   * 1 results in fetching proxy/WHOIS guard data, if it exists,
   * in the WhoisRecord → privateWhoisProxy schema element
   * @returns {number|undefined}
   */
  get checkProxyData () {
    return this._checkProxyData
  }

  /**
   * Acceptable values: 0, 1
   * @param {number} value
   * @throws {ParameterError}
   */
  set checkProxyData (value) {
    if (isNaN(value) || ([0, 1].indexOf(value) <= -1)) {
      throw new ParameterError('checkProxyData should be 0 or 1')
    }
    this._checkProxyData = value
  }

  /**
   * 1 results in quick check on domain availability,
   * 2 is slower but more accurate;
   * results are returned under WhoisRecord → domainAvailability
   * (AVAILABLE | UNAVAILABLE | UNDETERMINED)
   * @returns {number|undefined}
   */
  get da () {
    return this._da
  }

  /**
   * Acceptable values: 0, 1, 2
   * @param {number} value
   * @throws {ParameterError}
   */
  set da (value) {
    if (isNaN(value) || ([0, 1, 2].indexOf(value) <= -1)) {
      throw new ParameterError('da should be 0, 1 or 2')
    }
    this._da = value
  }

  /**
   * 1 results in stripping all raw text from the output
   * @returns {number|undefined}
   */
  get ignoreRawTexts () {
    return this._ignoreRawTexts
  }

  /**
   * Acceptable values: 0, 1
   * @param {number} value
   * @throws {ParameterError}
   */
  set ignoreRawTexts (value) {
    if (isNaN(value) || ([0, 1].indexOf(value) <= -1)) {
      throw new ParameterError('ignoreRawTexts should be 0 or 1')
    }
    this._ignoreRawTexts = value
  }

  /**
   * 1 results in returning IPs for the domain name
   * @returns {number|undefined}
   */
  get ip () {
    return this._ip
  }

  /**
   * Acceptable values: 0, 1
   * @param {number} value
   * @throws {ParameterError}
   */
  set ip (value) {
    if (isNaN(value) || ([0, 1].indexOf(value) <= -1)) {
      throw new ParameterError('ip should be 0 or 1')
    }
    this._ip = value
  }

  /**
   * 1 returns WHOIS record for the hosting IP,
   * if the record for the tld of the input domain is not supported
   * @returns {number|undefined}
   */
  get ipWhois () {
    return this._ipWhois
  }

  /**
   * Acceptable values: 0, 1
   * @param {number} value
   * @throws {ParameterError}
   */
  set ipWhois (value) {
    if (isNaN(value) || ([0, 1].indexOf(value) <= -1)) {
      throw new ParameterError('ipWhois should be 0 or 1')
    }
    this._ipWhois = value
  }

  /**
   * 1 results in getting the latest WHOIS record even if it's incomplete
   * @returns {number|undefined}
   */
  get preferFresh () {
    return this._preferFresh
  }

  /**
   * Acceptable values: 0, 1
   * @param {number} value
   * @throws {ParameterError}
   */
  set preferFresh (value) {
    if (isNaN(value) || ([0, 1].indexOf(value) <= -1)) {
      throw new ParameterError('preferFresh should be 0 or 1')
    }
    this._preferFresh = value
  }

  /**
   * 1 results in returning WHOIS data from registry only,
   * without fetching data from registrar;
   * returned registry data corresponds to the
   * WhoisRecord → registryData schema element
   * @returns {number|undefined}
   */
  get thinWhois () {
    return this._thinWhois
  }

  /**
   * Acceptable values: 0, 1
   * @param {number} value
   * @throws {ParameterError}
   */
  set thinWhois (value) {
    if (isNaN(value) || ([0, 1].indexOf(value) <= -1)) {
      throw new ParameterError('thinWhois should be 0 or 1')
    }
    this._thinWhois = value
  }

  /**
   * @param {Object} [data]
   * @throws {ParameterError}
   */
  constructor (data) {
    data = data || {}

    const params = [
      'checkProxyData', 'da', 'ip',
      'ignoreRawTexts', 'ipWhois', 'preferFresh',
      'thinWhois'
    ]

    let key = ''
    for (let i = 0; i < params.length; i++) {
      key = params[i]
      if (key in data) {
        this[key] = Number(data[key])
      }
    }
  }
}

module.exports = {
  RequestParameters
}

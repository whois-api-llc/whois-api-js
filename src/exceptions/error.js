'use strict'

class WhoisApiError extends Error {
  /**
   * @param {string} [message]
   */
  constructor (message) {
    super(message)

    /**
     * @type {string}
     */
    this.name = this.constructor.name
  }
}

class HttpApiError extends WhoisApiError {
}

class ParameterError extends WhoisApiError {
}

class ResponseError extends WhoisApiError {
  /**
   * @param {string} [message]
   * @param {Object} [parsedMessage]
   */
  constructor (message, parsedMessage) {
    super(message)

    /**
     * @type {Object|undefined}
     */
    this.parsedMessage = parsedMessage
  }
}

class ApiAuthError extends ResponseError {
}

class UnparsableApiResponseError extends WhoisApiError {
  /**
   * @param {string} [message]
   * @param {Error} [originalError]
   */
  constructor (message, originalError) {
    super(message)

    /**
     * @type {Error|undefined}
     */
    this.originalError = originalError
  }
}

module.exports = {
  ApiAuthError,
  HttpApiError,
  ParameterError,
  ResponseError,
  UnparsableApiResponseError,
  WhoisApiError
}

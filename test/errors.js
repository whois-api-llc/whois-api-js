'use strict'

const assert = require('assert')

const { ResponseError, UnparsableApiResponseError, WhoisApiError } =
  require('..')

describe('Errors', () => {
  describe('WhoisApiError', () => {
    it('should set props via constructor', () => {
      const actual = new WhoisApiError('foo')

      assert.strictEqual(actual.message, 'foo')
      assert.strictEqual(actual.name, 'WhoisApiError')
    })
  })

  describe('ResponseError', () => {
    it('should set props via constructor', () => {
      const parsed = { foo: 'bar' }
      const actual = new ResponseError('foo', parsed)

      assert.strictEqual(actual.message, 'foo')
      assert.strictEqual(actual.name, 'ResponseError')
      assert.strictEqual(actual.parsedMessage, parsed)
    })
  })

  describe('UnparsableApiResponseError', () => {
    it('should set props via constructor', () => {
      const error = new Error('foo')
      const actual = new UnparsableApiResponseError('bar', error)

      assert.strictEqual(actual.message, 'bar')
      assert.strictEqual(actual.name, 'UnparsableApiResponseError')
      assert.strictEqual(actual.originalError.message, 'foo')
      assert.strictEqual(actual.originalError.name, 'Error')
    })
  })
})

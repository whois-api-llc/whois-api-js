'use strict'

const assert = require('assert')
const nock = require('nock')

const {
  JSON_FORMAT, ApiAuthError, ResponseError, Client, HttpApiError,
  ParameterError, RequestParameters, UnparsableApiResponseError, WhoisRecord
} = require('..')

const API_KEY = 'at_00000000000000000000000000000'

const API_URI = '/whoisserver/WhoisService'

const BASE_PATH = 'https://www.whoisxmlapi.com'

const REQUEST_DATA = {
  apiKey: API_KEY,
  domainName: 'example.com',
  outputFormat: JSON_FORMAT
}

const RESPONSE_WHOIS = {
  WhoisRecord: {
    createdDate: '1992-01-01',
    domainName: 'example.com',
    parseCode: 9,
    audit: {
      createdDate: '2022-02-04 21:30:33 UTC',
      updatedDate: '2022-02-04 21:30:33 UTC'
    },
    registrarName: 'RESERVED-Internet Assigned Numbers Authority',
    registrarIANAID: '376',
    createdDateNormalized: '1992-01-01 00:00:00 UTC',
    dataError: 'RESERVED_DOMAIN_NAME',
    registryData: {
      createdDate: '1995-08-14T04:00:00Z',
      updatedDate: '2021-08-14T07:01:44Z',
      expiresDate: '2022-08-13T04:00:00Z',
      domainName: 'example.com',
      nameServers: {
        hostNames: [
          'A.IANA-SERVERS.NET',
          'B.IANA-SERVERS.NET'
        ],
        ips: []
      },
      status: 'clientDeleteProhibited clientTransferProhibited',
      parseCode: 251,
      audit: {
        createdDate: '2022-02-04 21:30:32 UTC',
        updatedDate: '2022-02-04 21:30:32 UTC'
      },
      registrarName: 'RESERVED-Internet Assigned Numbers Authority',
      registrarIANAID: '376',
      createdDateNormalized: '1995-08-14 04:00:00 UTC',
      updatedDateNormalized: '2021-08-14 07:01:44 UTC',
      expiresDateNormalized: '2022-08-13 04:00:00 UTC',
      dataError: 'RESERVED_DOMAIN_NAME',
      whoisServer: 'whois.iana.org'
    },
    domainNameExt: '.com',
    estimatedDomainAge: 9672
  }
}

const RESPONSE_ERROR = {
  ErrorMessage: {
    errorCode: '123',
    msg: 'error'
  }
}

describe('APIClient', () => {
  it('should set properties from constructor', () => {
    const client = new Client(API_KEY, BASE_PATH, 1000)
    assert.strictEqual(client.apiKey, API_KEY)
    assert.strictEqual(client.url, BASE_PATH)
    assert.strictEqual(client.timeout, 1000)
  })

  it('should throw error for http urls', () => {
    assert.throws(
      () => {
        new Client(API_KEY).url = 'http:/example.com'
      },
      URIError)
  })

  it('should throw error on empty output format', (done) => {
    const client = new Client(API_KEY)
    const params = new RequestParameters()

    nock(BASE_PATH)
      .get(/.*/)
      .reply(200, '')

    client.getRaw('example.com', '', params, (err, data) => {
      assert(err instanceof ParameterError)
      done()
    })
  })

  it('should throw error on unsupported output format', (done) => {
    const client = new Client(API_KEY)
    const params = new RequestParameters()

    client.getRaw('example.com', 'foo', params, (err, data) => {
      assert(err instanceof ParameterError)
      done()
    })
  })

  it('should throw error on no domain name', (done) => {
    const client = new Client(API_KEY)
    const params = new RequestParameters()

    client.get(undefined, params, (err, data) => {
      assert(err instanceof ParameterError)
      done()
    })
  })

  it('should throw error on empty domain name', (done) => {
    const client = new Client(API_KEY)
    const params = new RequestParameters()

    client.get('', params, (err, data) => {
      assert(err instanceof ParameterError)
      done()
    })
  })

  it('should throw error on no request params', (done) => {
    const client = new Client(API_KEY)
    const params = null

    client.get('', params, (err, data) => {
      assert(err instanceof ParameterError)
      done()
    })
  })

  it('should throw error on invalid request params type', (done) => {
    const client = new Client(API_KEY)
    const params = {}

    client.get('example.com', params, (err, data) => {
      assert(err instanceof ParameterError)
      done()
    })
  })

  it('should throw error for no api key', () => {
    assert.throws(
      () => {
        new Client(API_KEY).apiKey = undefined
      },
      ParameterError)
  })

  it('should throw error for invalid api key', () => {
    assert.throws(
      () => {
        new Client().apiKey = 'apiKey'
      },
      ParameterError)
  })

  it('should throw error for incorrect url', () => {
    assert.throws(
      () => {
        new Client(API_KEY).url = 123
      },
      URIError)
  })

  it('should throw error for incorrect timeout', () => {
    assert.throws(
      () => {
        new Client(API_KEY, BASE_PATH).timeout = 'time'
      },
      RangeError)
  })

  it('should throw error for out of range timeout', () => {
    assert.throws(
      () => {
        new Client(API_KEY, BASE_PATH).timeout = 1
      },
      RangeError)
  })

  it('should return parsed data for successful calls', (done) => {
    const reqData = JSON.parse(JSON.stringify(REQUEST_DATA))
    reqData.ignoreRawTexts = 1

    nock(BASE_PATH)
      .get(API_URI)
      .query(reqData)
      .reply(200, RESPONSE_WHOIS)

    const client = new Client(API_KEY)
    const result = new WhoisRecord(RESPONSE_WHOIS.WhoisRecord)
    const params = new RequestParameters({ ignoreRawTexts: 1 })

    client.get('example.com', params, (err, data) => {
      assert.ifError(err)
      assert.deepStrictEqual(data, result)
      done()
    })
  })

  it('should make callback', (done) => {
    const reqData = JSON.parse(JSON.stringify(REQUEST_DATA))
    reqData.ignoreRawTexts = 1

    nock(BASE_PATH)
      .get(API_URI)
      .query(reqData)
      .reply(200, RESPONSE_WHOIS)

    const client = new Client(API_KEY)
    const result = new WhoisRecord(RESPONSE_WHOIS.WhoisRecord)
    const params = new RequestParameters({ ignoreRawTexts: 1 })

    client.get('example.com', params)
      .then(function (data) {
        assert.deepStrictEqual(data, result)
        done()
      })
  })

  it('should pass errors to generated callback', (done) => {
    const reqData = JSON.parse(JSON.stringify(REQUEST_DATA))
    reqData.ignoreRawTexts = 1

    const client = new Client(API_KEY)

    client.get('')
      .catch(function (err) {
        assert(err instanceof ParameterError)
        done()
      })
  })

  it('should return response body for raw requests', (done) => {
    const reqData = JSON.parse(JSON.stringify(REQUEST_DATA))
    reqData.ignoreRawTexts = 1

    nock(BASE_PATH)
      .get(API_URI)
      .query(reqData)
      .reply(200, RESPONSE_WHOIS)

    const client = new Client(API_KEY)
    const result = JSON.stringify(RESPONSE_WHOIS)
    const params = new RequestParameters({ ignoreRawTexts: 1 })

    client.getRaw('example.com', JSON_FORMAT, params)
      .then(function (data) {
        assert.strictEqual(data, result)
        done()
      })
  })

  it('should throw exception on api error', (done) => {
    const error = JSON.stringify(RESPONSE_ERROR)

    nock(BASE_PATH)
      .get(API_URI)
      .query(REQUEST_DATA)
      .reply(400, error)

    const client = new Client(API_KEY)
    const params = new RequestParameters()

    client.get('example.com', params, (err, data) => {
      assert(err instanceof HttpApiError)
      assert.deepStrictEqual(err.message, error)
      done()
    })
  })

  it('should throw error on bad auth', (done) => {
    nock(BASE_PATH)
      .get(API_URI)
      .query(REQUEST_DATA)
      .reply(401, JSON.stringify(RESPONSE_ERROR))

    const client = new Client(API_KEY)
    const params = new RequestParameters()

    client.get('example.com', params, (err, data) => {
      assert(err instanceof ApiAuthError)
      assert.strictEqual(err.message, JSON.stringify(RESPONSE_ERROR))
      const actual = JSON.parse(JSON.stringify(err.parsedMessage))
      assert.deepStrictEqual(actual, RESPONSE_ERROR.ErrorMessage)
      done()
    })
  })

  it('should throw error on non-json response', (done) => {
    nock(BASE_PATH)
      .get(API_URI)
      .query(REQUEST_DATA)
      .reply(200, 'response')

    const client = new Client(API_KEY)
    const params = new RequestParameters()

    client.get('example.com', params, (err, data) => {
      assert(err instanceof UnparsableApiResponseError)
      done()
    })
  })

  it('should throw error on unknown response schema', (done) => {
    nock(BASE_PATH)
      .get(API_URI)
      .query(REQUEST_DATA)
      .reply(200, { foo: 'bar' })

    const client = new Client(API_KEY)
    const params = new RequestParameters()

    client.get('example.com', params, (err, data) => {
      assert(err instanceof UnparsableApiResponseError)
      done()
    })
  })

  it('should throw error on ErrorMessage in response', (done) => {
    nock(BASE_PATH)
      .get(API_URI)
      .query(REQUEST_DATA)
      .reply(200, RESPONSE_ERROR)

    const client = new Client(API_KEY)
    const params = new RequestParameters()

    client.get('example.com', params, (err, data) => {
      assert(err instanceof ResponseError)
      done()
    })
  })

  it('should throw exception on unreachable endpoint', (done) => {
    const client = new Client(API_KEY, 'https://test.example', 1000)
    const params = new RequestParameters()
    nock.disableNetConnect()

    client.get('example.com', params, (err, data) => {
      assert(err instanceof Error)
      done()
    })

    nock.cleanAll()
    nock.enableNetConnect()
  })
})

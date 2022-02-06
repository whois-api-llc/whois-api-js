'use strict'

process.env.TZ = 'UTC'

const assert = require('assert')

const {
  Audit, Contact, ErrorMessage, NameServers, ParameterError,
  Registrant, RegistryData, RequestParameters, WhoisRecord
} = require('..')

const DATA_CONTACT = {
  name: 'name-value',
  organization: 'organization-value',
  street1: 'street1-value',
  street2: 'street2-value',
  street3: 'street3-value',
  street4: 'street4-value',
  city: 'city-value',
  state: 'state-value',
  postalCode: '123',
  country: 'country-value',
  countryCode: 'countryCode-value',
  email: 'email-value',
  telephone: 'telephone-value',
  telephoneExt: 'telephoneExt-value',
  fax: 'fax-value',
  faxExt: 'faxExt-value',
  rawText: 'rawText-value',
  unparsable: 'unparsable-value'
}

const DATA = {
  createdDate: '2006-01-02T15:04:05+07:00',
  updatedDate: '2006-01-02T15:04:05-07:00',
  expiresDate: '2006-01-02T15:04:05-07:00',
  dataError: 'dataErrorValue',
  contactEmail: 'contactEmail-value',
  customField1Name: 'customField1Name-value',
  customField1Value: 'customField1Value-value',
  customField2Name: 'customField2Name-value',
  customField2Value: 'customField2Value-value',
  customField3Name: 'customField3Name-value',
  customField3Value: 'customField3Value-value',
  domainAvailability: 'UNAVAILABLE',
  domainName: 'domainName-value',
  domainNameExt: 'domainNameExt-value',
  estimatedDomainAge: '1',
  footer: 'footer-value',
  header: 'header-value',
  audit: {
    createdDate: '2006-01-02T15:04:05+07:00',
    updatedDate: '2006-01-02T15:04:05-07:00'
  },
  nameServers: {
    rawText: 'rawText-value',
    hostNames: [
      'hostName-value1',
      'hostName-value2'
    ],
    ips: [
      'ip-value1',
      'ip-value2'
    ]
  },
  parseCode: '1',
  rawText: 'rawText-value',
  strippedText: 'strippedText-value',
  registrant: DATA_CONTACT,
  administrativeContact: DATA_CONTACT,
  billingContact: DATA_CONTACT,
  technicalContact: DATA_CONTACT,
  zoneContact: DATA_CONTACT,
  registrarName: 'registrarName-value',
  registrarIANAID: 'registrarIANAID-value',
  whoisServer: 'whoisServer-value',
  createdDateNormalized: '2006-01-02T15:04:05+07:00',
  updatedDateNormalized: '2006-01-02T15:04:05+07:00',
  expiresDateNormalized: '2006-01-02T15:04:05+07:00'
}

/**
 * @param {Object} data
 * @param {Object} obj
 * @param {string[]} [skip]
 * @returns void
 * @private
 */
function _setObjectProps (data, obj, skip = []) {
  const keys = Object.keys(data)

  let key = ''
  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
    if (skip.indexOf(key) > -1) {
      continue
    }
    obj[key] = data[key]
  }
}

describe('Models', () => {
  describe('Audit', () => {
    it('should parse json', () => {
      const data = JSON.parse(JSON.stringify(DATA.audit))
      data.createdDate = 'foo'

      const actual = new Audit(data)

      const expected = new Audit()
      _setObjectProps(data, expected)

      expected.createdDateRaw = expected.createdDate
      expected.createdDate = undefined
      expected.updatedDateRaw = expected.updatedDate
      expected.updatedDate = new Date(2006, 0, 2, 22, 4, 5, 0)

      assert.deepStrictEqual(actual, expected)
    })
  })

  describe('Contact', () => {
    it('should parse json', () => {
      const data = DATA_CONTACT
      const actual = new Contact(data)

      const expected = new Contact()
      _setObjectProps(data, expected)
      expected.postalCode = 123

      assert.deepStrictEqual(actual, expected)
    })

    it("shouldn't parse invalid postal code", () => {
      const data = JSON.parse(JSON.stringify(DATA_CONTACT))
      data.postalCode = 'foo'

      const actual = new Contact(data)

      const expected = new Contact()
      _setObjectProps(data, expected)
      expected.postalCode = undefined

      assert.deepStrictEqual(actual, expected)
    })
  })

  describe('ErrorMessage', () => {
    it('should parse json', () => {
      const actual = new ErrorMessage({
        errorCode: 'errorCode-value',
        msg: 'msg-value'
      })

      const expected = new ErrorMessage()
      expected.errorCode = 'errorCode-value'
      expected.msg = 'msg-value'

      assert.deepStrictEqual(actual, expected)
    })
  })

  describe('NameServers', () => {
    it('should parse json', () => {
      const data = DATA.nameServers
      const actual = new NameServers(data)

      const expected = new NameServers()
      _setObjectProps(data, expected)

      assert.deepStrictEqual(actual, expected)
    })

    it("shouldn't parse invalid IPs", () => {
      const data = JSON.parse(JSON.stringify(DATA.nameServers))
      data.ips = 1

      const actual = new NameServers(data)

      const expected = new NameServers()
      _setObjectProps(data, expected)
      expected.ips = undefined

      assert.deepStrictEqual(actual, expected)
    })
  })

  describe('RegistryData', () => {
    it('should parse json', () => {
      const data = JSON.parse(JSON.stringify(DATA))
      data.referralURL = 'referralURL-value'
      data.status = 'status-value'

      const actual = new RegistryData(data)

      const expected = new RegistryData()
      _setObjectProps(data, expected, ['referralURL', 'registrarIANAID'])

      expected.createdDateRaw = expected.createdDate
      expected.updatedDateRaw = expected.updatedDate
      expected.expiresDateRaw = expected.expiresDate
      expected.createdDate = new Date(2006, 0, 2, 8, 4, 5, 0)
      expected.updatedDate = new Date(2006, 0, 2, 22, 4, 5, 0)
      expected.expiresDate = new Date(2006, 0, 2, 22, 4, 5, 0)
      expected.domainAvailabilityRaw = expected.domainAvailability
      expected.domainAvailability = false
      expected.estimatedDomainAgeRaw = expected.estimatedDomainAge
      expected.estimatedDomainAge = 1
      expected.audit = new Audit(data.audit)
      expected.nameServers = new NameServers(data.nameServers)
      expected.parseCode = 1
      expected.registrant = new Registrant(data.registrant)
      expected.administrativeContact = new Contact(data.administrativeContact)
      expected.billingContact = new Contact(data.billingContact)
      expected.technicalContact = new Contact(data.technicalContact)
      expected.zoneContact = new Contact(data.zoneContact)
      expected.registrarIanaId = 'registrarIANAID-value'
      expected.createdDateNormalized = new Date(2006, 0, 2, 8, 4, 5, 0)
      expected.updatedDateNormalized = new Date(2006, 0, 2, 8, 4, 5, 0)
      expected.expiresDateNormalized = new Date(2006, 0, 2, 8, 4, 5, 0)
      expected.referralUrl = 'referralURL-value'

      assert.deepStrictEqual(actual, expected)
    })
  })

  describe('WhoisRecord', () => {
    it('should parse json', () => {
      const data = JSON.parse(JSON.stringify(DATA))
      data.privateWhoisProxy = 'privateWhoisProxy-value'
      data.registryData = JSON.parse(JSON.stringify(DATA))
      data.registryData.referralURL = 'referralURL-value'
      data.registryData.status = 'status-value'
      data.domainAvailability = 'AVAILABLE'

      const actual = new WhoisRecord(data)

      const expected = new WhoisRecord()
      _setObjectProps(data, expected, ['referralURL', 'registrarIANAID'])

      expected.createdDateRaw = expected.createdDate
      expected.updatedDateRaw = expected.updatedDate
      expected.expiresDateRaw = expected.expiresDate
      expected.createdDate = new Date(2006, 0, 2, 8, 4, 5, 0)
      expected.updatedDate = new Date(2006, 0, 2, 22, 4, 5, 0)
      expected.expiresDate = new Date(2006, 0, 2, 22, 4, 5, 0)
      expected.domainAvailabilityRaw = expected.domainAvailability

      expected.domainAvailability =
        expected._parseDomainAvailability(expected.domainAvailability)

      expected.estimatedDomainAgeRaw = expected.estimatedDomainAge
      expected.estimatedDomainAge = 1
      expected.audit = new Audit(data.audit)
      expected.nameServers = new NameServers(data.nameServers)
      expected.parseCode = 1
      expected.registrant = new Registrant(data.registrant)
      expected.administrativeContact = new Contact(data.administrativeContact)
      expected.billingContact = new Contact(data.billingContact)
      expected.technicalContact = new Contact(data.technicalContact)
      expected.zoneContact = new Contact(data.zoneContact)
      expected.registrarIanaId = 'registrarIANAID-value'
      expected.createdDateNormalized = new Date(2006, 0, 2, 8, 4, 5, 0)
      expected.updatedDateNormalized = new Date(2006, 0, 2, 8, 4, 5, 0)
      expected.expiresDateNormalized = new Date(2006, 0, 2, 8, 4, 5, 0)
      expected.registryData = new RegistryData(data.registryData)

      assert.deepStrictEqual(actual, expected)
    })
  })

  describe('RequestParameters', () => {
    it('should work with empty constructor', () => {
      const actual = new RequestParameters({})
      actual.checkProxyData = 1
      actual.da = 1
      actual.ip = 1
      actual.ignoreRawTexts = 1
      actual.ipWhois = 1
      actual.preferFresh = 1
      actual.thinWhois = 1

      assert.strictEqual(actual.checkProxyData, 1)
      assert.strictEqual(actual.da, 1)
      assert.strictEqual(actual.ip, 1)
      assert.strictEqual(actual.ignoreRawTexts, 1)
      assert.strictEqual(actual.ipWhois, 1)
      assert.strictEqual(actual.preferFresh, 1)
      assert.strictEqual(actual.thinWhois, 1)
    })

    describe('checkProxyData', () => {
      it('should throw error for no value', () => {
        assert.throws(
          () => {
            new RequestParameters().checkProxyData = undefined
          },
          ParameterError)
      })

      it('should throw error for NaN value', () => {
        assert.throws(
          () => {
            new RequestParameters().checkProxyData = 'foo'
          },
          ParameterError)
      })

      it('should throw error for wrong value type', () => {
        assert.throws(
          () => {
            new RequestParameters().checkProxyData = '1'
          },
          ParameterError)
      })

      it('should throw error for out of range value', () => {
        assert.throws(
          () => {
            new RequestParameters().checkProxyData = 3
          },
          ParameterError)
      })
    })

    describe('da', () => {
      it('should throw error for no value', () => {
        assert.throws(
          () => {
            new RequestParameters().da = undefined
          },
          ParameterError)
      })

      it('should throw error for NaN value', () => {
        assert.throws(
          () => {
            new RequestParameters().da = 'foo'
          },
          ParameterError)
      })

      it('should throw error for wrong value type', () => {
        assert.throws(
          () => {
            new RequestParameters().da = '1'
          },
          ParameterError)
      })

      it('should throw error for out of range value', () => {
        assert.throws(
          () => {
            new RequestParameters().da = 3
          },
          ParameterError)
      })
    })

    describe('ignoreRawTexts', () => {
      it('should throw error for no value', () => {
        assert.throws(
          () => {
            new RequestParameters().ignoreRawTexts = undefined
          },
          ParameterError)
      })

      it('should throw error for NaN value', () => {
        assert.throws(
          () => {
            new RequestParameters().ignoreRawTexts = 'foo'
          },
          ParameterError)
      })

      it('should throw error for wrong value type', () => {
        assert.throws(
          () => {
            new RequestParameters().ignoreRawTexts = '1'
          },
          ParameterError)
      })

      it('should throw error for out of range value', () => {
        assert.throws(
          () => {
            new RequestParameters().ignoreRawTexts = -1
          },
          ParameterError)
      })
    })

    describe('ip', () => {
      it('should throw error for no value', () => {
        assert.throws(
          () => {
            new RequestParameters().ip = undefined
          },
          ParameterError)
      })

      it('should throw error for NaN value', () => {
        assert.throws(
          () => {
            new RequestParameters().ip = 'foo'
          },
          ParameterError)
      })

      it('should throw error for wrong value type', () => {
        assert.throws(
          () => {
            new RequestParameters().ip = '1'
          },
          ParameterError)
      })

      it('should throw error for out of range value', () => {
        assert.throws(
          () => {
            new RequestParameters().ip = 1000
          },
          ParameterError)
      })
    })

    describe('ipWhois', () => {
      it('should throw error for no value', () => {
        assert.throws(
          () => {
            new RequestParameters().ipWhois = undefined
          },
          ParameterError)
      })

      it('should throw error for NaN value', () => {
        assert.throws(
          () => {
            new RequestParameters().ipWhois = null
          },
          ParameterError)
      })

      it('should throw error for wrong value type', () => {
        assert.throws(
          () => {
            new RequestParameters().ipWhois = '1'
          },
          ParameterError)
      })

      it('should throw error for out of range value', () => {
        assert.throws(
          () => {
            new RequestParameters().ipWhois = 5
          },
          ParameterError)
      })
    })

    describe('preferFresh', () => {
      it('should throw error for no value', () => {
        assert.throws(
          () => {
            new RequestParameters().preferFresh = undefined
          },
          ParameterError)
      })

      it('should throw error for NaN value', () => {
        assert.throws(
          () => {
            new RequestParameters().preferFresh = 'baz'
          },
          ParameterError)
      })

      it('should throw error for wrong value type', () => {
        assert.throws(
          () => {
            new RequestParameters().preferFresh = '1'
          },
          ParameterError)
      })

      it('should throw error for out of range value', () => {
        assert.throws(
          () => {
            new RequestParameters().preferFresh = 5.5
          },
          ParameterError)
      })
    })

    describe('thinWhois', () => {
      it('should throw error for no value', () => {
        assert.throws(
          () => {
            new RequestParameters().thinWhois = undefined
          },
          ParameterError)
      })

      it('should throw error for NaN value', () => {
        assert.throws(
          () => {
            new RequestParameters().thinWhois = 'baz'
          },
          ParameterError)
      })

      it('should throw error for wrong value type', () => {
        assert.throws(
          () => {
            new RequestParameters().thinWhois = '0'
          },
          ParameterError)
      })

      it('should throw error for out of range value', () => {
        assert.throws(
          () => {
            new RequestParameters().thinWhois = 100
          },
          ParameterError)
      })
    })

    describe('constructor', () => {
      it('should work with empty data', () => {
        const actual = new RequestParameters({})
        const expected = new RequestParameters()
        assert.deepStrictEqual(actual, expected)
      })

      it('should work with partial data', () => {
        const data = { da: 1 }

        const actual = new RequestParameters(data)

        const expected = new RequestParameters()
        expected.da = 1

        assert.deepStrictEqual(actual, expected)
      })

      it('should work with junk data', () => {
        const data = {
          da: 0,
          foo: 1,
          bar: 2
        }

        const actual = new RequestParameters(data)

        const expected = new RequestParameters()
        expected.da = 0

        assert.deepStrictEqual(actual, expected)
      })

      it('should parse passed object', () => {
        const data = {
          checkProxyData: 1,
          da: 2,
          ip: 0,
          ignoreRawTexts: 1,
          ipWhois: 0,
          preferFresh: 1,
          thinWhois: 1
        }

        const actual = new RequestParameters(data)

        const expected = new RequestParameters()
        _setObjectProps(data, expected)

        assert.deepStrictEqual(actual, expected)
      })
    })
  })
})

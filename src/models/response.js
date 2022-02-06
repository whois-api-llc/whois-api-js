'use strict'

/**
 * @param {Object} [values]
 * @param {string} key
 * @returns {Array|undefined}
 */
function getArray (values, key) {
  try {
    if ((values !== undefined) && (key in values)) {
      return values[key].slice()
    }
  } catch {
    return undefined
  }

  return undefined
}

/**
 * @param {Object} [values]
 * @param {string} key
 * @returns {Date|undefined}
 */
function getDate (values, key) {
  if ((values !== undefined) && (key in values)) {
    const result = new Date(values[key])
    return (result.toString() === 'Invalid Date') ? undefined : result
  }
  return undefined
}

/**
 * @param {Object} [values]
 * @param {string} key
 * @returns {number|undefined}
 */
function getNumber (values, key) {
  if ((values !== undefined) && (key in values)) {
    return Number(values[key]) || undefined
  }
  return undefined
}

/**
 * @param {Object} [values]
 * @param {string} key
 * @returns {string|undefined}
 */
function getString (values, key) {
  if ((values !== undefined) && (key in values)) {
    return String(values[key])
  }
  return undefined
}

class Audit {
  /**
   * @param {Object} [data]
   */
  constructor (data) {
    /**
     * @type {Date|undefined}
     */
    this.createdDate = getDate(data, 'createdDate')

    /**
     * @type {string|undefined}
     */
    this.createdDateRaw = getString(data, 'createdDate')

    /**
     * @type {Date|undefined}
     */
    this.updatedDate = getDate(data, 'updatedDate')

    /**
     * @type {string|undefined}
     */
    this.updatedDateRaw = getString(data, 'updatedDate')
  }
}

class BaseWhoisRecord {
  /**
   * @param {Object} [data]
   */
  constructor (data) {
    data = data || {}

    /**
     * @type {Date|undefined}
     */
    this.createdDate = getDate(data, 'createdDate')

    /**
     * @type {string|undefined}
     */
    this.createdDateRaw = getString(data, 'createdDate')

    /**
     * @type {Date|undefined}
     */
    this.updatedDate = getDate(data, 'updatedDate')

    /**
     * @type {string|undefined}
     */
    this.updatedDateRaw = getString(data, 'updatedDate')

    /**
     * @type {Date|undefined}
     */
    this.expiresDate = getDate(data, 'expiresDate')

    /**
     * @type {string|undefined}
     */
    this.expiresDateRaw = getString(data, 'expiresDate')

    /**
     * @type {string|undefined}
     */
    this.dataError = getString(data, 'dataError')

    /**
     * @type {string|undefined}
     */
    this.contactEmail = getString(data, 'contactEmail')

    /**
     * @type {string|undefined}
     */
    this.customField1Name = getString(data, 'customField1Name')

    /**
     * @type {string|undefined}
     */
    this.customField1Value = getString(data, 'customField1Value')

    /**
     * @type {string|undefined}
     */
    this.customField2Name = getString(data, 'customField2Name')

    /**
     * @type {string|undefined}
     */
    this.customField2Value = getString(data, 'customField2Value')

    /**
     * @type {string|undefined}
     */
    this.customField3Name = getString(data, 'customField3Name')

    /**
     * @type {string|undefined}
     */
    this.customField3Value = getString(data, 'customField3Value')

    /**
     * @type {boolean|undefined}
     */
    this.domainAvailability =
      this._parseDomainAvailability(getString(data, 'domainAvailability'))

    /**
     * @type {string|undefined}
     */
    this.domainAvailabilityRaw = getString(data, 'domainAvailability')

    /**
     * @type {string|undefined}
     */
    this.domainName = getString(data, 'domainName')

    /**
     * @type {string|undefined}
     */
    this.domainNameExt = getString(data, 'domainNameExt')

    /**
     * @type {number|undefined}
     */
    this.estimatedDomainAge = getNumber(data, 'estimatedDomainAge')

    /**
     * @type {string|undefined}
     */
    this.estimatedDomainAgeRaw = getString(data, 'estimatedDomainAge')

    /**
     * @type {string|undefined}
     */
    this.footer = getString(data, 'footer')

    /**
     * @type {string|undefined}
     */
    this.header = getString(data, 'header')

    /**
     * @type {Audit|undefined}
     */
    this.audit = ('audit' in data) ? new Audit(data.audit) : undefined

    /**
     * @type {NameServers|undefined}
     */
    this.nameServers = ('nameServers' in data)
      ? new NameServers(data.nameServers)
      : undefined

    /**
     * @type {number|undefined}
     */
    this.parseCode = getNumber(data, 'parseCode')

    /**
     * @type {string|undefined}
     */
    this.rawText = getString(data, 'rawText')

    /**
     * @type {string|undefined}
     */
    this.strippedText = getString(data, 'strippedText')

    /**
     * @type {Registrant|undefined}
     */
    this.registrant = ('registrant' in data)
      ? new Registrant(data.registrant)
      : undefined

    /**
     * @type {Contact|undefined}
     */
    this.administrativeContact = ('administrativeContact' in data)
      ? new Contact(data.administrativeContact)
      : undefined

    /**
     * @type {Contact|undefined}
     */
    this.billingContact = ('billingContact' in data)
      ? new Contact(data.billingContact)
      : undefined

    /**
     * @type {Contact|undefined}
     */
    this.technicalContact = ('technicalContact' in data)
      ? new Contact(data.technicalContact)
      : undefined

    /**
     * @type {Contact|undefined}
     */
    this.zoneContact = ('zoneContact' in data)
      ? new Contact(data.zoneContact)
      : undefined

    /**
     * @type {string|undefined}
     */
    this.registrarName = getString(data, 'registrarName')

    /**
     * @type {string|undefined}
     */
    this.registrarIanaId = getString(data, 'registrarIANAID')

    /**
     * @type {string|undefined}
     */
    this.whoisServer = getString(data, 'whoisServer')

    /**
     * @type {Date|undefined}
     */
    this.createdDateNormalized = getDate(data, 'createdDateNormalized')

    /**
     * @type {Date|undefined}
     */
    this.updatedDateNormalized = getDate(data, 'updatedDateNormalized')

    /**
     * @type {Date|undefined}
     */
    this.expiresDateNormalized = getDate(data, 'expiresDateNormalized')
  }

  /**
   * @param {string} [value]
   * @returns {boolean|undefined}
   * @private
   */
  _parseDomainAvailability (value) {
    value = value || ''

    if (value.toLowerCase() === 'available') {
      return true
    } else if (value.toLowerCase() === 'unavailable') {
      return false
    }

    return undefined
  }
}

class Contact {
  /**
   * @param {Object} [data]
   */
  constructor (data) {
    /**
     * @type {string|undefined}
     */
    this.name = getString(data, 'name')

    /**
     * @type {string|undefined}
     */
    this.organization = getString(data, 'organization')

    /**
     * @type {string|undefined}
     */
    this.street1 = getString(data, 'street1')

    /**
     * @type {string|undefined}
     */
    this.street2 = getString(data, 'street2')

    /**
     * @type {string|undefined}
     */
    this.street3 = getString(data, 'street3')

    /**
     * @type {string|undefined}
     */
    this.street4 = getString(data, 'street4')

    /**
     * @type {string|undefined}
     */
    this.city = getString(data, 'city')

    /**
     * @type {string|undefined}
     */
    this.state = getString(data, 'state')

    /**
     * @type {number|undefined}
     */
    this.postalCode = getNumber(data, 'postalCode')

    /**
     * @type {string|undefined}
     */
    this.country = getString(data, 'country')

    /**
     * @type {string|undefined}
     */
    this.countryCode = getString(data, 'countryCode')

    /**
     * @type {string|undefined}
     */
    this.email = getString(data, 'email')

    /**
     * @type {string|undefined}
     */
    this.telephone = getString(data, 'telephone')

    /**
     * @type {string|undefined}
     */
    this.telephoneExt = getString(data, 'telephoneExt')

    /**
     * @type {string|undefined}
     */
    this.fax = getString(data, 'fax')

    /**
     * @type {string|undefined}
     */
    this.faxExt = getString(data, 'faxExt')

    /**
     * @type {string|undefined}
     */
    this.rawText = getString(data, 'rawText')

    /**
     * @type {string|undefined}
     */
    this.unparsable = getString(data, 'unparsable')
  }
}

class ErrorMessage {
  /**
   * @param {Object} [data]
   */
  constructor (data) {
    /**
     * @type {string|undefined}
     */
    this.errorCode = getString(data, 'errorCode')

    /**
     * @type {string|undefined}
     */
    this.msg = getString(data, 'msg')
  }
}

class NameServers {
  /**
   * @param {Object} [data]
   */
  constructor (data) {
    /**
     * @type {string|undefined}
     */
    this.rawText = getString(data, 'rawText')

    /**
     * @type {string[]|undefined}
     */
    this.hostNames = getArray(data, 'hostNames')

    /**
     * @type {string[]|undefined}
     */
    this.ips = getArray(data, 'ips')
  }
}

class Registrant extends Contact {
}

class RegistryData extends BaseWhoisRecord {
  /**
   * @param {Object} [data]
   */
  constructor (data) {
    super(data)

    /**
     * @type {string|undefined}
     */
    this.referralUrl = getString(data, 'referralURL')

    /**
     * @type {string|undefined}
     */
    this.status = getString(data, 'status')
  }
}

class WhoisRecord extends BaseWhoisRecord {
  /**
   * @param {Object} [data]
   */
  constructor (data) {
    super(data)

    data = data || {}

    /**
     * @type {RegistryData|undefined}
     */
    this.registryData = ('registryData' in data)
      ? new RegistryData(data.registryData)
      : undefined

    /**
     * @type {string|undefined}
     */
    this.privateWhoisProxy = getString(data, 'privateWhoisProxy')
  }
}

module.exports = {
  Audit,
  Contact,
  ErrorMessage,
  NameServers,
  Registrant,
  RegistryData,
  WhoisRecord
}

[![whois-api-js licence](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![whois-api-js release](https://img.shields.io/npm/v/whois-api-js.svg)](https://img.shields.io/npm/v/whois-api-js.svg)
[![whois-api-js build](https://github.com/whois-api-llc/whois-api-js/workflows/Build/badge.svg)](https://github.com/whois-api-llc/whois-api-js/actions)

# Overview

Node.js client library for [Whois API](https://whois.whoisxmlapi.com/).

Minimum Node.js version is 10.

# Installation

The library is distributed via npm

```bash
npm install whois-api-js
```

# Examples

Full API documentation available [here](https://whois.whoisxmlapi.com/documentation/making-requests)

## Create a new client

```javascript
const WhoisApi = require('whois-api-js')

const client = new WhoisApi.Client('Your API Key')
```

## Make basic requests

```javascript
client.get('example.com')
  .then(function (data) {
    console.log(data)
  })
  .catch(function (error) {
    console.log(error)
  })
```

## Additional parameters
```javascript
// Check domain availability, fetch Whois proxy data & skip raw text
const params = new WhoisApi.RequestParameters({
  da: 1,
  checkProxyData: 1,
  ignoreRawTexts: 1
})

// Fetch results in XML
client.getRaw('example.com', WhoisApi.XML_FORMAT, params)
  .then(function (data) {
    console.log(data)
  })
  .catch(function (error) {
    console.log(error)
  })
```

## Using callback
```javascript
client.get('example.com', params, function (err, res) {
  if (err) {
    console.log(err)
  } else {
    console.log(res)
  }
})
```

# Changelog

1.0.0: *02-07-2022*

- First release.

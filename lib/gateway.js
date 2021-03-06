'use strict';

var braintree = require('braintree');
var environment, gateway;

require('dotenv').load();
environment = process.env.BT_ENVIRONMENT;

gateway = braintree.connect({
  environment: braintree.Environment[environment],
  merchantId: process.env.BT_MERCHANT_ID,
  publicKey: process.env.BT_PUBLIC_KEY,
  privateKey: process.env.BT_PRIVATE_KEY
});

module.exports = gateway;

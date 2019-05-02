'use strict';
var express = require('express');
var braintree = require('braintree');
var router = express.Router(); // eslint-disable-line new-cap
var gateway = require('../lib/gateway');
const axios = require('axios');
const rp = require('request-promise');
var request = require('request'); 
const url = require('url');  
const querystring = require('querystring');
var FormData = require('form-data');
const fetch = require("node-fetch");

var TRANSACTION_SUCCESS_STATUSES = [
  braintree.Transaction.Status.Authorizing,
  braintree.Transaction.Status.Authorized,
  braintree.Transaction.Status.Settled,
  braintree.Transaction.Status.Settling,
  braintree.Transaction.Status.SettlementConfirmed,
  braintree.Transaction.Status.SettlementPending,
  braintree.Transaction.Status.SubmittedForSettlement
];

function formatErrors(errors) {
  var formattedErrors = '';

  for (var i in errors) { // eslint-disable-line no-inner-declarations, vars-on-top
    if (errors.hasOwnProperty(i)) {
      formattedErrors += 'Error: ' + errors[i].code + ': ' + errors[i].message + '\n';
    }
  }
  return formattedErrors;
}

function createResultObject(transaction) {
  var result;
  var status = transaction.status;

  if (TRANSACTION_SUCCESS_STATUSES.indexOf(status) !== -1) {
    result = {
      header: 'Sweet Success!',
      icon: 'success',
      message: 'Your test transaction has been successfully processed. See the Braintree API response and try again.'
    };
  } else {
    result = {
      header: 'Transaction Failed',
      icon: 'fail',
      message: 'Your test transaction has a status of ' + status + '. See the Braintree API response and try again.'
    };
  }

  return result;
}

router.get('/', function (req, res) {  
    var scrambledAmount = req.query.target;    
      var form = new FormData();    
      form.append('amount', scrambledAmount);

      var amount = (async () => {
        const response = await     fetch('https://www.vetfriends.com/catalog/amtDS.cfm', { method: 'POST', body: form });
        const json = await response.json();
          console.log(json);
        amount =  json;
      })();
    
    req.session.amount = amount;
    req.session.save();
    next()
    
    console.log("!!!!!This is the main target query " + req.query.target);
    res.redirect('/checkouts/new');
});


router.get('/checkouts/new', (req, res) => {  
  var amount = req.session.amount;  
    
  gateway.clientToken.generate({}, function (err, response) {
    res.render('checkouts/new', {
        clientToken: response.clientToken, 
        messages: req.flash('error'), 
        amount: amount
    });
  });     
});


router.get('/checkouts/:id', function (req, res) {    
  var result;
  var transactionId = req.params.id;

  gateway.transaction.find(transactionId, function (err, transaction) {
    result = createResultObject(transaction);
    res.render('checkouts/show', {transaction: transaction, result: result});
  });
});


router.post('/checkouts/new', async (req, res) => {  
      
    var transactionErrors;
//    var amount = amount; 
    var nonce = req.body.payment_method_nonce;

    gateway.transaction.sale({
      amount: req.session.amount,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true
      }
    }, function (err, result) {
      if (result.success || result.transaction) {
        res.redirect('checkouts/' + result.transaction.id);
      } else {
        transactionErrors = result.errors.deepErrors();
        req.flash('error', {msg: formatErrors(transactionErrors)});
        res.redirect('checkouts/new');
      }
    });        
});

module.exports = router;

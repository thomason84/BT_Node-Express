transaction.id
            transaction.type
            transaction.amount
             transaction.status
             transaction.createdAt
             transaction.updatedAt

      transaction.creditCard.token
             transaction.creditCard.bin
             transaction.creditCard.last4
             transaction.creditCard.cardType
             transaction.creditCard.expirationDate
             transaction.creditCard.cardholderName
             transaction.creditCard.customerLocation

      if transaction.customerDetails
         transaction.customer.id
               transaction.customer.firstName
               transaction.customer.lastName
               transaction.customer.email
               transaction.customer.company
               transaction.customer.website
              transaction.customer.phone
               transaction.customer.fax


function sendAmount(){				
    var data = {};
    data.title = "Transaction ID";
    data.amount = transaction.id;

    $.ajax({
        type: 'POST',
        url: 'https://braintreewithnode.herokuapp.com/checkouts/postRouter',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(data) {
            console.log('success');
            console.log(JSON.stringify(data));
        }
    });
};
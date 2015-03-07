var h, mandrill, mandrillService, v;
var debug = require('debug')('email');
var _ = require("underscore");
mandrillService = {};

mandrill = require('mandrill-api/mandrill');

mandrillService.sendEmail = function(keys, from, to, subject, message, callback) {
  var mandrillMessage, mandrill_client;
  mandrill_client = new mandrill.Mandrill(keys.required.api_key);
  mandrillMessage = {
    'html': message,
    'subject': subject,
    'from_email': from,
    'to': [
      {
        'email': to,
        'type': 'to'
      }
    ]
  };
  return mandrill_client.messages.send({
    'message': mandrillMessage
  }, (function(result) {
    isSent = _.indexOf(["sent", "queued", "scheduled"], result[0].status) > -1
    if(isSent){
      debug("-_-_ sent with mandrill _-_-");
      return callback(null, result);
    } else {
      debug("-_-_ FAILED with mandrill _-_-");
      return callback(result);
    }
  }), function(e) {
    debug("-_-_ FAILED with mandrill _-_-");
    console.error(e);
    return callback(e);
  });
};

module.exports = mandrillService;
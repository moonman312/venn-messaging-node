var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")
MessagingError = require('../../messaging_error');

function Twilio(keys){
  if (!keys) return
	this.name = "twilio"
	this.keys = keys

  this.initialize = function() {
    this.client = require('twilio')(this.keys.account_sid, this.keys.auth_token);
  }

  this.send = function(data, callback) {
    var context = this;
    return this.client.sendMessage({
        to: twiliofyNumber(data.to),
        from: twiliofyNumber(this.keys.from_phone),
        body: data.message
    }, function(err, result) {
        if (err) {
          var mesErr = new MessagingError(context.name, err);
          debug("-_-_ FAILED with twilio _-_-");
          debug(mesErr);
          return callback(mesErr);
        } else {
          debug("-_-_ sent with twilio _-_-");
          result.service = context;
          return callback(null, result);
        }
    });
  }

  this.initialize()
}

twiliofyNumber = function(number) {
  return "+" + number
}

Twilio.prototype = new MessagingServiceProvider()

module.exports = Twilio
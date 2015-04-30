var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")

function Twilio(keys){
  if (!keys) return
	this.name = "twilio"
	this.keys = keys

  this.initialize = function() {
    this.client = require('twilio')(this.keys.account_sid, this.keys.auth_token);
  }

  this.send = function(data, callback) {
    return this.client.sendMessage({
        to: twiliofyNumber(data.to),
        from: this.keys.from_phone,
        body: data.message
    }, function(err, result) {
        if (err) {
          debug("-_-_ FAILED with twilio _-_-");
          debug(err);
          return callback(err);
        } else {
          debug("-_-_ sent with twilio _-_-");
          return callback(null, result, "twilio");
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
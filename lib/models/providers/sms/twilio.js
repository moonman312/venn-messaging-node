var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")
MessagingStatus = require('../../messaging_status');

/*=============================================================================

Define Twilio Service Provider

=============================================================================*/
function Twilio(keys){
  if (!keys) return
	this.name = "twilio"
	this.keys = keys

  this.initialize = function() {
    this.client = require('twilio')(this.keys.account_sid, this.keys.auth_token);
  }

  this.send = function(data, callback) {
    var context = this;
    // if no from number provided, ensure one is in database
    if(!data.from && !this.keys.from_phone)
      return callback(new Error("No from phone number!"))
    var from = data.from || this.keys.from_phone
    if(from.length != 11)
      return callback(new Error("Invalid phone number! Must be 11 digits"))
    debug("sending from number:", from)
    return this.client.sendMessage({
        to: twiliofyNumber(data.to),
        from: twiliofyNumber(from),
        body: data.message
    }, function(err, result) {
        var mesStat;
        if (err) {
          mesStat = new MessagingStatus(context.name, err, false);
          debug("-_-_ FAILED with twilio _-_-");
          debug(mesStat);
          return callback(mesStat);
        } else {
          mesStat = MessagingStatus(context.name, result, true);
          debug("-_-_ sent with twilio _-_-");
          result.service = context;
          result.status = mesStat;
          debug(result);
          return callback(null, result);
        }
    });
  }

  this.initialize()
}
Twilio.prototype = new MessagingServiceProvider()

/*=============================================================================

Define Twilio Status Handlers

=============================================================================*/


/*=============================================================================

Define Twilio Helper Functions

=============================================================================*/
twiliofyNumber = function(number) {
  return "+" + number
}

module.exports = Twilio
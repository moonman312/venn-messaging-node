var debug = require('debug')('email');
EmailServiceProvider = require("../../email_service_provider")

function Nexmo(keys){
  if (!keys) return
	this.name = "nexmo"
	this.keys = keys

  this.initialize = function() {
    var API_PROTOCOL = "https"
    var DEBUG = false
    this.client = (require('easynexmo')).initialize(this.keys.api_key, this.keys.api_secret, API_PROTOCOL, DEBUG);
  }

  this.sendSMS = function(from, to, message, callback) {
    
    this.client.sendTextMessage(from, to, message, function(err, result){
      if (err) {
        debug("-_-_ FAILED with nexmo _-_-");
        debug(err);
        return callback(err);
      } else {
        debug("-_-_ sent with nexmo _-_-");
        return callback(null, result, "nexmo");
      }
    })

  }

  this.initialize()
}

Nexmo.prototype = new EmailServiceProvider()

module.exports = Nexmo
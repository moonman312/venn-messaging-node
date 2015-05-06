var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")

function Pushwoosh(keys){
  if (!keys) return
	this.name = "pushwoosh"
	this.keys = keys

  this.initialize = function() {
    var Pushwoosh = require('pushwoosh-client');
    this.client= new Pushwoosh(this.keys.app_code, this.keys.auth_token);
  }

  this.send = function(data, callback) {
    var context = this;
    this.client.sendMessage(data.message, [data.deviceToken], function(err, result) {
      if (err) { 
        debug("-_-_ FAILED with pushwoosh _-_-");
        debug(err);
        return callback(err);
      }
      else { 
        debug("-_-_ sent with pushwoosh _-_-");
        if(!result) result = {} 
        result.service = context;
        return callback(null, result);
      }
    });
  }

  this.initialize()
}

Pushwoosh.prototype = new MessagingServiceProvider()

module.exports = Pushwoosh
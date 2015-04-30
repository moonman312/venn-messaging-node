var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")

function Pushwoosh(keys){
  if (!keys) return
	this.name = "pushwoosh"
	this.keys = keys

  this.initialize = function() {
    var pushWoosh = require('pushwoosh');
    var pushClient= new pushWoosh(this.keys.app_code, this.keys.auth_token);
  }

  this.send = function(data, callback) {
    platform = if data.deviceType is "ios" then 1 else 3
    var config= {
      "send_date":"now",
      "ignore_user_timezone": true,
      "content": data.message,
      "data":{"custom": data.message},
      "platforms":[platform],
      "devices":[
        data.deviceToken
      ]
    };

    pushClient.sendMessage(config).then(function(data){
    // this.client.sendMessage(data.message, [data.deviceToken], function(err, result) {
      if (data) { 
        debug("-_-_ sent with pushwoosh _-_-");
        debug("-_-_ sent with pushwoosh _-_-");
        return callback(null, data, "pushwoosh");
      }
      else { 
        debug("-_-_ FAILED with pushwoosh _-_-");
        debug();
        return callback();
      }
    });
  }

  this.initialize()
}

Pushwoosh.prototype = new MessagingServiceProvider()

module.exports = Pushwoosh
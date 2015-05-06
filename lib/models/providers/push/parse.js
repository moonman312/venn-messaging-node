var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")

function Parse(keys){
  if (!keys) return
	this.name = "parse"
	this.keys = keys

  this.initialize = function() {
    Parse = require('node-parse-api').Parse;
    var options = {
        app_id: this.keys.app_id,
        api_key: this.keys.api_key
    }
    this.client = new Parse(options);
  }

  this.send = function(data, callback) {
    var context = this;

    // TODO: should query to make sure installation hasn't been created yet
    context.client.insertInstallationData(data.deviceType, data.deviceToken, function(err, result){
      if (err) { debug("insertInstallationData err", err); }
      else { debug("insertInstallationData result", result); }
      var notification = {
        where : {
           "deviceToken": { 
              "$in": [ data.deviceToken ] 
            }
        },
        data: {
          alert: data.message
        }
      };
      context.client.sendPush(notification, function(err, result){
        if (err) { 
          debug("-_-_ FAILED with parse _-_-");
          debug(err);
          return callback(err);
        }
        else { 
          debug("-_-_ sent with parse _-_-");
          result.service = context;
          return callback(null, result);
        }
      });
    });

  }

  this.initialize()
}

Parse.prototype = new MessagingServiceProvider()

module.exports = Parse
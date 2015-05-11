var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")
MessagingStatus = require('../../messaging_status');

function Postmark(keys){
  if (!keys) return
  this.name = "postmark"
  this.keys = keys

  this.initialize = function() {
    var postmark = require("postmark")
    this.client = new postmark.Client(this.keys.server_key);
  }

  this.send = function(data, callback) {
    var context = this;
    this.client.sendEmail({
        "From": data.from, 
        "To": data.to, 
        "Subject": data.subject, 
        "TextBody": data.message
    }, function(err, result) {
        var mesStat;
        if(err) {
          mesStat = new MessagingStatus(context.name, err, false);
          debug("-_-_ FAILED with postmark _-_-");
          debug(mesStat);
          return callback(mesStat);
        }
        else {
          mesStat = new MessagingStatus(context.name, result, true);
          debug("-_-_ sent with postmark _-_-");
          result.service = context;
          result.status = mesStat;
          debug(result);
          return callback(null, result);
        }
    });
  }

  this.initialize()
}

Postmark.prototype = new MessagingServiceProvider()

module.exports = Postmark
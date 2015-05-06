var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")

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
        if(err) {
          debug("-_-_ FAILED with postmark _-_-");
          debug(err);
          return callback(err);
        }
        else {
          debug("-_-_ sent with postmark _-_-");
          result.service = context;
          return callback(null, result);
        }
    });
  }

  this.initialize()
}

Postmark.prototype = new MessagingServiceProvider()

module.exports = Postmark
var debug = require('debug')('email');
EmailServiceProvider = require("../../email_service_provider")

function Postmark(keys){
  if (!keys) return
  this.name = "postmark"
  this.keys = keys

  this.initialize = function() {
    var postmark = require("postmark")
    this.client = new postmark.Client(this.keys.server_key);
  }

  this.send = function(from, to, subject, message, callback) {

    this.client.sendEmail({
        "From": from, 
        "To": to, 
        "Subject": subject, 
        "TextBody": message
    }, function(error, result) {
        if(error) {
          debug("-_-_ FAILED with postmark _-_-");
          debug(err);
          return callback(err);
        }
        else {
          debug("-_-_ sent with postmark _-_-");
          return callback(null, result, "postmark");
        }
    });
  }

  this.initialize()
}

Postmark.prototype = new EmailServiceProvider()

module.exports = Postmark
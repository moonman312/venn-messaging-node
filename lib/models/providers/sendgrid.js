var debug = require('debug')('email');
EmailServiceProvider = require("../email_service_provider")

function Sendgrid(keys){
  if (!keys) return
	this.name = "sendgrid";
	this.keys = keys;

  this.initialize = function() {
    debug("init Sendgrid")
    this.client = require('sendgrid')(this.keys.api_user, this.keys.api_key);
  }

  this.send = function(from, to, subject, message, callback) {
    debug("send Sendgrid")
    return this.client.send({
      to: to,
      from: from,
      subject: subject,
      text: message
    }, function(err, result) {
      debug("sendgrid result")
      if (err) {
        debug("-_-_ FAILED with sendgrid _-_-");
        debug(err);
        return callback(err);
      } else {
        debug("-_-_ sent with sendgrid _-_-");
        return callback(null, result, "sendgrid");
      }
    });
  }
}

Sendgrid.prototype = new EmailServiceProvider()

// Sendgrid.prototype.initialize = function() {
//   debug("init Sendgrid")
//   this.client = require('sendgrid')(this.keys.api_user, this.keys.api_key);
// }

module.exports = Sendgrid
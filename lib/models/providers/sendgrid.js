var debug = require('debug')('email');
EmailServiceProvider = require("../email_service_provider")

function Sendgrid(keys){
	this.name = "sendgrid";
	this.keys = keys;
}

Sendgrid.prototype = new EmailServiceProvider()

Sendgrid.prototype.initialize = function() {
  debug("init Sendgrid")
  this.client = require('sendgrid')(this.keys.api_user, this.keys.api_key);
}

Sendgrid.prototype.send = function(from, to, subject, message, callback) {
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
      return callback(err);
    } else {
      debug("-_-_ sent with sendgrid _-_-");
      return callback(null, result, "sendgrid");
    }
  });
}

module.exports = Sendgrid
var debug = require('debug')('email');
EmailServiceProvider = require("../../email_service_provider")

function Sendgrid(keys){
  if (!keys) return
	this.name = "sendgrid"
	this.keys = keys

  this.initialize = function() {
    this.client = require('sendgrid')(this.keys.api_user, this.keys.api_key);
  }

  this.send = function(data, callback) {
    return this.client.send({
      to: data.to,
      from: data.from,
      subject: data.subject,
      text: data.message
    }, function(err, result) {
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

  this.initialize()
}

Sendgrid.prototype = new EmailServiceProvider()

module.exports = Sendgrid
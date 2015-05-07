var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")
MessagingError = require('../../messaging_error');

function Sendgrid(keys){
  if (!keys) return
	this.name = "sendgrid"
	this.keys = keys

  this.initialize = function() {
    this.client = require('sendgrid')(this.keys.api_user, this.keys.api_key);
  }

  this.send = function(data, callback) {
    var context = this;
    return this.client.send({
      to: data.to,
      from: data.from,
      subject: data.subject,
      text: data.message
    }, function(err, result) {
      if (err) {
        mesErr = new MessagingError(context.name, err);
        debug("-_-_ FAILED with sendgrid _-_-");
        debug(mesErr);
        return callback(mesErr);
      } else {
        debug("-_-_ sent with sendgrid _-_-");
        result.service = context;
        return callback(null, result);
      }
    });
  }

  this.initialize()
}

Sendgrid.prototype = new MessagingServiceProvider()

module.exports = Sendgrid
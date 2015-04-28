var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")

function Mailgun(keys){
  if (!keys) return
	this.name = "mailgun"
	this.keys = keys

  this.initialize = function() {
    this.client = require('mailgun-js')({apiKey: this.keys.api_key, domain: this.keys.domain});
  }

  this.send = function(data, callback) {
    var emailData = {
      from: data.from,
      to: data.to,
      subject: data.subject,
      text: data.message
    };
     
    this.client.messages().send(emailData, function (err, body) {
        if (err) {
          debug("-_-_ FAILED with mailgun _-_-");
          debug(err);
          return callback(err);
        } else {
          debug("-_-_ sent with mailgun _-_-");
          return callback(null, body, "mailgun");
        }
      });

  }

  this.initialize()
}

Mailgun.prototype = new MessagingServiceProvider()

module.exports = Mailgun
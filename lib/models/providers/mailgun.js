var debug = require('debug')('email');
EmailServiceProvider = require("../email_service_provider")

function Mailgun(keys){
  if (!keys) return
	this.name = "mailgun";
	this.keys = keys;

  this.initialize = function() {
    debug("init Mailgun")
    this.client = require('mailgun-js')({apiKey: this.keys.api_key, domain: this.keys.domain});
  }

  this.send = function(from, to, subject, message, callback) {
    debug("send Mailgun")

    var emailData = {
      from: from,
      to: to,
      subject: subject,
      text: message
    };
     
    this.client.messages().send(emailData, function (err, body) {
        debug("mailgun result")
        if (err) {
          debug("-_-_ FAILED with mailgun _-_-");
          debug(err);
          return callback(err);
        } else {
          debug("-_-_ sent with mailgun _-_-");
          return callback(null, body, "mailgun");
        }
      });

    // });

  }
}

Mailgun.prototype = new EmailServiceProvider()

module.exports = Mailgun
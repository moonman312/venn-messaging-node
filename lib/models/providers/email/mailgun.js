var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")
MessagingStatus = require('../../messaging_status');

function Mailgun(keys){
  if (!keys) return
	this.name = "mailgun"
	this.keys = keys

  this.initialize = function() {
    this.client = require('mailgun-js')({apiKey: this.keys.api_key, domain: this.keys.domain});
  }

  this.send = function(data, callback) {
    var context = this;
    var emailData = {
      from: data.from,
      to: data.to,
      subject: data.subject,
      text: data.message
    };
    
    this.client.messages().send(emailData, function (err, body) {
        var mesStat;
        if (err) {
          mesStat = new MessagingStatus(context.name, err, false);
          debug("-_-_ FAILED with mailgun _-_-");
          debug(mesStat);
          return callback(mesStat);
        } else {
          mesStat = new MessagingStatus(context.name, body, true);
          debug("-_-_ sent with mailgun _-_-");
          body.service = context;
          body.status = mesStat;
          debug(body);
          return callback(null, body);
        }
      });

  }

  this.initialize()
}

Mailgun.prototype = new MessagingServiceProvider()

module.exports = Mailgun
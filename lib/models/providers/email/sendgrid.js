var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")
MessagingStatus = require('../../messaging_status');

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
      var mesStat;
      if (err) {
        mesStat = new MessagingStatus(context.name, err, false);
        debug("-_-_ FAILED with sendgrid _-_-");
        debug(mesStat);
        return callback(mesStat);
      } else {
        mesStat = MessagingStatus(context.name, result, true);
        debug("-_-_ sent with sendgrid _-_-");
        result.service = context;
        result.status = mesStat;
        debug(result);
        return callback(null, result);
      }
    });
  }

  this.initialize()
}

Sendgrid.prototype = new MessagingServiceProvider()

module.exports = Sendgrid
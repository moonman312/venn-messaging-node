var debug = require('debug')('email');
EmailServiceProvider = require("../email_service_provider")

function MessageBus(keys){
  if (!keys) return
  this.name = "messagebus"
  this.keys = keys

  this.initialize = function() {
    debug("initing messagebus ... ")
    var MessageBusAPIClient = require('messagebus').MessageBusAPIClient
    this.client = new MessageBusAPIClient(this.keys.api_key)
  }

  this.send = function(from, to, subject, message, callback) {
    sessionKey = "DEFAULT"

    var messages = [{
        toEmail: to,
        subject: subject,
        htmlBody: message,
        fromEmail: from,
        returnPath: "bounces@examples.com"
    }];

    return this.client.sendMessages(messages, function(err, resp) {
      if (err) {
        debug("-_-_ FAILED with message bus _-_-");
        debug(err);
        return callback(err);
      }
      else {
        debug("-_-_ sent with message bus _-_-");
        return callback(null, resp.results, "messagebus");
      }
    });

  }

  this.initialize()
}

MessageBus.prototype = new EmailServiceProvider()

module.exports = MessageBus
var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")

function MessageBus(keys){
  if (!keys) return
  this.name = "messagebus"
  this.keys = keys

  this.initialize = function() {
    debug("initing messagebus ... ")
    var MessageBusAPIClient = require('messagebus').MessageBusAPIClient
    this.client = new MessageBusAPIClient(this.keys.api_key)
  }

  this.send = function(data, callback) {
    var context = this;
    sessionKey = "DEFAULT"

    var messages = [{
        toEmail: data.to,
        subject: data.subject,
        htmlBody: data.message,
        fromEmail: data.from,
        returnPath: "bounces@examples.com" // TODO change this
    }];

    return this.client.sendMessages(messages, function(err, resp) {
      if (err) {
        debug("-_-_ FAILED with message bus _-_-");
        debug(err);
        return callback(err);
      }
      else {
        debug("-_-_ sent with message bus _-_-");
        resp.results.service = context;
        return callback(null, resp.results);
      }
    });

  }

  this.initialize()
}

MessageBus.prototype = new MessagingServiceProvider()

module.exports = MessageBus
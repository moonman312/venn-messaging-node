var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider");
MessagingServiceStatus = require('../../messaging_service_status');
MessagingUserStatus = require('../../messaging_user_status');

/*=============================================================================

Define MessageBus Service Provider

=============================================================================*/
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
      var messagebusStat;
      if (err) {
        messagebusStat = new MessageBusServiceStatus(err, false);
        debug("-_-_ FAILED with message bus _-_-");
        debug(messagebusStat);
        return callback(messagebusStat);
      }
      else {
        messagebusStat = new MessageBusServiceStatus(resp.results, true);
        debug("-_-_ sent with message bus _-_-");
        resp.results.service = context;
        resp.results.status = messagebusStat;
        debug(resp.results);
        return callback(null, resp.results);
      }
    });

  }

  this.initialize()
}

MessageBus.prototype = new MessagingServiceProvider()


/*=============================================================================

Define MessageBus Service Status Handler

=============================================================================*/
function MessageBusServiceStatus(response, success) {
  MessagingServiceStatus.call(this, 'messagebus');

  // Put logic here for handling any possible service errors
}

MessageBusServiceStatus.prototype = Object.create(MessagingServiceStatus.prototype);
MessageBusServiceStatus.prototype.constructor = MessageBusServiceStatus;


/*=============================================================================

Define MessageBus User Status Handler

=============================================================================*/
function MessageBusUserStatus(message, code) {
  MessagingUserStatus.call(this, 'messagebus');

  // Put logic here for handling any possible user errors
}

MessageBusUserStatus.prototype = Object.create(MessagingUserStatus.prototype);
MessageBusUserStatus.prototype.constructor = MessageBusUserStatus;


/*=============================================================================

Define MessageBus Helper Functions

=============================================================================*/


module.exports = MessageBus
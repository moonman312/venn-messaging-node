var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")
MessagingError = require('../../messaging_error');
_ = require("underscore")
helpers = require("../../../services/helpers")

function Mandrill(keys){
	this.name = "mandrill"
	this.keys = keys

  this.initialize = function() {
    var mandrill = require('mandrill-api/mandrill')
    this.client = new mandrill.Mandrill(this.keys.api_key);
  }

  this.send = function(data, callback) {
    var context = this
    var mandrillMessage = {
      'html': data.message,
      'subject': data.subject,
      'from_email': data.from,
      'to': [
        {
          'email': data.to,
          'type': 'to'
        }
      ]
    };
    return this.client.messages.send({
      'message': mandrillMessage
    }, (function(result) {
      isSent = _.indexOf(["sent", "queued", "scheduled"], result[0].status) > -1
      if(isSent){
        debug("-_-_ sent with mandrill _-_-");
        result.service = context;
        return callback(null, result);
      } else {
        mesErr = new MessagingError(context.name, result);
        debug("-_-_ FAILED with mandrill _-_-");
        debug(mesErr);
        return callback(mesErr);
      }
    }), function(e) {
      mesErr = new MessagingError(context.name, e);
      debug("-_-_ FAILED with mandrill _-_-");
      debug(mesErr);
      return callback(mesErr);
    });
  }

  this.initialize()
}

Mandrill.prototype = new MessagingServiceProvider()


module.exports = Mandrill
var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")
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
        return callback(null, result, "mandrill");
      } else {
        debug("-_-_ FAILED with mandrill _-_-");
        return callback(result);
      }
    }), function(e) {
      debug("-_-_ FAILED with mandrill _-_-");
      return callback(e);
    });
  }

  this.initialize()
}

Mandrill.prototype = new MessagingServiceProvider()


module.exports = Mandrill
var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")
MessagingStatus = require('../../messaging_status');
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
      var mesStat;
      if(isSent){
        mesStat = MessagingStatus(context.name, result[0], true);
        debug("-_-_ sent with mandrill _-_-");
        result.service = context;
        result.status = mesStat;
        debug(result);
        return callback(null, result);
      } else {
        mesStat = new MessagingStatus(context.name, result[0], false);
        debug("-_-_ FAILED with mandrill _-_-");
        debug(mesStat);
        return callback(mesStat);
      }
    }), function(e) {
      mesStat = new MessagingStatus(context.name, e, false);
      debug("-_-_ FAILED with mandrill _-_-");
      debug(mesStat);
      return callback(mesStat);
    });
  }

  this.initialize()
}

Mandrill.prototype = new MessagingServiceProvider()


module.exports = Mandrill
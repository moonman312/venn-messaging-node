var debug = require('debug')('email');
EmailServiceProvider = require("../../email_service_provider")
_ = require("underscore")
helpers = require("../../../services/helpers")

function Mandrill(keys){
	this.name = "mandrill"
	this.keys = keys

  this.initialize = function() {
    var mandrill = require('mandrill-api/mandrill')
    this.client = new mandrill.Mandrill(this.keys.api_key);
  }

  this.send = function(from, to, subject, message, callback) {
    var mandrillMessage = {
      'html': message,
      'subject': subject,
      'from_email': from,
      'to': [
        {
          'email': to,
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
      // if(!helpers.isEmptyObject(e))console.error(e);
      return callback(e);
    });
  }

  this.initialize()
}

Mandrill.prototype = new EmailServiceProvider()


module.exports = Mandrill
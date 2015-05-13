var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")
MessagingServiceStatus = require('../../messaging_service_status');
MessagingUserStatus = require('../../messaging_user_status');
_ = require("underscore")
helpers = require("../../../services/helpers")

/*=============================================================================

Define Mandrill Service Provider

=============================================================================*/
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
      var mandrillStat;
      if(isSent){
        mandrillStat = new MandrillServiceStatus(result[0], true);
        debug("-_-_ sent with mandrill _-_-");
        result.service = context;
        result.status = mandrillStat;
        debug(result);
        return callback(null, result);
      } else {
        mandrillStat = new MandrillServiceStatus(result[0], false);
        debug("-_-_ FAILED with mandrill _-_-");
        debug(mandrillStat);
        return callback(mandrillStat);
      }
    }), function(e) {
      mandrillStat = new MandrillServiceStatus(e, false);
      debug("-_-_ FAILED with mandrill _-_-");
      debug(mandrillStat);
      return callback(mandrillStat);
    });
  }

  this.initialize()
}

Mandrill.prototype = new MessagingServiceProvider()


/*=============================================================================

Define Mandrill Service Status Handler

=============================================================================*/
function MandrillServiceStatus(response, success) {
  MessagingServiceStatus.call(this, 'mandrill');

  if (success) {
    // Message successfully sent
    this.state.message = response.status;

    // Queued parsing
    this.state.code = (response.status === 'queued' ? this.StatusCodes.QUEUED : this.StatusCodes.SUCCESS);

  } else {
    // There was an error when attempting to send message
    this.state.message = response.name + ': ' + response.message;

    if (response.name === 'PaymentRequired') this.state.code = this.StatusCodes.LIMIT_EXCEEDED;
    else if (response.name === 'GeneralError') this.state.code = this.StatusCodes.SERVICE_DOWN;
    else this.state.code = this.StatusCodes.DEFAULT;
  }
}

MandrillServiceStatus.prototype = Object.create(MessagingServiceStatus.prototype);
MandrillServiceStatus.prototype.constructor = MandrillServiceStatus;


/*=============================================================================

Define Mandrill User Status Handler

=============================================================================*/
function MandrillUserStatus(message, code) {
  MessagingUserStatus.call(this, 'mandrill');

  // Put logic here for handling any possible user errors
}

MandrillUserStatus.prototype = Object.create(MessagingUserStatus.prototype);
MandrillUserStatus.prototype.constructor = MandrillUserStatus;


/*=============================================================================

Define Mandrill Helper Functions

=============================================================================*/


module.exports = Mandrill
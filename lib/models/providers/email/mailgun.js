var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")
MessagingServiceStatus = require('../../messaging_service_status');
MessagingUserStatus = require('../../messaging_user_status');

/*=============================================================================

Define Mailgun Service Provider

=============================================================================*/
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
        var mailgunStat;
        if (err) {
          mailgunStat = new MailgunServiceStatus(err, false);
          debug("-_-_ FAILED with mailgun _-_-");
          debug(mailgunStat);
          return callback(mailgunStat);
        } else {
          mailgunStat = new MailgunServiceStatus(body, true);
          debug("-_-_ sent with mailgun _-_-");
          body.service = context;
          body.status = mailgunStat;
          debug(body);
          return callback(null, body);
        }
      });

  }

  this.initialize()
}

Mailgun.prototype = new MessagingServiceProvider()


/*=============================================================================

Define Mailgun Service Status Handler

=============================================================================*/
function MailgunServiceStatus(response, success) {
  MessagingServiceStatus.call(this, 'mailgun');

  if (success) {
    // Message successfully sent
    this.state.message = response.message;
    this.state.code = this.StatusCodes.SUCCESS;

  } else {
    // There was an error when attempting to send message
    this.state.message = response.message;

    if (this.state.message === 'Message limit reached.') this.state.code = this.StatusCodes.LIMIT_EXCEEDED;
    else this.state.code = this.StatusCodes.DEFAULT;
  }
}

MailgunServiceStatus.prototype = Object.create(MessagingServiceStatus.prototype);
MailgunServiceStatus.prototype.constructor = MailgunServiceStatus;


/*=============================================================================

Define Mailgun User Status Handler

=============================================================================*/
function MailgunUserStatus(message, code) {
  MessagingUserStatus.call(this, 'mailgun');

  // Put logic here for handling any possible user errors
}

MailgunUserStatus.prototype = Object.create(MessagingUserStatus.prototype);
MailgunUserStatus.prototype.constructor = MailgunUserStatus;


/*=============================================================================

Define Mailgun Helper Functions

=============================================================================*/


module.exports = Mailgun
var debug = require('debug')('venn');
MessagingServiceProvider = require("../../messaging_service_provider")
MessagingServiceStatus = require('../../messaging_service_status');
MessagingUserStatus = require('../../messaging_user_status');

/*=============================================================================

Define Postmark Service Provider

=============================================================================*/
function Postmark(keys){
  if (!keys) return
  this.name = "postmark"
  this.keys = keys

  this.initialize = function() {
    var postmark = require("postmark")
    this.client = new postmark.Client(this.keys.server_key);
  }

  this.send = function(data, callback) {
    var context = this;
    this.client.sendEmail({
        "From": data.from, 
        "To": data.to, 
        "Subject": data.subject, 
        "TextBody": data.message
    }, function(err, result) {
        var postmarkStat;
        if(err) {
          postmarkStat = new PostmarkServiceStatus(err, false);
          debug("-_-_ FAILED with postmark _-_-");
          debug(postmarkStat);
          return callback(postmarkStat);
        }
        else {
          postmarkStat = new PostmarkServiceStatus(result, true);
          debug("-_-_ sent with postmark _-_-");
          result.service = context;
          result.status = postmarkStat;
          debug(result);
          return callback(null, result);
        }
    });
  }

  this.initialize()
}

Postmark.prototype = new MessagingServiceProvider()


/*=============================================================================

Define Postmark Service Status Handler

=============================================================================*/
function PostmarkServiceStatus(response, success) {
  MessagingServiceStatus.call(this, 'postmark');

  if (success) {
    // Message successfully sent
    this.message = response.message;
    this.code = this.StatusCodes.SUCCESS;

  } else {
    // There was an error when attempting to send message
    this.message = response.code + ': ' + response.message;

    // See http://developer.postmarkapp.com/developer-api-overview.html for status error codes
    if (response.code == 405) this.code = this.StatusCodes.LIMIT_EXCEEDED;
    else this.code = this.StatusCodes.DEFAULT;
  }
}

PostmarkServiceStatus.prototype = Object.create(MessagingServiceStatus.prototype);
PostmarkServiceStatus.prototype.constructor = PostmarkServiceStatus;


/*=============================================================================

Define Postmark User Status Handler

=============================================================================*/
function PostmarkUserStatus(message, code) {
  MessagingUserStatus.call(this, 'postmark');

  // Put logic here for handling any possible user errors
}

PostmarkUserStatus.prototype = Object.create(MessagingUserStatus.prototype);
PostmarkUserStatus.prototype.constructor = PostmarkUserStatus;


/*=============================================================================

Define Postmark Helper Functions

=============================================================================*/


module.exports = Postmark
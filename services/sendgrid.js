var h, sendgridService, v;

sendgridService = {};

sendgridService.sendEmail = function(keys, from, to, subject, message, callback) {
  var sendgrid = require('sendgrid')(keys.required.api_user, keys.required.api_key);
  return sendgrid.send({
    to: to,
    from: from,
    subject: subject,
    text: message
  }, function(err, result) {
    if (err) {
      console.info("-_-_ FAILED with sendgrid _-_-");
      return callback(err);
    } else {
      console.info("-_-_ sent with sendgrid _-_-");
      return callback(null, result);
    }
  });
};

module.exports = sendgridService;
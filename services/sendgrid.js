var h, sendgridService, v;

sendgridService = {};

sendgridService.sendEmail = function(from, to, subject, message, callback) {
  var sendgrid;
  sendgrid = require('sendgrid')('venn-email', 'Password123');
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
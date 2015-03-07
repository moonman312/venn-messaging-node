_ = require("underscore");
async = require("async");
sendgridService = require("../services/sendgrid");
mandrillService = require("../services/mandrill");

var EmailClient = function() {
  this.services = {
    sendgrid: {
      keys: {
        required: {
          api_user: undefined,
          api_key: undefined
        }
      },
      send: 'sendSendgrid',
      priority: undefined
    },
    mandrill: {
      keys: {
        required: {
          api_key: undefined
        }        
      },
      send: 'sendMandrill',
      priority: undefined
    }
  }
  this.from = undefined
};

EmailClient.prototype.configureMandrill = function(api_key, priority) {
  this.services.mandrill.priority = priority;
  this.services.mandrill.keys.required.api_key = api_key;
}

EmailClient.prototype.configureSendgrid = function(api_user, api_key, priority) {
  this.services.sendgrid.priority = priority;
  this.services.sendgrid.keys.required.api_user = api_user;
  this.services.sendgrid.keys.required.api_key = api_key;
}
 
EmailClient.prototype.setFrom = function(from) {
  this.from = from;
}

EmailClient.prototype.sendSendgrid = function(from, to, subject, msg, callback) {
  sendgridService.sendEmail(this.services.sendgrid.keys, from, to, subject, msg, function(err, results){
    callback(err, results);
  });
}

EmailClient.prototype.sendMandrill = function(from, to, subject, msg, callback) {
  mandrillService.sendEmail(this.services.mandrill.keys, from, to, subject, msg, function(err, results){
    callback(err, results);
  });
}

EmailClient.prototype.buildClient = function() {
  return _.sortBy(this.services, function(o) {
    return o.priority; 
  })
}

EmailClient.prototype.send = function(to, subject, message, callback) {
  services = this.buildClient();
  console.log("= = = = = = = = sending = = = = = = = =");
  context = this;
  from = this.from;
  async.eachSeries(services, function(service, cb){
    context[service["send"]](from, to, subject, message, function(err, result){
      if(result) return callback(err, "nice");;
      return cb(null, null);
    });
  }, function(err){
    return callback(err, "nice");
  });
}

module.exports = new EmailClient();
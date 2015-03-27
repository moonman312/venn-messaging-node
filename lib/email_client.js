var debug = require('debug')('email')
var _ = require("underscore")
var async = require("async")
var sendgridService = require("../services/sendgrid")
var mandrillService = require("../services/mandrill")
var request = require("request")

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
 
EmailClient.prototype.setDefaultFrom = function(from) {
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

EmailClient.prototype.initialize = function initialize(vennkey) {
  console.log("vennkey", vennkey)
  var data = {
    "slug": "email",
    "appId": vennkey
  }
  console.log("datadata", data)
  request({
    url: "http://api.getvenn.io/v1/keys",
    method: "POST",
    body: data,
    json: true
  },
  function (error, response, body) {
    if(isEmpty(body)){
      console.log("XOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOX");
      console.log("Venn Email not initalized. Please ensure you have active integrations in your dashboard and that your API Key is correct.");
      console.log("XOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOX");
    } else {
      console.log("body", body);
    }
  })
}

EmailClient.prototype.send = function(to, subject, message, callback) {
  services = this.buildClient();
  debug("= = = = = = = = sending = = = = = = = =");
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

isEmpty = function(obj) {
  console.log("obj")
  console.log(obj)
  return JSON.stringify(obj) === '{}'
}

module.exports = new EmailClient();
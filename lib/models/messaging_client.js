var debug = require('debug')('venn');
var vennApiService = require("../services/venn_api")
var Mandrill = require("./providers/email/mandrill")
var Sendgrid = require("./providers/email/sendgrid")
var Mailgun = require("./providers/email/mailgun")
var MessageBus = require("./providers/email/messagebus")
var Postmark = require("./providers/email/postmark")
var Twilio = require("./providers/sms/twilio")
var Nexmo = require("./providers/sms/nexmo")
var Parse = require("./providers/push/parse")
var Pushwoosh = require("./providers/push/pushwoosh")
var Q = require("q")
var async = require("async")
var helpers = require("../services/helpers")

function MessagingClient(type) {
  this.services = {}
  this.type = type
  this.sendLog = []

  // TODO this should be private
  this.initServices = function(keys) {
    var context = this
    for (var property in keys) {
      messagingProvider = undefined
      if(property === "mandrill" && keys[property]) messagingProvider = new Mandrill(keys[property])
      else if(property === "sendgrid" && keys[property]) messagingProvider = new Sendgrid(keys[property])
      else if(property === "mailgun" && keys[property]) messagingProvider = new Mailgun(keys[property])
      else if(property === "messagebus" && keys[property]) messagingProvider = new MessageBus(keys[property])
      else if(property === "postmark" && keys[property]) messagingProvider = new Postmark(keys[property])
      else if(property === "twilio" && keys[property]) messagingProvider = new Twilio(keys[property])
      else if(property === "nexmo" && keys[property]) messagingProvider = new Nexmo(keys[property])
      else if(property === "parse" && keys[property]) messagingProvider = new Parse(keys[property])
      else if(property === "pushwoosh" && keys[property]) messagingProvider = new Pushwoosh(keys[property])
      if(messagingProvider) context.services[property] = messagingProvider
    }
    return context
  }


  this.sortServices = function(callback) {
    var context = this
    vennApiService.getPriority( this.getApiKey(), context.type, function(err, servicesOrdered) {

      // in case priorities dont return, just leave them as is
      if(!servicesOrdered || !servicesOrdered.length){
        return callback(null)
      }

      servicesReordered = {}
      for (i = 0; i < servicesOrdered.length; i++) {
        serviceName = servicesOrdered[i]
        servicesReordered[serviceName] = context.services[serviceName]
      }
      context.services = servicesReordered

      return callback(null, context.services)
    });
  }

  this.sendRedundantly = function(data, callback) {
    var context = this
    servicesLength = helpers.objectToArray(context.services).length
    async.eachSeries(helpers.objectToArray(context.services), function(service, cb){
      if (!service) return cb();
      var i = helpers.objectToArray(context.services).indexOf(service);
      service.send(data, function(err, result){
        if(result) {
          sendLog.push(result.status)
          return callback(null, result.service.name);
        } else {
          sendLog.push(err)
          return cb();
        }
      });
    }, function(err){
      return callback(err);
    });
  }

  this.getApiKey = function() { return this.apiKey }

  this.initialize = function(apiKey) {
    apiKey = process.env.VENN_API_KEY || apiKey;
    if(!apiKey) return console.error("No Venn API Key provided!")
    this.apiKey = apiKey
  }

  this.send = function(data, callback) {
    var context = this
    sendLog = []
    context.services = {}
    if(!context.apiKey) return debug("No valid API Key provided! Can't send!")
    vennApiService.getKeys( context.apiKey, context.type, function(err, keys) {
        context.initServices(keys)
        context.sortServices(function(){
          debug("ordered context.services", context.services)
          context.sendRedundantly(data, function(err, result){
            if(err) return callback( err );
            vennApiService.postLog(context.apikey, sendLog, function() { /* Nothing to do */});
            return callback( null, {"service": result} );
          })
        })
    })
  }

}

module.exports = MessagingClient;

var debug = require('debug')('email');
var vennApiService = require("../services/venn_api")
var Mandrill = require("./providers/email/mandrill")
var Sendgrid = require("./providers/email/sendgrid")
var Mailgun = require("./providers/email/mailgun")
var MessageBus = require("./providers/email/messagebus")
var Postmark = require("./providers/email/postmark")
var Twilio = require("./providers/sms/twilio")
var Nexmo = require("./providers/sms/nexmo")
var Q = require("q")
var async = require("async")
var helpers = require("../services/helpers")

function EmailClient() {
  this.services = {}

  // TODO this should be private
  this.initServices = function(keys) {
    var context = this
    for (var property in keys) {
      emailProvider = undefined
      if(property === "mandrill" && keys[property]) emailProvider = new Mandrill(keys[property])
      else if(property === "sendgrid" && keys[property]) emailProvider = new Sendgrid(keys[property])
      else if(property === "mailgun" && keys[property]) emailProvider = new Mailgun(keys[property])
      else if(property === "messagebus" && keys[property]) emailProvider = new MessageBus(keys[property])
      else if(property === "postmark" && keys[property]) emailProvider = new Postmark(keys[property])
      else if(property === "twilio" && keys[property]) emailProvider = new Twilio(keys[property])
      else if(property === "nexmo" && keys[property]) emailProvider = new Nexmo(keys[property])
      if(emailProvider) context.services[property] = emailProvider
    }
    return context
  }


  this.sortServices = function(callback) {
    var context = this
    vennApiService.getPriority( this.getApiKey(), function(err, servicesOrdered) {

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

  this.sendRedundantly = function(from, to, subject, message, callback) {
    var context = this
    async.eachSeries(helpers.objectToArray(context.services), function(service, cb){
      if(service) {
        service.send(from, to, subject, message, function(err, result, service){
          if(result) return callback(err, service);;
          return cb(null, null);
        });
      } else {
        return cb(null, null);
      }
    }, function(err){
      return callback(err, "not sent :(");
    });
  }

  this.getApiKey = function() { return this.apiKey }

  this.initialize = function(apiKey) {
    apiKey = process.env.VENN_API_KEY || apiKey;
    if(!apiKey) return console.error("No Venn API Key provided!")
    this.apiKey = apiKey
  }

  this.send = function(from, to, subject, message, callback) {
    var context = this
    context.services = {}
    if(!context.apiKey) return debug("No valid API Key provided! Can't send!")
    vennApiService.getKeys( context.apiKey, function(err, keys) {
        context.initServices(keys)
        context.sortServices(function(){
          debug("ordered context.services", context.services)
          context.sendRedundantly(from, to, subject, message, function(err, result){
            if(err) return callback( {"error": err} )
            return callback( null, {"service": result} )
          })
        })
    })
  }

  this.sendSMS = function(from, to, subject, message, callback) {
    var context = this
    context.services = {}
    if(!context.apiKey) return debug("No valid API Key provided! Can't send!")
    vennApiService.getKeys( context.apiKey, function(err, keys) {
        context.initServices(keys)
        context.sortServices(function(){
          debug("ordered context.services", context.services)
          context.sendRedundantly(from, to, subject, message, function(err, result){
            if(err) return callback( {"error": err} )
            return callback( null, {"service": result} )
          })
        })
    })
  }

}

module.exports = EmailClient;

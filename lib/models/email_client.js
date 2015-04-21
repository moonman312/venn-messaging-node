var debug = require('debug')('email');
var vennApiService = require("../services/venn_api")
var Mandrill = require("./providers/mandrill")
var Sendgrid = require("./providers/sendgrid")
var Q = require("q")
var async = require("async")
var helpers = require("../services/helpers")

function EmailClient() {
  this.services = {}
	this.configured = false

  // TODO this should be private
  this.configureServices = function(keys) {
    var context = this
    for (var property in keys) {
      emailProvider = undefined
      if(property === "mandrill") emailProvider = new Mandrill(keys[property])
      else if(property === "sendgrid") emailProvider = new Sendgrid(keys[property])
      if(emailProvider) context.services[property] = emailProvider
    }
    debug("inited services: ")
    debug(context.services)
    for (var property in this.services) {
      service = context.services[property]
      if(service && service.initialize) service.initialize()
    }
    this.configured = true
    return this
  }


  this.sortServices = function(callback) {
    var context = this
    // debug(this.getApiKey())
    vennApiService.getPriority( this.getApiKey(), function(err, servicesOrdered) {
      debug("order should be: ")
      debug("  "+servicesOrdered)

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
    debug("about to send: ")
    debug(context.services)
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
    this.apiKey = apiKey;
  }

  this.send = function(from, to, subject, message, callback) {
    var context = this
    // if (!this.configured) {
    vennApiService.getKeys( this.apiKey, function(err, keys) {
        debug("keys:", keys)
        context.configureServices(keys)
        debug("services:", context.services)
        debug("-=+~ Venn Email initialized -=+~")
        // TODO ugly, duplicated code
        context.sortServices(function(){
          context.sendRedundantly(from, to, subject, message, function(err, result){
            debug("successfully sent with", result)
            return callback(null, result)
          })
        })
    } )
    // } else {

    // }

  
  }

}







module.exports = EmailClient;

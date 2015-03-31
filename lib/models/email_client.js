var debug = require('debug')('email');
var vennApiService = require("../services/venn_api")
var Mandrill = require("./providers/mandrill")
var Sendgrid = require("./providers/sendgrid")
var Q = require("q")
var async = require("async")
var helpers = require("../services/helpers")

function EmailClient() {
	this.services = {}

  // TODO this should be private
  this.configureServices = function(object) {
    var context = this
    for (var property in object) {
      emailProvider = {}
      if(property === "mandrill") emailProvider = new Mandrill(object[property])
      else if(property === "sendgrid") emailProvider = new Sendgrid(object[property])
      context.services[property] = emailProvider
    }
    for (var property in this.services) {
      context.services[property].initialize()
    }
  }


  this.sortServices = function(callback) {
    var context = this
    // debug(this.getApiKey())
    vennApiService.getPriority( this.getApiKey(), function(err, servicesOrdered) {
      debug("order should be: ")
      debug("  "+servicesOrdered)
      servicesReordered = {}
      for (i = 0; i < servicesOrdered.length; i++) {
        serviceName = servicesOrdered[i]
        servicesReordered[serviceName] = context.services[serviceName]
      }
      context.services = servicesReordered
      // debug services are in correct order
      debug("actual order:")
      i = 0
      for (var service in context.services) {
        debug( "  priority "+i+ ":" + context.services[service].name )
        i++
      }
      return callback(null, context.services)
    });
  }

  this.sendRedundantly = function(from, to, subject, message, callback) {
    var context = this
    async.eachSeries(helpers.objectToArray(context.services), function(service, cb){
      service.send (from, to, subject, message, function(err, result, service){
        if(result) return callback(err, service);;
        return cb(null, null);
      });
    }, function(err){
      return callback(err, "not sent :(");
    });
  }
}



EmailClient.prototype.getApiKey = function() { return this.apiKey }

EmailClient.prototype.initialize = function(apiKey) {
  var deferred = Q.defer();
  this.apiKey = apiKey;
  var context = this;
  vennApiService.getKeys( apiKey, function(err, keys) {
    context.configureServices(keys)
    deferred.resolve();
    debug("-=+~ Venn Email initialized -=+~")
  })
  return deferred.promise;
}

EmailClient.prototype.send = function(from, to, subject, message, callback) {
  var context = this
  this.sortServices(function(){
    context.sendRedundantly(from, to, subject, message, function(err, result){
      debug("successfully sent with", result)
      return callback(null, result)
    })
  })
}



module.exports = EmailClient;
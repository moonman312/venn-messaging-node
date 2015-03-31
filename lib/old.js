var debug = require('debug')('email')
var _ = require("underscore")
var async = require("async")
var vennApiService = require("../services/venn_api")
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
      configure: 'configureSendgrid',
      client: undefined,
      priority: undefined
    },
    mandrill: {
      keys: {
        required: {
          api_key: undefined
        }        
      },
      send: 'sendMandrill',
      configure: 'configureMandrill',
      client: undefined,
      priority: undefined
    }
  }
  this.api_key = undefined
};

EmailClient.prototype.configureServices = function(object) {
  var context = this
  for (var property in object) {
    for (var key in object[property]) {
      this.services[property].keys.required[key] = object[property][key]
    }
  }
  for (var property in object) {
    context[this.services[property]["configure"]]()
  }

}

EmailClient.prototype.configureMandrill = function(data, priority) {
  var mandrill = require('mandrill-api/mandrill')
  this.services["mandrill"].client = new mandrill.Mandrill(this.services["mandrill"].keys.required.api_key);
}

EmailClient.prototype.configureSendgrid = function(data, priority) {
  this.services["sendgrid"].client = require('sendgrid')(this.services["sendgrid"].keys.required.api_user, this.services["sendgrid"].keys.required.api_key);
}
 
EmailClient.prototype.setDefaultFrom = function(from) {
  this.from = from;
}

EmailClient.prototype.setApiKey = function(api_key) {
  this.api_key = api_key;
}

EmailClient.prototype.getApiKey = function() {
  return this.api_key;
}

EmailClient.prototype.getSendgridClient = function() {
  return this.services["sendgrid"].client;
}

EmailClient.prototype.getMandrillClient = function() {
  return this.services["mandrill"].client;
}

EmailClient.prototype.sendSendgrid = function(from, to, subject, msg, callback) {
  return this.getSendgridClient().send({
    to: to,
    from: from,
    subject: subject,
    text: msg
  }, function(err, result) {
    debug("sendgrid result")
    debug(result)
    if (err) {
      debug("-_-_ FAILED with sendgrid _-_-");
      return callback(err);
    } else {
      debug("-_-_ sent with sendgrid _-_-");
      return callback(null, result, "sendgrid");
    }
  });
}

EmailClient.prototype.sendMandrill = function(from, to, subject, msg, callback) {
  var mandrillMessage = {
    'html': msg,
    'subject': subject,
    'from_email': from,
    'to': [
      {
        'email': to,
        'type': 'to'
      }
    ]
  };
  return this.getMandrillClient().messages.send({
    'message': mandrillMessage
  }, (function(result) {
    debug("mandrill result")
    debug(result)
    isSent = _.indexOf(["sent", "queued", "scheduled"], result[0].status) > -1
    if(isSent){
      debug("-_-_ sent with mandrill _-_-");
      return callback(null, result, "mandrill");
    } else {
      debug("-_-_ FAILED with mandrill _-_-");
      return callback(result);
    }
  }), function(e) {
    debug("-_-_ FAILED with mandrill _-_-");
    console.error(e);
    return callback(e);
  });
}



EmailClient.prototype.initialize = function(apiKey) {
  var Q = require("q")
  var deferred = Q.defer();

  debug("2")
  var context = this;
  context.setApiKey(apiKey);
  vennApiService.getKeys( apiKey, function(err, keys) {
    context.configureServices(keys)
    debug("3")
    deferred.resolve('hello world');
  })

  return deferred.promise;
}

// EmailClient.prototype.initialize2 = function initialize(apiKey) {
//   // this.initialize(apiKey).then(function(val) {
//   //   return
//   // });
// }

// // EmailClient.prototype.initialize3 = function initialize(apiKey) {
// //   var Promise = require('promise');
// //   var promise = new Promise(function (resolve, reject) {
// //     vennApiService.getKeys( apiKey, function(err, keys) {
// //       debug("3")
// //       if (err) reject(err);
// //       else resolve(keys);
// //     });
// //   });
// // }

EmailClient.prototype.send = function(from, to, subject, message, callback) {
  debug("= = = = = = = = sending = = = = = = = =");
  context = this;
  vennApiService.getPriority( this.getApiKey(), function(err, servicesOrdered) {
    async.eachSeries(servicesOrdered, function(service, cb){
      var sendFunction = context.services[service]["send"];
      context[sendFunction](from, to, subject, message, function(err, result, service){
        if(result) return callback(err, service);;
        return cb(null, null);
      });
    }, function(err){
      return callback(err, "nice");
    });
  })

}

module.exports = new EmailClient();
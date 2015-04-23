var debug = require('debug')('email');
vennApiService = {};
var request = require("request");

vennApiService.getKeys = function(apikey, callback) {
  request({
    url: "https://api.getvenn.io/v1/keys",
    method: "GET",
    useQuerystring: true,
    qs: {type: "email"},
    json: true,
    headers: {
      "venn-api-key": apikey
    }
  },
  function (error, response, body) {
    callback(null, body);
  });

};

vennApiService.getPriority = function(apikey, callback) {
  request({
    url: "https://api.getvenn.io/v1/priority",
    method: "GET",
    useQuerystring: true,
    qs: {type: "email"},
    json: true,
    headers: {
      "venn-api-key": apikey
    }
  },
  function (error, response, body) {
    debug("priority should be:")
    debug(body)
    callback(null, body);
  });

};


module.exports = vennApiService;
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
    console.log("keys:", body)
    callback(null, body);
  });

};

vennApiService.getPriority = function(apikey, callback) {
    debug("apikey")
    debug(apikey)
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
    debug(error)
    debug(response.statusCode)
    callback(null, body);
  });

};


module.exports = vennApiService;
var debug = require('debug')('venn');
vennApiService = {};
var request = require("request");
var url = process.env.VENN_API_URL || "https://api.getvenn.io/v1"

vennApiService.getKeys = function(apikey, callback) {
  request({
    url: url + "/keys",
    method: "GET",
    useQuerystring: true,
    qs: {type: "email"},
    json: true,
    headers: {
      "venn-api-key": apikey
    }
  },
  function (error, response, body) {
    debug("getKeys", body)
    callback(null, body);
  });

};

vennApiService.getPriority = function(apikey, callback) {
  request({
    url: url + "/priority",
    method: "GET",
    useQuerystring: true,
    qs: {type: "email"},
    json: true,
    headers: {
      "venn-api-key": apikey
    }
  },
  function (error, response, body) {
    debug("priority should be:", body)
    callback(null, body);
  });

};


module.exports = vennApiService;
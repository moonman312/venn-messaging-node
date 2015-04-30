var debug = require('debug')('venn');
vennApiService = {};
var request = require("request");
var url = process.env.VENN_API_URL || "https://api.getvenn.io/v1"

vennApiService.getKeys = function(apikey, type, callback) {
  request({
    url: url + "/keys/" + type,
    method: "GET",
    json: true,
    headers: {
      "venn-api-key": apikey
    }
  },
  function (error, response, body) {
    debug("getKeys:", body)
    callback(null, body);
  });

};

vennApiService.getPriority = function(apikey, type, callback) {
  request({
    url: url + "/priority/" + type,
    method: "GET",
    json: true,
    headers: {
      "venn-api-key": apikey
    }
  },
  function (error, response, body) {
    debug("getPriority:", error)
    debug("getPriority:", body)
    callback(null, body);
  });

};


module.exports = vennApiService;
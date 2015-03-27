
var request = require("request")

// exports.initialize = function initialize(vennkey) {
// 	console.log("vennkey", vennkey)
// 	var data = {
// 		"slug": "email",
// 		"appId": vennkey
// 	}
// 	console.log("datadata", data)
// 	request({
// 		url: "http://api.getvenn.io/v1/keys",
// 		method: "POST",
// 		body: data,
// 		json: true
// 	},
// 	function (error, response, body) {
// 		console.log("body", body);
// 	})
// }

// module.exports = exports

module.exports = require('./email_client')
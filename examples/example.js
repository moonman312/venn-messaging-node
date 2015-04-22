var debug = require('debug')('email');
var email = require("../lib/index");

email.initialize()
email.send("from@email.com", "timmyg13@gmail.com", "subject-1", "message-1", function(err, result){
	console.info("send with:", result);
})

var debug = require('debug')('email');
var email = require("../lib/index");

email.initialize()
var data = {
	from: "from@email.com",
	to: "testy@email.com",
	subject: "subject-1",
	message: "message-1"
}
email.send(data, function(err, result){
	console.info("send with:", result);
})

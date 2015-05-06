var debug = require('debug')('venn');
var Email = require("../lib/index").Email;

Email.initialize()
var data = {
	from: "from@venn.com",
	to: "testy@venn.com",
	subject: "subject-1",
	message: "message-1"
}
/*Email.send(data, function(err, result){
	console.info("sent with:", result);
})*/

// Testing
exceedLimit = function (count) {

	var mail = {
		from: 'from@venn.com',
		to: 'nathan@getvenn.io',
		subject: 'subject-' + count.toString(),
		message: 'message-' + count.toString()
	}

	console.log(count.toString());

	Email.send(mail, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			console.info('sent with:', result);
		}
	})

	if (count < 300) {
		setTimeout(function() {
			exceedLimit(count + 1)
		}, 1000)
	}
}
exceedLimit(300);
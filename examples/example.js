var debug = require('debug')('venn');
var venn = require("../lib/index").Email;

venn.initialize()
var data = {
	from: "from@venn.com",
	to: "testy@venn.com",
	subject: "subject-1",
	message: "message-1"
}
venn.send(data, function(err, result){
	console.info("send with:", result);
})

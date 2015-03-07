EmailClient = require("../lib/index");

emailClient = new EmailClient();
emailClient.setFrom("from@email.com");
emailClient.configureSendgrid("sendgrid1", "sendgrid2", 1);
emailClient.configureMandrill("mandrill1", 2);

emailClient.send("timmyg13@gmail.com", "subj", "msg", function(err, result){
	console.info("done");
});
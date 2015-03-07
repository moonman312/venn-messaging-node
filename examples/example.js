EmailClient = require("../lib/index");

emailClient = new EmailClient();
emailClient.setFrom("from@email.com");
emailClient.configureSendgrid("venn-email", "Password123", 1);
emailClient.configureMandrill("aNdLxLa4xFG4JR-wpeMklw", 2);

emailClient.send("timmyg13@gmail.com", "subj", "msg", function(err, result){
	// console.info("done");
});
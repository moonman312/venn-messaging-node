var debug = require('debug')('email');

var emailClient = require("../lib/index");

emailClient.setDefaultFrom("from@email.com");
emailClient.configureSendgrid("venn-email", "Password123", 2);
emailClient.configureMandrill("aNdLxLa4xFG4JR-wpeMklw", 1);

emailClient.send("test@email.com", "subj", "msg", function(err, result){
	debug("done");
});
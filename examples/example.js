var debug = require('debug')('email');
var emailClient = require("../lib/index");

emailClient.initialize("64d2fa2b73f6f7cc61a4b3e8")
emailClient.send("from@email.com", "somedude@company.co", "subject-1", "message-1", function(err, result){})

var debug = require('debug')('email');
var emailClient = require("../lib/index");

emailClient.initialize("6644bb87bcd7fceb2cd53436")
emailClient.send("from@email.com", "somedude@company.co", "subject-1", "message-1", function(err, result){})

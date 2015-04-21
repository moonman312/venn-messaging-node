var debug = require('debug')('email');
var email = require("../lib/index");

email.initialize("6644bb87bcd7fceb2cd53436")
email.send("from@email.com", "somedude@company.co", "subject-1", "message-1", function(err, result){})

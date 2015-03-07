## Venn Places

#### example
```
EmailClient = require("venn-email");
emailClient = new EmailClient();
emailClient.setFrom("from@email.com");
emailClient.configureSendgrid("sendgrid1", "sendgrid2", 3);
emailClient.configureMandrill("mandrill1", 2);

emailClient.send("timmyg13@gmail.com", "subj", "msg", function(err, result){
	console.info("done");
});
```
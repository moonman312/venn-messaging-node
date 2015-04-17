var assert = require("assert")
var nock = require("nock")
var emailClient = require("../lib/index");
var env = process.env

describe('when services up', function(){

	it('should send with mandrill suggested first', function(done){
		nock('http://api.getvenn.io/v1')
			.get('/keys?type=email')
			.reply(200, {
				"sendgrid": {
					"api_user": process.env.SENDGRID_API_USER,
					"api_key": process.env.SENDGRID_API_KEY
				},
				"mandrill": {
					"api_key": process.env.MANDRILL_API_KEY
				}
			});
		nock('https://mandrillapp.com/api/1.0')
			.post('/messages/send.json')
			.reply(200, [{"status": "sent"}] );
		nock('https://api.sendgrid.com/api')
			.post('/mail.send.json')
			.reply(200, {"message": "success"});
		nock('http://api.getvenn.io/v1')
			.get('/priority?type=email')
			.reply(200, [ "mandrill", "sendgrid"]);

		emailClient.initialize("64d2fa2b73f6f7cc61a4b3e8")
		emailClient.send("from@email.com", "timmyg13@gmail.com", "subject-1", "message-1", function(err, result){
			assert.equal(result, "mandrill");
			assert.equal(Object.keys(emailClient.services).length, 2);
			done()
		})
	})

	it('should send with sendgrid suggested first', function(done){
	nock('http://api.getvenn.io/v1')
		.get('/keys?type=email')
		.reply(200, {
			"sendgrid": {
				"api_user": "venn-email2",
				"api_key": "Password123"
			},
			"mandrill": {
				"api_key": "aNdLxLa4xFG4JR-wpeMklw"
			}
		});
		nock('https://mandrillapp.com/api/1.0')
			.post('/messages/send.json')
			.reply(200, [{"status": "sent"}] );
		nock('https://api.sendgrid.com/api')
			.post('/mail.send.json')
			.reply(200, {"message": "success"});
		nock('http://api.getvenn.io/v1')
			.get('/priority?type=email')
			.reply(200, [ "sendgrid", "mandrill" ]);
		emailClient.initialize("64d2fa2b73f6f7cc61a4b3e8")
		emailClient.send("from@email.com", "timmyg13@gmail.com", "subject-1", "message-1", function(err, result){
			assert.equal(result, "sendgrid");
			done()
		})
	})
})
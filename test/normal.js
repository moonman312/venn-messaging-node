var assert = require("assert")
var nock = require("nock")
var emailClient = require("../lib/index");

describe('when services up', function(){

	it('should send with mandrill suggested first', function(done){
		nock('https://api.getvenn.io/v1')
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
		nock('https://api.getvenn.io/v1')
			.get('/priority?type=email')
			.reply(200, [ "mandrill", "sendgrid"]);

		emailClient.initialize(process.env.VENN_API_KEY)
		emailClient.send("from@email.com", "timmyg13@gmail.com", "subject-1", "message-1", function(err, result){
			assert.equal(result.service, "mandrill");
			assert.equal(Object.keys(emailClient.services).length, 2);
			done()
		})
	})

	it('should send with sendgrid suggested first', function(done){
	nock('https://api.getvenn.io/v1')
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
		nock('https://api.getvenn.io/v1')
			.get('/priority?type=email')
			.reply(200, [ "sendgrid", "mandrill" ]);
		emailClient.initialize(process.env.VENN_API_KEY)
		emailClient.send("from@email.com", "timmyg13@gmail.com", "subject-1", "message-1", function(err, result){
			assert.equal(result.service, "sendgrid");
			done()
		})
	})

	it('should send with mailgun suggested first', function(done){
		nock('https://api.getvenn.io/v1')
			.get('/keys?type=email')
			.reply(200, {
				"sendgrid": {
					"api_user": process.env.SENDGRID_API_USER,
					"api_key": process.env.SENDGRID_API_KEY
				},
				"mandrill": {
					"api_key": process.env.MANDRILL_API_KEY
				},
				"mailgun": {
					"api_key": process.env.MAILGUN_API_KEY,
					"domain": process.env.MAILGUN_DOMAIN
				}
			});
		nock('https://mandrillapp.com/api/1.0')
			.post('/messages/send.json')
			.reply(200, [{"status": "sent"}] );
		nock('https://api.sendgrid.com/api')
			.post('/mail.send.json')
			.reply(200, {"message": "success"});
		nock('https://api.mailgun.net/v2')
			.post('/messages')
			.reply(200, {"message": "success"});
		// nock('https://api.mailgun.net').filteringPath(function(path) {
		// 	return '/';
		// }).get('/').reply(200, {});
		nock('https://api.getvenn.io/v1')
			.get('/priority?type=email')
			.reply(200, [ "mailgun", "mandrill" ]);
		emailClient.initialize(process.env.VENN_API_KEY)
		emailClient.send("from@email.com", "timmyg13@gmail.com", "subject-1", "message-1", function(err, result){
			assert.equal(result.service, "mailgun");
			done()
		})
	})

})
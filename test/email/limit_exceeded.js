var assert = require('assert');
var nock = require('nock');
var emailClient = require("../../lib/index").Email;

describe('email services should provide feedback when user exceeds sending limit', function() {

	it('should catch a limit exceeded error from Sendgrid', function(done) {
		nock('https://api.getvenn.io/v1')
			.get('/keys/email')
			.reply(200, {
			"sendgrid": {
				"api_user": 'user',
				"api_key": 'key'
			}
		});
		nock('https://api.sendgrid.com/api')
			.post('/mail.send.json')
			.reply(400, {"message": "error", "errors": ["Maximum credits exceeded"]});
		nock('https://api.getvenn.io/v1')
			.get('/priority/email')
			.reply(200, ["sendgrid"]);
		emailClient.initialize()
		emailClient.send({from:"from@email.com", to:"testy@email.com", subject:"subject-1", message:"message-1"}, function(err, result){
			assert.equal(err.code, 'LIMIT_EXCEEDED');
			done()
		})
	})

	it('should catch a limit exceeded error from Mailgun', function(done) {
		nock('https://api.getvenn.io/v1')
			.get('/keys/email')
			.reply(200, {
			"sendgrid": {
				"api_user": 'user',
				"api_key": 'key'
			}
		});
		nock('https://api.mailgun.net/v2')
			.post('/messages')
			.reply(400, {"message": "error", "errors": ["Message limit reached."]});
		nock('https://api.getvenn.io/v1')
			.get('/priority/email')
			.reply(200, ["mailgun"]);
		emailClient.initialize()
		emailClient.send({from:"from@email.com", to:"testy@email.com", subject:"subject-1", message:"message-1"}, function(err, result){
			assert.equal(err.code, 'LIMIT_EXCEEDED');
			done()
		})
	})
})
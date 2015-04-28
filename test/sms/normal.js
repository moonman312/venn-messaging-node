var assert = require("assert")
var nock = require("nock")
var client = require("../../lib/index");

describe('when sms services up', function(){

	it('should send with twilio when suggested first', function(done){
		nock.cleanAll()
		nock('https://api.getvenn.io/v1')
			.get('/keys?type=email')
			.reply(200, {
				"twilio": {
					"account_sid": "sldkfjdslkjf",
					"auth_token": "sldkfjdslkjf"
				},
				"nexmo": {
					"api_key": "sldkfjdslkjf",
					"api_secret": "sldkfjdslkjf"
				}
			});
		nock('https://api.twilio.com/2010-04-01')
			.post('')
			.reply(200, [{"status": "sent"}] );
		nock('https://rest.nexmo.com/sms/json')
			.post('')
			.reply(200, {"message": "success"});
		nock('https://api.getvenn.io/v1')
			.get('/priority?type=email')
			.reply(200, [ "twilio", "nexmo"]);

		client.initialize()
		client.send("from@email.com", "testy@email.com", "subject-1", "message-1", function(err, result){
			assert.equal(result.service, "twilio");
			assert.equal(Object.keys(client.services).length, 2);
			done()
		})
	})

})
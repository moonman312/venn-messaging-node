var assert = require("assert")
var nock = require("nock")
var client = require("../../lib/index").SMS;

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
		nock('https://api.twilio.com:443')
			.post('/2010-04-01/Accounts/sldkfjdslkjf/Messages.json')
			.reply(201, [{"status": "sent"}] );
		nock('https://rest.nexmo.com/sms/json')
			.post('')
			.reply(200, {"message": "success"});
		nock('https://api.getvenn.io/v1')
			.get('/priority?type=email')
			.reply(200, [ "twilio", "nexmo"]);

		client.initialize()
		client.send({from:"+15138853322", to:"+15138853322", message:"message-13579"}, function(err, result){
			assert.equal(result.service, "twilio");
			assert.equal(Object.keys(client.services).length, 2);
			done()
		})
	})


	it('should send with nexmo when suggested first', function(done){
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
		// nock.enableNetConnect('api.twilio.com');
		nock('https://api.twilio.com:443')
			.post('/2010-04-01/Accounts/sldkfjdslkjf/Messages.json')
			.reply(201, [{"status": "sent"}] );
		nock('https://rest.nexmo.com')
			.post('/sms/json?&api_key=sldkfjdslkjf&api_secret=sldkfjdslkjf')
			.reply(200, {"message": "success"});
		nock('https://rest.nexmo.com')
			.post('/sms/json?from=%2B15138853322&to=%2B15138853322&text=message-13579&api_key=sldkfjdslkjf&api_secret=sldkfjdslkjf')
			.reply(200, {"message": "success"});
		nock('https://api.getvenn.io/v1')
			.get('/priority?type=email')
			.reply(200, ["nexmo", "twilio"]);

		client.initialize()
		client.send({from:"+15138853322", to:"+15138853322", message:"message-13579"}, function(err, result){
			assert.equal(result.service, "nexmo");
			assert.equal(Object.keys(client.services).length, 2);
			done()
		})
	})

})
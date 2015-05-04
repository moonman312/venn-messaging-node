var assert = require("assert")
var nock = require("nock")
var emailClient = require("../../lib/index").SMS;

describe('sending an sms should fallback', function(){

		it('to nexmo when twilio down', function(done){
			nock.cleanAll()
			nock('https://api.getvenn.io/v1')
				.get('/keys/sms')
				.reply(200, {
					"twilio": {
						"account_sid": "sldkfjdslkjf",
						"auth_token": "sldkfjdslkjf"
					},
					"nexmo": {
						"api_key": "nsldkfjdslkjf",
						"api_secret": "nsldkfjdslkjf",
						"from_phone": "15139453300"
					}
				});
			nock('https://api.getvenn.io/v1')
				.get('/priority/sms')
				.reply(200, [ "twilio", "nexmo"]);

			nock('https://api.twilio.com:443')
				.post('/2010-04-01/Accounts/sldkfjdslkjf/Messages.json')
				.reply(500, [{"status": "sent"}] );
			nock('https://rest.nexmo.com')
				.post('/sms/json?from=15139453300&to=testy@email.com&text=message-1&api_key=nsldkfjdslkjf&api_secret=nsldkfjdslkjf')
				.reply(200, {"message": "success"});

			emailClient.initialize(process.env.VENN_API_KEY)
			emailClient.send({from:"from@email.com", to:"testy@email.com", message:"message-1"}, function(err, result){
				assert.equal(result.service, "nexmo");
				done()
			})
		})

		it('to twilio when nexmo down', function(done){
			nock.cleanAll()
			nock('https://api.getvenn.io/v1')
				.get('/keys/sms')
				.reply(200, {
					"twilio": {
						"account_sid": "sldkfjdslkjf",
						"auth_token": "sldkfjdslkjf"
					},
					"nexmo": {
						"api_key": "nsldkfjdslkjf",
						"api_secret": "nsldkfjdslkjf",
						"from_phone": "15139453300"
					}
				});
			nock('https://api.getvenn.io/v1')
				.get('/priority/sms')
				.reply(200, [ "nexmo", "twilio"]);

			nock('https://api.twilio.com:443')
				.post('/2010-04-01/Accounts/sldkfjdslkjf/Messages.json')
				.reply(200, [{"status": "sent"}] );
			nock('https://rest.nexmo.com')
				.post('/sms/json?from=15139453300&to=testy@email.com&text=message-1&api_key=nsldkfjdslkjf&api_secret=nsldkfjdslkjf')
				.reply(400, {
				  "message-count":"1",
				  "status":"2",
				  "messages":[
				    {
				    "status":"2",
				    "error-text":"Missing from param"
				    }
				  ]
				});

			emailClient.initialize(process.env.VENN_API_KEY)
			emailClient.send({from:"from@email.com", to:"testy@email.com", message:"message-1"}, function(err, result){
				assert.equal(result.service, "twilio");
				done()
			})
		})

})
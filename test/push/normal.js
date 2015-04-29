var assert = require("assert")
var nock = require("nock")
var client = require("../../lib/index").SMS;

describe('when sms services up', function(){

	it('should send with parse when suggested first', function(done){
		nock.cleanAll()
		nock('https://api.getvenn.io/v1')
			.get('/keys?type=email')
			.reply(200, {
				"parse": {
					"api_key": "a",
					"app_id": "b"
				}
			});
		nock('https://api.parse.com:443')
			.post('/1/installations/')
			.reply(201, [{}] );
		nock('https://api.parse.com:443')
			.post('/1/push/')
			.reply(201, [{}] );
		nock('https://api.getvenn.io/v1')
			.get('/priority?type=email')
			.reply(200, [ "parse"]);

		client.initialize()
		client.send({deviceToken:"12345", deviceType:"ios", message:"push message 29449"}, function(err, result){
			assert.equal(result.service, "parse");
			assert.equal(Object.keys(client.services).length, 1);
			done()
		})
	})

	it('should send with pushwoosh when suggested first', function(done){
		nock.cleanAll()
		nock('https://api.getvenn.io/v1')
			.get('/keys?type=email')
			.reply(200, {
				"pushwoosh": {
					"app_code": "a",
					"auth_token": "b"
				}
			});
		nock('https://cp.pushwoosh.com:443')
			.post('/json/1.3/createMessage')
			.reply(200, {status_code: 200} );
		nock('https://api.getvenn.io/v1')
			.get('/priority?type=email')
			.reply(200, [ "pushwoosh"]);

		client.initialize()
		client.send({deviceToken:"12345", deviceType:"ios", message:"push message 29449"}, function(err, result){
			console.log("result", result)
			assert.equal(result.service, "pushwoosh");
			assert.equal(Object.keys(client.services).length, 1);
			done()
		})
	})

})
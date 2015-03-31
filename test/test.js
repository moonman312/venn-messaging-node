var assert = require("assert")
var nock = require("nock")
var emailClient = require("../lib/index");

describe('sending an email', function(){
	beforeEach(function( doneBeforeAll ){
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
		doneBeforeAll()
	});

	describe('when services are down', function(){

		it('should send with sendgrid when mandrill is down', function(done12){
			beforeEach(function( done2 ){
				nock('http://api.getvenn.io/v1')
					.get('/priority?type=email')
					.reply(200, [ "mandrill", "sendgrid" ]);

				nock('https://mandrillapp.com/api/1.0')
					.post('/messages/send.json')
					.reply(500, {});
				nock('https://api.sendgrid.com/api')
					.post('/mail.send.json')
					.reply(200, {"message": "success"});
				done2()
			});
			emailClient.initialize("64d2fa2b73f6f7cc61a4b3e8").then(function(){
				emailClient.send("from@email.com", "timmyg13@gmail.com", "subject-1", "message-1", function(err, result){
					assert.equal(result, "sendgrid");
					done12()
				})
			})
		})

		it('should send with mandrill when sendgrid is down', function(done10){
			beforeEach(function( done14 ){
				nock('http://api.getvenn.io/v1')
					.get('/priority?type=email')
					.reply(200, [ "sendgrid", "mandrill" ]);
				nock('https://mandrillapp.com/api/1.0')
					.post('/messages/send.json')
					.reply(200, [{"status": "sent"}] );
				nock('https://api.sendgrid.com/api')
					.post('/mail.send.json')
					.reply(500, {});
				done14()
			});
			emailClient.initialize("64d2fa2b73f6f7cc61a4b3e8").then(function(){
				emailClient.send("from@email.com", "timmyg13@gmail.com", "subject-1", "message-1", function(err, result){
					assert.equal(result, "mandrill");
					done10()
				})
			})
		})
	})

	describe('when services up', function(){
		beforeEach(function( done3 ){
			nock('https://mandrillapp.com/api/1.0')
				.post('/messages/send.json')
				.reply(200, [{"status": "sent"}] );
			nock('https://api.sendgrid.com/api')
				.post('/mail.send.json')
				.reply(200, {"message": "success"});
			done3()
		})
		it('should send with mandrill suggested first', function(done9){
			beforeEach(function( done4 ){
				nock('http://api.getvenn.io/v1')
					.get('/priority?type=email')
					.reply(200, [ "mandrill", "sendgrid"]);
					done4()
			});

			emailClient.initialize("64d2fa2b73f6f7cc61a4b3e8").then(function(){
				emailClient.send("from@email.com", "timmyg13@gmail.com", "subject-1", "message-1", function(err, result){
					assert.equal(result, "mandrill");
					done9()
				})
			})
		})

		it('should send with sendgrid suggested first', function(done7){
			beforeEach(function( done5 ){
				nock('http://api.getvenn.io/v1')
					.get('/priority?type=email')
					.reply(200, [ "sendgrid", "mandrill" ]);
				done5()
			});
			emailClient.initialize("64d2fa2b73f6f7cc61a4b3e8").then(function(){
				emailClient.send("from@email.com", "timmyg13@gmail.com", "subject-1", "message-1", function(err, result){
					assert.equal(result, "sendgrid");
					done7()
				})
			})
		})
	})
})
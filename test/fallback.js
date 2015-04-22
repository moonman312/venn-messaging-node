// var assert = require("assert")
// var nock = require("nock")
// var emailClient = require("../lib/index");

// describe('sending an email', function(){

// 	nock('https://api.getvenn.io/v1')
// 		.get('/keys?type=email')
// 		.reply(200, {
// 			"sendgrid": {
// 				"api_user": process.env.SENDGRID_API_USER,
// 				"api_key": process.env.SENDGRID_API_KEY
// 			},
// 			"mandrill": {
// 				"api_key": process.env.MANDRILL_API_KEY
// 			}
// 		});

// 	describe('when services are down', function(){

// 		it('should send with sendgrid when mandrill and mailgun are down', function(done){
// 			nock('https://api.getvenn.io/v1')
// 				.get('/priority?type=email')
// 				.reply(200, [ "mandrill", "mailgun", "sendgrid" ]);

// 			nock('https://mandrillapp.com/api/1.0')
// 				.post('/messages/send.json')
// 				.reply(500, {});


// 			nock('https://api.mailgun.net').filteringPath(function(path) {
// 				return '/';
// 			}).get('/').reply(500, {});
// 			nock('https://api.sendgrid.com/api')
// 				.post('/mail.send.json')
// 				.reply(200, {"message": "success"});
// 			emailClient.initialize(process.env.VENN_API_KEY)
// 			emailClient.send("from@email.com", "timmyg13@gmail.com", "subject-1", "message-1", function(err, result){
// 				assert.equal(result, "sendgrid");
// 				done()
// 			})
// 		})

// 		it('should send with mandrill when sendgrid is down', function(done){
// 			nock('https://api.getvenn.io/v1')
// 				.get('/priority?type=email')
// 				.reply(200, [ "sendgrid", "mandrill" ]);
// 			nock('https://mandrillapp.com/api/1.0')
// 				.post('/messages/send.json')
// 				.reply(200, [{"status": "sent"}] );
// 			nock('https://api.sendgrid.com/api')
// 				.post('/mail.send.json')
// 				.reply(500, {});
// 			emailClient.initialize(process.env.VENN_API_KEY)
// 			emailClient.send("from@email.com", "timmyg13@gmail.com", "subject-1", "message-1", function(err, result){
// 				assert.equal(result, "mandrill");
// 				done()
// 			})
// 		})

// 		it('should send with mailgun when sendgrid is down', function(done){
// 			nock('https://api.getvenn.io/v1')
// 				.get('/priority?type=email')
// 				.reply(200, [ "sendgrid", "mailgun" ]);
// 			nock('https://api.sendgrid.com/api')
// 				.post('/mail.send.json')
// 				.reply(200, {});
// 			nock('https://api.mailgun.net').filteringPath(function(path) {
// 				return '/';
// 			}).get('/').reply(200, {});
// 			emailClient.initialize(process.env.VENN_API_KEY)
// 			emailClient.send("from@email.com", "timmyg13@gmail.com", "subject-1", "message-1", function(err, result){
// 				assert.equal(result, "mailgun");
// 				done()
// 			})
// 		})
// 	})


// })
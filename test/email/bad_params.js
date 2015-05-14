var assert = require("assert")
var should = require("chai").should()
var client = require("../../lib/index").Email;
var MessagingUserStatus = require('../../lib/models/messaging_user_status');
var UserCodes = (new MessagingUserStatus()).StatusCodes;

describe('when email services up', function(){

	it('should show error if incorrect params', function(done){
		client.initialize()
		client.send({to:"bob", from: "from@email.com", subject: "subject 321", message:"message-13579"}, function(err, result){
			should.exist(err);
			should.not.exist(result);
			err.code.should.equal(UserCodes.INVALID);
			done()
		})
	})
})
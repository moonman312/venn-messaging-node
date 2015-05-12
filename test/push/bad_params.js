var assert = require("assert")
var should = require("chai").should()
var client = require("../../lib/index").Push;

describe('when push services up', function(){

	it('should show error if incorrect params', function(done){
		client.initialize()
		client.send({deviceType:"ios", deviceToken: "sdfsfd", message:"message-13579"}, function(err, result){
			should.exist(err);
			should.not.exist(result);
			err.message.should.equal("Invalid parameters!")
			done()
		})
	})
})
var assert = require('assert');
var MessagingServiceStatus = require('../../lib/models/messaging_service_status');
var MessagingUserStatus = require('../../lib/models/messaging_user_status');

describe('when creating a new instance of MessagingServiceStatus', function () {
	
	objects = {}
	before(function (done) {
		objects.twilio = new MessagingServiceStatus('twilio');
		objects.ServiceCodes = new MessagingServiceStatus().StatusCodes;
		done();
	})

	it('should have all MessagingStatus fields', function (done) {
		assert.equal('code' in objects.twilio, true);
		assert.equal('service' in objects.twilio, true);
		assert.equal('message' in objects.twilio, true);
		assert.equal('StatusCodes' in objects.twilio, true);
		done();
	})

	it('should have service property defined', function (done) {
		assert.equal(objects.twilio.service, 'twilio');
		done();
	})

	it('should have StatusCodes property defined', function (done) {
		assert.notEqual(objects.twilio.StatusCodes, null);
		assert.notEqual(objects.twilio.StatusCodes, undefined);
		assert.notEqual(objects.twilio.StatusCodes, {});
		assert.equal(objects.twilio.StatusCodes, objects.ServiceCodes);
		done();
	})
})

describe('when creating a new instance of MessagingUserStatus', function () {
	
	objects = {}
	before(function (done) {
		objects.twilio = new MessagingUserStatus('twilio');
		objects.UserCodes = new MessagingUserStatus().StatusCodes;
		done();
	})

	it('should have all MessagingStatus fields', function (done) {
		assert.equal('code' in objects.twilio, true);
		assert.equal('service' in objects.twilio, true);
		assert.equal('message' in objects.twilio, true);
		assert.equal('StatusCodes' in objects.twilio, true);
		done();
	})

	it('should have service property defined', function (done) {
		assert.equal(objects.twilio.service, 'twilio');
		done();
	})

	it('should have StatusCodes property defined', function (done) {
		assert.notEqual(objects.twilio.StatusCodes, null);
		assert.notEqual(objects.twilio.StatusCodes, undefined);
		assert.notEqual(objects.twilio.StatusCodes, {});
		assert.equal(objects.twilio.StatusCodes, objects.UserCodes);
		done();
	})
})
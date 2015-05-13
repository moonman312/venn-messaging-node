MessagingStatus = require('./messaging_status');

var codes = {
	MISSING_DATA : 'MISSING_DATA_ERROR',
	INVALID_DATA : 'INVALID_DATA_ERROR'
}

function MessagingUserStatus(service) {
	MessagingStatus.call(this, codes);
	this.service = service;
}

MessagingUserStatus.prototype = Object.create(MessagingStatus.prototype);
MessagingUserStatus.prototype.constructor = MessagingUserStatus;

module.exports = MessagingUserStatus;
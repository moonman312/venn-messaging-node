MessagingStatus = require('./messaging_status');

var codes = {
	DEFAULT : 'USER_ERROR',
	MISSING : 'MISSING_DATA_ERROR',
	INVALID : 'INVALID_DATA_ERROR'
}

function MessagingUserStatus(service) {
	MessagingStatus.call(this, codes);
	this.state.service = service;
}

MessagingUserStatus.prototype = Object.create(MessagingStatus.prototype);
MessagingUserStatus.prototype.constructor = MessagingUserStatus;

module.exports = MessagingUserStatus;
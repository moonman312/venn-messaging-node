var StatusCode = require('./messaging_status_code');

function MessagingStatus(from, status, success) {
	if (!from) return null;
	var messagingStatus = {};
	messagingStatus.service = from.toLowerCase();
	var message = status.message || status.Message || status.status;
	var code = StatusCode.DEFAULT;
	
	// Message successfully sent
	if (success) {
		messagingStatus.message = message;

		// Queued parsing for Mandrill
		messagingStatus.code = (message === 'queued' ? StatusCode.QUEUED : StatusCode.SUCCESS);

		return messagingStatus;
	}

	// There was an error when attempting to send message
	switch (messagingStatus.service) {

		// Email providers
		case 'sendgrid':
			messagingStatus.message = message;
			if (message === 'Maximum credits exceeded') code = StatusCode.LIMIT_EXCEEDED;
			else if (message === 'sendgrid error') code = StatusCode.SERVICE_DOWN;
			break;

		case 'mailgun':
			messagingStatus.message = message;
			if (message === 'Message limit reached.') code = StatusCode.LIMIT_EXCEEDED;
			break;

		case 'mandrill':
			messagingStatus.message = status.name + ': ' + message;
			if (status.name === 'PaymentRequired') code = StatusCode.LIMIT_EXCEEDED;
			else if (status.name === 'GeneralError') code = StatusCode.SERVICE_DOWN;
			break;

		case 'postmark':
			// See http://developer.postmarkapp.com/developer-api-overview.html for statusor codes
			messagingStatus.message = status.code + ': ' + message;
			if (status.code == 405) code = StatusCode.LIMIT_EXCEEDED;
			break;

		// SMS providers
		case 'twilio':
			// See https://www.twilio.com/docs/statusors for statusor codes
			messagingStatus.message = message + ': ' + status.moreInfo;
			if (status.code == 20003 || status.code == 20005) code = StatusCode.LIMIT_EXCEEDED; // should only be code 20005, but Twilio doesn't seem to follow its own documentation
			break;
	}

	messagingStatus.code = code;
	return messagingStatus;
}

module.exports = MessagingStatus;
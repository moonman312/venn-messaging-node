var ErrorCode = require('./messaging_error_code');

function MessagingError(from, err) {
	if (!from) return null;
	var messagingError = {};
	var message = err.message;
	var code = ErrorCode.DEFAULT;

	switch (from.toLowerCase()) {

		// Email providers
		case 'sendgrid':
			messagingError.message = 'Sendgrid: ' + message;
			if (message === 'Maximum credits exceeded') code = ErrorCode.LIMIT_EXCEEDED;
			else if (message === 'sendgrid error') code = ErrorCode.SERVICE_DOWN;
			break;

		case 'mailgun':
			messagingError.message = 'Mailgun: ' + message;
			if (message === 'Message limit reached.') code = ErrorCode.LIMIT_EXCEEDED;
			break;

		case 'mandrill':
			messagingError.message = 'Mandrill: ' + err.name + ': ' + message;
			if (err.name === 'PaymentRequired') code = ErrorCode.LIMIT_EXCEEDED;
			else if (err.name === 'GeneralError') code = ErrorCode.SERVICE_DOWN;
			break;

		case 'postmark':
			// See http://developer.postmarkapp.com/developer-api-overview.html for error codes
			messagingError.message = 'Postmark: ' + err.code + ': ' + message;
			if (err.code == 405) code = ErrorCode.LIMIT_EXCEEDED;
			break;

		// SMS providers
		case 'twilio':
			// See https://www.twilio.com/docs/errors for error codes
			messagingError.message = 'Twilio: ' + message + ': ' + err.moreInfo;
			if (err.code == 20003 || err.code == 20005) code = ErrorCode.LIMIT_EXCEEDED; // should only be code 20005, but Twilio doesn't seem to follow its own documentation
			break;
	}

	messagingError.code = code;
	return messagingError;
}

module.exports = MessagingError;
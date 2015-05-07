var ErrorCode = require('./messaging_error_code');

function MessagingError(from, err) {
	if (!from) return null;
	var messagingError = {};
	var message = err.message;
	var code = ErrorCode.DEFAULT;

	switch (from.toLowerCase()) {

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
			messagingError.message = 'Mandrill: ' + message;
			if (err.name === 'PaymentRequired') code = ErrorCode.LIMIT_EXCEEDED;
			else if (err.name === 'GeneralError') code = ErrorCode.SERVICE_DOWN;
			break;
	}

	messagingError.code = code;
	return messagingError;
}

module.exports = MessagingError;
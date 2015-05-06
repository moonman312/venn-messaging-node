function MessagingError(from, err) {
	if (!from) return null;
	messagingError = {};
	message = err.message;
	code = 'UNKNOWN';

	switch (from.toLowerCase()) {

		case 'sendgrid':
			messagingError.message = 'Sendgrid: ' + message;
			if (message === 'Maximum credits exceeded') code = 'LIMIT_EXCEEDED';
			else if (message === 'sendgrid error') code = 'SERVICE_DOWN';
			break;

		case 'mailgun':
			messagingError.message = 'Mailgun: ' + message;
			if (message === 'Message limit reached.') code = 'LIMIT_EXCEEDED';
			break;
	}

	messagingError.code = code;
	return messagingError;
}

module.exports = MessagingError;
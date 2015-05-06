ErrorCode = {
	DEFAULT : 'UNKNOWN_ERROR',
	LIMIT_EXCEEDED : 'LIMIT_EXCEEDED_ERROR',
	SERVICE_DOWN : 'SERVICE_DOWN_ERROR'
}

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
	}

	messagingError.code = code;
	return messagingError;
}

module.exports = MessagingError;
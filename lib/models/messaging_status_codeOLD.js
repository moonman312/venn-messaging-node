var StatusCode = {

	// Service Errors
	DEFAULT : 'UNKNOWN_ERROR',
	SUCCESS : 'MESSAGE_SENT',
	QUEUED : 'MESSAGE_QUEUED',
	LIMIT_EXCEEDED : 'LIMIT_EXCEEDED_ERROR',
	SERVICE_DOWN : 'SERVICE_DOWN_ERROR',

	// User Errors
	USER : 'USER_ERROR'
}

module.exports = StatusCode;
function MessagingStatus(codes) {
	this.state = {
		code: null,
		service: null,
		message: null
	};
	this.StatusCodes = codes;
}

module.exports = MessagingStatus;
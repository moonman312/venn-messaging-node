function MessagingServiceProvider(keys) {
	this.keys = keys;
 	this.client = {};
}

MessagingServiceProvider.prototype.initialize = function() {}

MessagingServiceProvider.prototype.send = function() {}

module.exports = MessagingServiceProvider
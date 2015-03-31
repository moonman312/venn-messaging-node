function EmailServiceProvider(keys) {
	this.keys = keys;
 	this.client = {};
}

EmailServiceProvider.prototype.initialize = function() {}

EmailServiceProvider.prototype.send = function() {}

module.exports = EmailServiceProvider
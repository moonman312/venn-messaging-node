var MessagingClient = require("./models/messaging_client")
exports.Email = new MessagingClient("email")
exports.SMS = new MessagingClient("sms")
exports.Push = new MessagingClient("push")
module.exports = exports
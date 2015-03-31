var debug = require('debug')('email')
var _ = require("underscore")
var async = require("async")
var vennApiService = require("./services/venn_api")
var request = require("request")
var emailClient = require("./models/email_client")

module.exports = new emailClient()

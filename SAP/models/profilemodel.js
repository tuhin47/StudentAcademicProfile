var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var ProfileSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	firstname: {
		type: String
	},
	lastname: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String
	}

});

var User = module.exports = mongoose.model('User', UserSchema,'users');

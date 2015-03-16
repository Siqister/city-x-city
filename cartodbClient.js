var cartodb = require('cartodb');
var secret = require('./secret');

var cartodbClient = new cartodb({
		user: secret.USER,
		api_key: secret.API_KEY
	});

module.exports = cartodbClient;

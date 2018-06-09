const request = require('request-promise');
const config = require('../config');

const apiClient = (uri) => {
	return request({
		uri: `${config.cgiHost}${uri}`,
		json: true,
	})
}

module.exports = apiClient;
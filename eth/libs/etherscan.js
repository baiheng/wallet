const request = require('request-promise');
const config = require('../config');

const etherscan = (option) => {
	const qs = Object.assign({ apikey: config.ethApiKey, }, option);
	const opt = {
		uri: config.ethCgi,
		qs,
		json: true,
	};
	return request(opt);
	
}

module.exports = etherscan;

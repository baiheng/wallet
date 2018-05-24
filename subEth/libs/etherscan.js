const request = require('request-promise');
const config = require('../config');

const etherscan = (option) => {
	const qs = Object.assign({ apikey: config.ethApiKey }, option);

	const queries = [];
	Object.keys(qs).forEach(key => queries.push(`${key}=${qs[key]}`));
	const opt = {
		uri: `${config.ethCgi}?${queries.join('&')}`,
		json: true,
	};
	return request(opt);
	
}

module.exports = etherscan;

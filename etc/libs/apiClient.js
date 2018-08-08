const request = require('request-promise');

const config = require('../config');

const etcHost = `${config.cgi}api/v1/`;
const etcClient = (uri) => {
	return request({
		uri: `${etcHost}${uri}`,
		json: true,
	})
}

const proxyHost = `${config.cgi}gethProxy/`;
const proxyClient = (uri) => {
	return request({
		uri: `${proxyHost}${uri}`,
		json: true,
	})
}

const gasTrackerHost = `${config.url}v1/`;
const gasTrackerClient = (uri) => {
	return request({
		uri: `${gasTrackerHost}${uri}`,
		json: true,
	});
}

module.exports = {
	etcClient,
	proxyClient,
	gasTrackerClient,
};

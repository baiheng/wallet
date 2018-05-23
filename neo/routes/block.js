const { responseError, responseSuccess } = require('../libs/response');
const rpcClient = require('../libs/rpcClient');

// https://api.rpcClient.io/api?module=proxy&action=eth_blockNumber&apikey=YourApiKeyToken
const getBlockNumber = (req, res, next) => {
	rpcClient('get_height')
		.then(data => {
			const blockNumber = isNaN(parseInt(data.height)) ? 0 : parseInt(data.height);
	   	return responseSuccess(res, { blockNumber });
		})
		.catch(e => {
			console.log('getBlockNumber error', e);
	  	return responseError(res, 50000, e.message);
		})
}

module.exports = getBlockNumber;



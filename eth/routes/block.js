const web3 = require('../libs/web3');
const { responseError, responseSuccess } = require('../libs/response');
const etherscan = require('../libs/etherscan');

// https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=YourApiKeyToken
const getBlockNumber = (req, res, next) => {
	const option = {
		module: 'proxy',
		action: 'eth_blockNumber',
	}
	etherscan(option)
		.then(data => {
			const blockNumber = isNaN(parseInt(data.result)) ? 0 : parseInt(data.result);
	   	return responseSuccess(res, { blockNumber });
		})
		.catch(e => {
			console.log('getBlockNumber error', e);
	  	return responseError(res, 50000, e.message);
		})
}

module.exports = getBlockNumber;



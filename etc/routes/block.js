const { responseError, responseSuccess } = require('../libs/response');
const { etcClient, proxyClient } = require('../libs/apiClient');
// const etherscan = require('../libs/etherscan');

const getBlockNumber = (req, res, next) => {
	proxyClient('eth_blockNumber')
		.then(data => {
			const blockNumber = !isNaN(parseInt(data, 'hex')) ? parseInt(data, 'hex') : 0;
	   	return responseSuccess(res, { blockNumber });
		})
		.catch(e => {
			console.log('get blockNumber error', e);
	  	return responseError(res, 50000, e.message);
		});
}

module.exports = getBlockNumber;



const { getRippleApi } = require('../libs/rippleApi');
const { responseError, responseSuccess } = require('../libs/response');
// const etherscan = require('../libs/etherscan');

const getBlockNumber = (req, res, next) => {
	const option = {
		module: 'proxy',
		action: 'eth_blockNumber',
	}
	getRippleApi()
		.then(api => api.getLedger())
		.then(result => {
			console.log(result);
	   	return responseSuccess(res, { ...result, blockNumber: result.ledgerVersion });
		})
		.catch(e => {
			console.log('get blockNumber error', e);
	  	return responseError(res, 50000, e.message);
		});
}

module.exports = getBlockNumber;



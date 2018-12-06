const web3 = require('../libs/web3');
const { responseError, responseSuccess } = require('../libs/response');
const etherscan = require('../libs/etherscan');

const transactionByHash = (req, res, next) => {
	const { hash = "" } = req.query;
	if (!hash) {
		return responseError(res, 50001, 'hash should not be empty');
	}
	const txhash = hash.match(/^0x/) ? hash : `0x${hash}`;
	const option = {
		txhash,
		module: 'proxy',
		action: 'eth_getTransactionByHash',
	}
	etherscan(option)
		.then(data => {
			if (!data.result)
				throw data
	   	return responseSuccess(res, data.result);
		})
		.catch(e => {
			console.log('transactionByHash error', e);
	  	return responseError(res, 50000, e.message);
		})
}

module.exports = transactionByHash;

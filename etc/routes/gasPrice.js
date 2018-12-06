// const web3 = require('../libs/web3');
const { responseError, responseSuccess } = require('../libs/response');
const { etcClient, proxyClient } = require('../libs/apiClient');

const gasPrice = (req, res, next) => {
	proxyClient('eth_gasPrice')
		.then(data => {
			const gasPrice = !isNaN(parseInt(data, 'hex')) ? parseInt(data, 'hex') : 0;
		  return responseSuccess(res, { gasPrice });
		})
		.catch(e => {
			console.log('get fee error', e);
		  return responseError(res, 50000, e);
		});
}

module.exports = gasPrice;

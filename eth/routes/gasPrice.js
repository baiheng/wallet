const web3 = require('../libs/web3');
const { responseError, responseSuccess } = require('../libs/response');
const etherscan = require('../libs/etherscan');

// https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=YourApiKeyToken
const gasPrice = (req, res, next) => {
	const option = {
		module: 'proxy',
		action: 'eth_gasPrice',
	}
	etherscan(option)
		.then(data => {
			const gasPrice = parseInt(data.result);
	   	return responseSuccess(res, { gasPrice: gasPrice });
		})
		.catch(e => {
			console.log('gasPrice error', e);
	  	return responseError(res, 50000, e.message);
		})
	/*web3.eth.getGasPrice(function(err, result) {
	  if (err){
	    console.log('gasPrice error', err);
	  	return responseError(res, 50000, err.message);
	  }
	   console.log('gasPrice success', result);
	   return responseSuccess(res, { gasPrice: result });
	});*/
}

module.exports = gasPrice;

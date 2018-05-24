
const { responseError, responseSuccess } = require('../libs/response');
const rpcClient = require('../libs/rpcClient');

// https://api.rpcClient.io/api?module=proxy&action=eth_gasPrice&apikey=YourApiKeyToken
const gasPrice = (req, res, next) => {
	
	rpcClient('get_height')
		.then(data => {
			const blockNumber = isNaN(parseInt(data.height)) ? 0 : parseInt(data.height);
			return rpcClient(`get_fees_in_range/${blockNumber-10}-${blockNumber}`)
		})
		.then(data => {
	   	return responseSuccess(res, data);
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

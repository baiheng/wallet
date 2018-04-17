const web3 = require('../libs/web3');
const { responseError, responseSuccess } = require('../libs/response');


const gasPrice = (req, res, next) => {
	web3.eth.getGasPrice(function(err, result) {
	  if (err){
	    console.log('gasPrice error', err);
	  	return responseError(res, 50000, err.message);
	  }
	   console.log('gasPrice success', result);
	   return responseSuccess(res, { gasPrice: result });
	});
}

module.exports = gasPrice;

const web3 = require('../libs/web3');
const { responseError, responseSuccess } = require('../libs/response');


const balance = (req, res, next) => {
	const { address = "" } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	const hash = address.match(/^0x/) ? address : `0x${address}`
	web3.eth.getBalance(hash, function(err, result) {
	  if (err){
	    console.log('getBalance error', err);
	  	return responseError(res, 50000, err.message);
	  }
	   console.log('getBalance success', result);
	   return responseSuccess(res, { balance: result });
	});
}

module.exports = balance;

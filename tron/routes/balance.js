const { responseError, responseSuccess } = require('../libs/response');

const httpClient = require('../libs/TronClient').httpClient;
const grpcClient = require('../libs/TronClient').grpcClient;


const balance = (req, res, next) => {
	const { address = "" } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	httpClient.getAccountBalances(address)
		.then(balances => {
	   return responseSuccess(res, { balance: balances });
		})
		.catch(e => {
	    console.log('getBalance error', e);
	  	return responseError(res, 50000, err.message);
		});
}

module.exports = balance;

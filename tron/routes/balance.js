const { responseError, responseSuccess } = require('../libs/response');

const TronClient = require('../libs/TronClient');

// let latestBlock = Client.getLatestBlock().then(d => console.log('getLatestBlock', d));
// Client.getBlockByNum(41142).then(d => console.log('getBlockByNum', d))
// 
const balance = (req, res, next) => {
	const { address = "" } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	TronClient.getAccountBalances(address)
		.then(balances => {
	   return responseSuccess(res, { balance: balances });
		})
		.catch(e => {
	    console.log('getBalance error', e);
	  	return responseError(res, 50000, err.message);
		});
}

module.exports = balance;

const web3 = require('../libs/web3');
const { responseError, responseSuccess } = require('../libs/response');
const etherscan = require('../libs/etherscan');
	

// https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=YourApiKeyToken
const createAccount = (req, res, next) => {
	
	const account = web3.eth.accounts.create()
	if (!account || !account.address || !account.privateKey) {
		console.log('createAccount error', account);
	  return responseError(res, 50000, JSON.stringify(account));
	}
	return responseSuccess(res,  { address: account.address, privateKey: account.privateKey });
}

module.exports = createAccount;



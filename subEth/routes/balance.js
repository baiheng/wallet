const { responseError, responseSuccess } = require('../libs/response');
const { convertToPrice } = require('../libs/ethConvert');
const etherscan = require('../libs/etherscan');
const config = require('../config');

// https://api.etherscan.io/api?module=account&action=balance&address=0xC6702D9937058b5186c633C8ebDA87996A4c283f&tag=latest&apikey=YourApiKeyToken
// https://api.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=0x2910543af39aba0cd09dbb2d50200b3e800a63d2&tag=latest&apikey=YourApiKeyToken
const balance = (req, res, next) => {
	const { address = "" } = req.query;
	const contract = req.contract;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	const hash = address.match(/^0x/) ? address : `0x${address}`;

	// https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&address=0xe04f27eb70e025b78871a2ad7eabe85e61212761&tag=latest&apikey=YourApiKeyToken
	const balanceOption = {
		address,
		module: 'account',
		action: 'tokenbalance',
		contractaddress: contract.address,
		tag: 'latest',
	};
	const nonceOption = {
		address,
		module: 'proxy',
		action: 'eth_getTransactionCount',
		tag: 'latest'
	}
	Promise.all([etherscan(balanceOption), convertToPrice(contract.name ,'cny'), etherscan(nonceOption)])
		.then(data => {
			console.log(data);
			const tBalance = data[0].result;
			const price = data[1];
			const nonce = !isNaN(parseInt(data[2].result)) ? parseInt(data[2].result) : 0;
			const tmp = !isNaN(parseInt(tBalance)) ? parseInt(tBalance) / 1e+18 : 0;
	   	return responseSuccess(res, { balance: tBalance, cny: tmp * price, nonce: nonce + 1 })
		})
		.catch(e => {
			console.log('getBalance error', e);
	  	return responseError(res, 50000, JSON.stringify(e));
		});
}

module.exports = balance;

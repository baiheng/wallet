const { responseError, responseSuccess } = require('../libs/response');
const { convertToPrice } = require('../libs/convert');
const { etcClient, proxyClient } = require('../libs/apiClient');

// https://etcchain.com/api/v1/getAddressBalance?address=$address

const balance = (req, res, next) => {
	const { address = "" } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}

	const hash = address.match(/^0x/) ? address : `0x${address}`;

	Promise.all([ etcClient(`getAddressBalance?address=${address}`), convertToPrice('cny'), proxyClient('eth_blockNumber')])
		.then(data => {
			const account = data[0];
			const price = data[1];
			const nonce = !isNaN(parseInt(data[2], 'hex')) ? parseInt(data[2], 'hex') : 0;
			const tmp = !isNaN(parseFloat(account.balance)) ? parseFloat(account.balance) : 0;

			return responseSuccess(res, { ...account, nonce, balance: tmp, cny: tmp * price })
		})
		.catch(e => {
			console.log('getBalance error', e);
	  	return responseError(res, 50000, JSON.stringify(e));
		});
}

module.exports = balance;

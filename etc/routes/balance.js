const { responseError, responseSuccess } = require('../libs/response');
const { convertToPrice } = require('../libs/convert');
const { etcClient, proxyClient, gasTrackerClient } = require('../libs/apiClient');

// https://etcchain.com/api/v1/getAddressBalance?address=$address
//
// https://api.gastracker.io/v1/addr/$address

const balance = (req, res, next) => {
	const { address = "" } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}

	const hash = address.match(/^0x/) ? address : `0x${address}`;

	// Promise.all([ etcClient(`getAddressBalance?address=${address}`), convertToPrice('cny'), proxyClient('eth_blockNumber')])
	Promise.all([ gasTrackerClient(`addr/${address}`), convertToPrice('cny')])
		.then(data => {
			console.log('balance data', data)
			const account = data[0];
			const price = data[1];
			// const nonce = !isNaN(parseInt(data[2], 'hex')) ? parseInt(data[2], 'hex') : 0;
			const nonce = 0;
			// const tmp = !isNaN(parseFloat(account.balance)) ? parseFloat(account.balance) : 0;

			//return responseSuccess(res, { ...account, nonce, balance: tmp, cny: tmp * price })
			return responseSuccess(res, { ...account, nonce, balance: account.balance.wei, cny: account.balance.ether * price })
		})
		.catch(e => {
			console.log('getBalance error', e);
	  	return responseError(res, 50000, JSON.stringify(e));
		});
}

module.exports = balance;

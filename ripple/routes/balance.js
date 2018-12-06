const { responseError, responseSuccess } = require('../libs/response');
const { convertToPrice } = require('../libs/convert');
const { getRippleApi } = require('../libs/rippleApi');
// const etherscan = require('../libs/etherscan');

const balance = (req, res, next) => {
	const { address = "" } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}

	const hash = address.match(/^0x/) ? address : `0x${address}`;

	Promise.all([ getRippleApi().then(api => api.getAccountInfo(address)), convertToPrice('cny')])
		.then(data => {
			const account = data[0];
			const price = data[1];
			const tmp = !isNaN(parseFloat(account.xrpBalance)) ? parseFloat(account.xrpBalance) : 0;

			return responseSuccess(res, { ...account, balance: tmp, cny: tmp * price, nonce: account.sequence })
		})
		.catch(e => {
			console.log('getBalance error', e);
	  	return responseError(res, 50000, JSON.stringify(e));
		});
}

module.exports = balance;

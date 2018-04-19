const etherscan = require('../libs/etherscan');
const { responseError, responseSuccess } = require('../libs/response');

const personalTransaction = (req, res, next) => {
	const { address } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	const option = {
		address,
		module: 'account',
		action: 'txlist',
		startblock: 0,
		endblock: 99999999,
		sort: 'asc',
	}
	etherscan(option)
		.then(data => {
			responseSuccess(res, data.result);
		})
		.catch(e => {
			console.log('getPersonalTransaction error', e);
			responseError(res, 50000, e);
		})
}

module.exports = personalTransaction;

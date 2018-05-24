const etherscan = require('../libs/etherscan');
const { responseError, responseSuccess } = require('../libs/response');
const config = require('../config');

const PAGESIZE = 10;
const personalTransaction = (req, res, next) => {
	const { address, page } = req.query;
	const contract = req.contract;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	let pageNum = !isNaN(parseInt(page)) && parseInt(page) >= 0 ? parseInt(page) : 0;

	const option = {
		address,
		module: 'account',
		action: 'tokentx',
		contractaddress: contract.address,
		sort: 'desc',
		page: pageNum + 1,
		offset: PAGESIZE,
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

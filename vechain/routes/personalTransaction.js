const etherscan = require('../libs/etherscan');
const { responseError, responseSuccess } = require('../libs/response');
const config = require('../config');

const PAGESIZE = 10;
const personalTransaction = (req, res, next) => {
	const { address, page } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	let pageNum = !isNaN(parseInt(page)) && parseInt(page) >= 0 ? parseInt(page) : 0;

	// https://api.etherscan.io/api?module=account&action=txlist&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=YourApiKeyToken
	// https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2&address=0x4e83362442b8d1bec281594cea3050c8eb01311c&page=1&offset=100&sort=asc&apikey=YourApiKeyToken
	const option = {
		address,
		module: 'account',
		action: 'tokentx',
		contractaddress: config.contractaddress,
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

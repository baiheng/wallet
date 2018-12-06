const { getRippleApi } = require('../libs/rippleApi');
const { responseError, responseSuccess } = require('../libs/response');

const PAGESIZE = 10;
const personalTransaction = (req, res, next) => {
	const { address, page, maxLedgerVersion = '' } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	let pageNum = !isNaN(parseInt(page)) && parseInt(page) >= 0 ? parseInt(page) : 0;
	const options = {
		earliestFirst: false,
		binary: false,
		limit: PAGESIZE,
	}
	if (maxLedgerVersion)
		options.maxLedgerVersion = isNaN(parseInt(maxLedgerVersion)) ? 9999999999 : parseInt(maxLedgerVersion);
	return getRippleApi()
		.then(api => api.getTransactions(address, options))
		.then(result => {
		  return responseSuccess(res, result);
		})
		.catch(e => {
			console.log('get personalTransaction error', e);
		  return responseError(res, 50000, e);
		});
}

module.exports = personalTransaction;

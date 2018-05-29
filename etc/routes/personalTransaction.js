const { etcClient, proxyClient } = require('../libs/apiClient');
const { responseError, responseSuccess } = require('../libs/response');

const PAGESIZE = 10;
// getTransactionsByAddress?address=$address&page=$page&offset=$offset&sort=asc
const personalTransaction = (req, res, next) => {
	const { address, page, maxLedgerVersion = '' } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	let pageNum = !isNaN(parseInt(page)) && parseInt(page) >= 0 ? parseInt(page) : 0;
	etcClient(`getTransactionsByAddress?address=${address}&page=${pageNum}&offset=${PAGESIZE}`)
		.then(result => {
		  return responseSuccess(res, result);
		})
		.catch(e => {
			console.log('get personalTransaction error', e);
		  return responseError(res, 50000, e);
		});
}

module.exports = personalTransaction;

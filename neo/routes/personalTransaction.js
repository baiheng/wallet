const rpcClient = require('../libs/rpcClient');
const { responseError, responseSuccess } = require('../libs/response');

const PAGESIZE = 10;
const personalTransaction = (req, res, next) => {
	const { address, page } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	let pageNum = !isNaN(parseInt(page)) && parseInt(page) >= 0 ? parseInt(page) : 0;

	rpcClient(`get_last_transactions_by_address/${address}/${pageNum-1}`)
		.then(data => {
			responseSuccess(res, data);
		})
		.catch(e => {
			console.log('getPersonalTransaction error', e);
			responseError(res, 50000, e);
		})
}

module.exports = personalTransaction;

const apiClient = require('../libs/apiClient');
const { responseError, responseSuccess } = require('../libs/response');

// https://api.tronscan.org/api/transaction?sort=-timestamp&count=true&limit=25&start=0&address=TPwJS5eC5BPGyMGtYTHNhPTB89sUWjDSSu

const PAGESIZE = 10;
const getTransaction = (req, res, next) => {
	const { hash } = req.query;
	if (!hash) {
		return responseError(res, 50001, 'address should not be empty');
	}

	apiClient(`transaction/${hash}`)
		.then(data => {
			responseSuccess(res, data);
		})
		.catch(e => {
			console.log('get transaction error', e);
			responseError(res, 50000, e);
		})
}

module.exports = getTransaction;

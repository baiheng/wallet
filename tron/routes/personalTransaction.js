const apiClient = require('../libs/apiClient');
const { responseError, responseSuccess } = require('../libs/response');

// https://api.tronscan.org/api/transaction?sort=-timestamp&count=true&limit=25&start=0&address=TPwJS5eC5BPGyMGtYTHNhPTB89sUWjDSSu

const PAGESIZE = 10;
const personalTransaction = (req, res, next) => {
	const { address, page } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	let pageNum = !isNaN(parseInt(page)) && parseInt(page) >= 0 ? parseInt(page) : 0;

	apiClient(`transaction?sort=-timestamp&count=true&limit=${PAGESIZE}&address=${address}`)
		.then(data => {
			responseSuccess(res, data);
		})
		.catch(e => {
			console.log('getPersonalTransaction error', e);
			responseError(res, 50000, e);
		})
}

module.exports = personalTransaction;

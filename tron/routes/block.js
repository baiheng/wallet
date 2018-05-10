const { responseError, responseSuccess } = require('../libs/response');

const { httpClient } = require('../libs/TronClient');

// 
const latestBlock = (req, res, next) => {
	httpClient.getLatestBlock()
		.then(data => {
	  	return responseSuccess(res, { blockNumber: data.number });
		})
		.catch(e => {
	    console.log('getLatestBlock error', e);
	  	return responseError(res, 50000, err.message);
		});
}

module.exports = latestBlock;

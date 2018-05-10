const { responseError, responseSuccess } = require('../libs/response');

const httpClient = require('../libs/TronClient').httpClient;
const grpcClient = require('../libs/TronClient').grpcClient;

const witnesses = (req, res, next) => {
	httpClient.getWitnesses()
		.then(data => {
	   return responseSuccess(res, { witnesses: data });
		})
		.catch(e => {
	    console.log('getBalance error', e);
	  	return responseError(res, 50000, err.message);
		});
}

module.exports = witnesses;

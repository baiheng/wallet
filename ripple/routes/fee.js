// const web3 = require('../libs/web3');
const { responseError, responseSuccess } = require('../libs/response');
const { getRippleApi } = require('../libs/rippleApi');

const fee = (req, res, next) => {
	return getRippleApi()
		.then(api => api.getFee())
		.then(fee => {
			console.log(fee);
		  return responseSuccess(res, { fee: parseFloat(fee) });
		})
		.catch(e => {
			console.log('get fee error', e);
		  return responseError(res, 50000, e);
		});
}

module.exports = fee;

const { responseError, responseSuccess } = require('../libs/response');

const TronClient = require('../libs/TronClient');

// 
const broadcast = (req, res, next) => {
	const { password, token, to, amount } = req.body;
	if (!password || !token || !to || !amount)
	  return responseError(res, 50001, "params error");
	console.log(req.body);
	TronClient.send(password, token, to, amount)
		.then(tranData => {
			console.log('broadcast', tranData);
	   return responseSuccess(res, {});
		})
		.catch(e => {
	    console.log('getbroadcast error', e);
	  	return responseError(res, 50000, err.message);
		});
}

module.exports = broadcast;

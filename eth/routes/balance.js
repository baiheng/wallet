const web3 = require('../libs/web3');
const { responseError, responseSuccess } = require('../libs/response');
const { convertToPrice } = require('../libs/ethConvert');
const etherscan = require('../libs/etherscan');

// https://api.etherscan.io/api?module=account&action=balance&address=0xC6702D9937058b5186c633C8ebDA87996A4c283f&tag=latest&apikey=YourApiKeyToken
const balance = (req, res, next) => {
	const { address = "" } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	const hash = address.match(/^0x/) ? address : `0x${address}`;

	const option = {
		address,
		module: 'account',
		action: 'balance',
		tag: 'latest',
	}
	Promise.all([etherscan(option), convertToPrice('cny')])
		.then(data => {
			const tmp = parseInt(data[0].result) / 1e+18;
			const price = data[1];
	   	return responseSuccess(res, { balance: tmp, cny: tmp * price })
		})
		.catch(e => {
			console.log('getBalance error', e);
	  	return responseError(res, 50000, JSON.stringify(e));
		});

	// etherscan(option)
	// 	.then(data => {
	// 		const tmp = parseInt(data.result) / 1e+18;
	//    	return responseSuccess(res, { balance: tmp, cny: tmp * price });
	//    	return responseSuccess(res, { gasPrice: gasPrice });
	// 	})
	// 	.catch(e => {
	// 		console.log('gasPrice error', e);
	//   	return responseError(res, 50000, e.message);
	// 	})

	// web3.eth.getBalance(hash, function(err, result) {
	//   if (err){
	//     console.log('getBalance error', err);
	//   	return responseError(res, 50000, err.message);
	//   }
	//   convertToPrice('cny')
	//   	.then(price => {
	//   		const tmp = parseFloat(result);
	//    		return responseSuccess(res, { balance: tmp, cny: tmp * price });
	//   	})
	//   	.catch(e => {
	   		
	//   	})
	// });
}

module.exports = balance;

const { responseError, responseSuccess } = require('../libs/response');
const etherscan = require('../libs/etherscan');

// https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=0xf904808000831cfde080&apikey=YourApiKeyToken
const broadcast = (req, res, next) => {
	const { tx_hex = "" } = req.body;
	if (!tx_hex) {
		return responseError(res, 50001, 'tx_hex should not be empty');
	}
	const hash = tx_hex.match(/^0x/) ? tx_hex : `0x${tx_hex}`;
	const option = {
		module: 'proxy',
		action: 'eth_sendRawTransaction',
		hex: hash,
	}
	etherscan(option)
		.then(data => {
			if (data.error) {
				throw data.error;
			}
	   	return responseSuccess(res, { tx_id: data.result || ''});
		})
		.catch(e => {
			console.log('sendRawTransaction error', e);
	  	return responseError(res, 50000, e.message);
		});

	// web3.eth.sendSignedTransaction(hash, function(err, hash) {
	//   if (err){
	//     console.log('sendRawTransaction error', err);
	//   	return responseError(res, 50000, err.message);
	//   }
	//    console.log('sendRawTransaction success', hash);
	//    return responseSuccess(res, '');
	// });
}

module.exports = broadcast;

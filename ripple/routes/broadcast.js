const { getRippleApi } = require('../libs/rippleApi');
const { responseError, responseSuccess } = require('../libs/response');
// const etherscan = require('../libs/etherscan');

// https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=0xf904808000831cfde080&apikey=YourApiKeyToken
const broadcast = (req, res, next) => {
	const { tx_hex = "" } = req.body;
	if (!tx_hex) {
		return responseError(res, 50001, 'tx_hex should not be empty');
	}
	const hash = tx_hex.match(/^0x/) ? tx_hex : `0x${tx_hex}`;
	return getRippleApi()
		.then(api => api.submit(hash))
		.then(result => {
			console.log(result);
		  return responseSuccess(res, { });
		})
		.catch(e => {
			console.log('broadcast error', e);
		  return responseError(res, 50000, e);
		});
}

module.exports = broadcast;

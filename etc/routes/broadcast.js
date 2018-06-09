const { etcClient, proxyClient } = require('../libs/apiClient');
const { responseError, responseSuccess } = require('../libs/response');

const Web3 = require('web3');
const config = require('../config');

const web3 = new Web3(new Web3.providers.HttpProvider(config.web3Url));

// const etherscan = require('../libs/etherscan');

// https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=0xf904808000831cfde080&apikey=YourApiKeyToken
const broadcast = (req, res, next) => {
	const { tx_hex = "" } = req.body;
	if (!tx_hex) {
		return responseError(res, 50001, 'tx_hex should not be empty');
	}
	const hash = tx_hex.match(/^0x/) ? tx_hex : `0x${tx_hex}`;

	web3.eth.sendSignedTransaction(hash, function(err, hash) {
	  if (err){
	    console.log('sendRawTransaction error', err);
	  	return responseError(res, 50000, err.message);
	  }
	   // console.log('sendRawTransaction success', hash);
	   return responseSuccess(res, { tx_id: hash });
	});
	/*return proxyClient(`eth_sendRawTransaction?hex=${hash}`)
		.then(result => {
			console.log(result);
		  return responseSuccess(res, { });
		})
		.catch(e => {
			console.log('broadcast error', e);
		  return responseError(res, 50000, e);
		});*/
}

module.exports = broadcast;

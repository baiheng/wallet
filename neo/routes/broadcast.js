const request = require('request-promise');

const { responseError, responseSuccess } = require('../libs/response');
const rpcClient = require('../libs/rpcClient');

// https://api.rpcClient.io/api?module=proxy&action=eth_sendRawTransaction&hex=0xf904808000831cfde080&apikey=YourApiKeyToken
const broadcast = (req, res, next) => {
	const { tx_hex = "" } = req.body;
	if (!tx_hex) {
		return responseError(res, 50001, 'tx_hex should not be empty');
	}
	const hash = tx_hex.match(/^0x/) ? tx_hex : `0x${tx_hex}`;
	const opt = {
		method: 'POST',
		json: true,
		uri: 'https://seed1.neo.org:10331',
		body: {
			jsonrpc: '2.0',
			method: 'sendrawtransaction',
			params: [tx_hex],
			id: 1,
		}
	}

	request(opt)
		.then(data => {
			if(data.code !== 0)
				throw data;
	   	console.log('sendRawTransaction success', data);
	   	return responseSuccess(res, { tx_id: data.result });
		})
		.catch(e => {
	    console.log('sendRawTransaction error', e);
	  	return responseError(res, 50000, e);
		})
}

module.exports = broadcast;

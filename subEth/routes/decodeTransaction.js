const { responseError, responseSuccess } = require('../libs/response');
const txDecoder = require('ethereum-tx-decoder');


// https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=YourApiKeyToken
const decodeTransaction = (req, res, next) => {
	const { tx_hex } = req.body;
	if (!tx_hex || !tx_hex.match(/^0x/))
	  return responseError(res, 50001, 'params error');

 	const decodedTx = txDecoder.decodeTx(tx_hex);

 	if (!decodedTx) {
	  return responseError(res, 50000, 'decode error');
 	}
 	return responseSuccess(res, decodedTx)
}

module.exports = decodeTransaction;

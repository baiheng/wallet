const web3 = require('../libs/web3');
const { responseError, responseSuccess } = require('../libs/response');


const broadcast = (req, res, next) => {
	const { tx_hex = "" } = req.body;
	if (!tx_hex) {
		return responseError(res, 50001, 'tx_hex should not be empty');
	}
	const hash = tx_hex.match(/^0x/) ? tx_hex : `0x${tx_hex}`
	web3.eth.sendSignedTransaction(hash, function(err, hash) {
	  if (err){
	    console.log('sendRawTransaction error', err);
	  	return responseError(res, 50000, err.message);
	  }
	   console.log('sendRawTransaction success', hash);
	   return responseSuccess(res, '');
	});
}

module.exports = broadcast;

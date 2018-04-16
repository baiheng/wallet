const Web3 = require('web3');

const { responseError, responseSuccess } = require('../libs/response');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8080"));

const broadcast = (req, res, next) => {
	const { tx_hex = "" } = req.body;
	console.log(req.body);
	if (!tx_hex) {
		return responseError(res, 50001, 'tx_hex should not be empty');
	}
	// const txHash = `0xf8aa048504a817c80083419ce094b3bd49e28f8f832b8d1e246106991e546c32350280b844a9059cbb0000000000000000000000009e47b249b5b4507d42972a9f096b7090d5a1330900000000000000000000000000000000000000000000000000000000000000001ba01cb7a7c9dcb5b034b2829d5caf078c3b108b2d4d861893174f821d111d1e739fa067a0f8cae241ba185b0c31a484839c72bc7dc2e6cd786579ef6cd454fe86e394`;
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

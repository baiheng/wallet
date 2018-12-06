/**
 * 发起交易
 */

const web3 = require('../libs/web3');
const { responseError, responseSuccess } = require('../libs/response');
const EthereumTx = require('ethereumjs-tx')

const toHex = (num) => {
	if (typeof num !== 'number')
		num = parseInt(num);
	if (isNaN(num))
		return '';
	return `0x${num.toString(16)}`;
}

const fake = {
	from: '0x76D546e106AB1deA724A08a0188BBa3f4f6FC15c',
	privateKey: '0x224fdbbad473068089e1490bba48c25f1db09090fbbaf283320eb99a17aa7244',
	nonce: 234,
	gasPrice: 500000,
	gasLimit: 3141592,
	data: '',
	value: 533333,
	to: '0x35805fa60dA9663297064E5fFe447f75B4362Cc4',
}
const rawTransaction = (req, res, next) => {
	const { gasPrice, nonce, gasLimit, to, value, data, from, privateKey } = req.body;
	// const { gasPrice, nonce, gasLimit, to, value, data, from, privateKey } = fake;
	const txParams = {
		gasPrice: toHex(gasPrice),
		nonce: toHex(nonce),
		gasLimit: toHex(gasLimit),
		value: toHex(value),
		from: from.match(/^0x/) ? from : '',
		to: to.match(/^0x/) ? to : '',
	}
	if (Object.keys(txParams).filter(key => !txParams[key]).length > 0 || !privateKey) {
		return responseError(res, 50001, 'gasPrice, nonce, gasLimit, to, value, data, from, or privateKey should not be empty');
	}

	let pKey = privateKey.replace(/^0x/, '');
	pKey = Buffer.from(pKey, 'hex');

	txParams.data = data.match(/^0x/) ? data : '',
	txParams.chainId = 3; // EIP 155 chainId - mainnet: 1, ropsten: 3

	try {
		const tx = new EthereumTx(txParams)
		tx.sign(pKey)
		const raw = '0x' + tx.serialize().toString('hex');
		web3.eth.sendSignedTransaction(raw, function(err, hash) {
			if (err){
				console.log('sendRawTransaction error', err);
				return responseError(res, 50000, err.message);
			}
			 // console.log('sendRawTransaction success', hash);
			 return responseSuccess(res, { tx_id: hash });
		});
	} catch(e) {
		console.log('sendRawTransaction error', e);
		return responseError(res, 50000, e.message || e);
	}
}

module.exports = rawTransaction;




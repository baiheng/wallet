const request = require('request-promise');

const { responseError, responseSuccess } = require('../libs/response');
const { convertToPrice } = require('../libs/convert');
const rpcClient = require('../libs/rpcClient');
const config = require('../config');

const balance = (req, res, next) => {
	const { address = "" } = req.query;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	const hash = address.match(/^0x/) ? address : `0x${address}`;

	const queryBalance = request({
		uri: `http://state-api.otcgo.cn/api/v1/mainnet/address/balances/${address}`,
		json: true,
	});
	
	Promise.all([queryBalance, convertToPrice('cny'), rpcClient('get_height')])
		.then(data => {
			if (!data[0].code === 200)
				throw data[0];
			const neos = data[0].data.filter(asset => asset.assetId === config.neoAssetAddress);
			if (!neos || !neos.length)
				throw 'can\'t not find neo asset';
			const tBalance = neos[0].balances;
			const price = data[1];
			const nonce = !isNaN(parseInt(data[2].height)) ? parseInt(data[2].height) : 0;
			const tmp = !isNaN(parseInt(tBalance)) ? parseInt(tBalance) : 0;
	   	return responseSuccess(res, { balance: tmp, cny: tmp * price, nonce: nonce + 1 })
		})
		.catch(e => {
			console.log('getBalance error', e);
	  	return responseError(res, 50000, JSON.stringify(e));
		});
}

module.exports = balance;

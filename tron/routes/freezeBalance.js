const { FreezeBalanceContract } = require('@tronprotocol/wallet-api/src/protocol/core/Contract_pb');
const { Transaction } = require('@tronprotocol/wallet-api/src/protocol/core/Tron_pb');
const { responseError, responseSuccess } = require('../libs/response');

const getGrpcClient = require('../libs/TronClient').getGrpcClient;
const { getBase64AddressFromBase58 } = require('../libs/tool/address');
const { convertToPrice } = require('../libs/convert');


const freezeBalance = (req, res, next) => {
	const { address = "", frozenBalance, frozenDuration } = req.body;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	const contract = new FreezeBalanceContract([getBase64AddressFromBase58(address), frozenBalance * 1000000, frozenDuration]);
	
	getGrpcClient().api.freezeBalance(contract)
		.then(data => {
			return responseSuccess(res, { rawData: Buffer.from(data.getRawData().serializeBinary()).toString('base64') });

		})
		.catch(e => {
			console.log(e);
			return responseError(res, 50000, e);
		})
}

module.exports = freezeBalance;

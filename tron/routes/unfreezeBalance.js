const { UnfreezeBalanceContract } = require('@tronprotocol/wallet-api/src/protocol/core/Contract_pb');
const { Transaction } = require('@tronprotocol/wallet-api/src/protocol/core/Tron_pb');
const { responseError, responseSuccess } = require('../libs/response');

const getGrpcClient = require('../libs/TronClient').getGrpcClient;
const { getBase64AddressFromBase58 } = require('../libs/tool/address');
const { convertToPrice } = require('../libs/convert');


const unfreezeBalance = (req, res, next) => {
	const { address = "" } = req.body;
	if (!address) {
		return responseError(res, 50001, 'address should not be empty');
	}
	const contract = new UnfreezeBalanceContract([getBase64AddressFromBase58(address)]);
	
	getGrpcClient().api.unfreezeBalance(contract)
		.then(data => {
			return responseSuccess(res, { rawData: Buffer.from(data.getRawData().serializeBinary()).toString('base64') });

		})
		.catch(e => {
			return responseError(res, 50000, e);
		})
}

module.exports = unfreezeBalance;

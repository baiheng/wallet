const { TransferContract, TransferAssetContract, VoteWitnessContract, Account } = require('@tronprotocol/wallet-api/src/protocol/core/Contract_pb');
const { Transaction } = require('@tronprotocol/wallet-api/src/protocol/core/Tron_pb');

const { responseError, responseSuccess } = require('../libs/response');
const httpClient = require('../libs/TronClient').httpClient;
const grpcClient = require('../libs/TronClient').grpcClient;
const { getBase64AddressFromBase58 } = require('../libs/tool/address');

const {
	hexStr2byteArray,
} = require('@tronprotocol/wallet-api/src/lib/code');

const password = 'D28749C859DA27B23BF928EBAD957FE9233E268C1ADC9876AD24596DA19865AA';

const transaction = async (req, res, next) => {
	const { ownerAddress, toAddress, amount  } = req.body;
	if (!ownerAddress || !toAddress || !amount) {
		return responseError(res, 50001, 'params should not be empty');
	}
	const transferContract = new TransferContract([getBase64AddressFromBase58(ownerAddress), getBase64AddressFromBase58(toAddress), amount]);
	grpcClient.api.createTransaction(transferContract)
		.then(data => {
			// httpClient.signTransactionLocal(password, data)
			// 	.then(d => {
			// 		console.log(Buffer.from(data.getRawData().serializeBinary()).toString('base64'), data.getSignatureList_asB64());
			// 	})
			return responseSuccess(res, {
	   		rawData: Buffer.from(data.getRawData().serializeBinary()).toString('base64'),
	   	});

		})
		.catch(e => {
			console.log('createTransaction error', e);
			return responseError(res, 50000, e);
		})
}

module.exports = transaction;

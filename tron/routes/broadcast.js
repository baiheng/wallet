const { responseError, responseSuccess } = require('../libs/response');

const { httpClient, getGrpcClient } = require('../libs/TronClient');
const { Transaction } = require('@tronprotocol/wallet-api/src/protocol/core/Tron_pb');
const { TransferContract, TransferAssetContract, VoteWitnessContract, Account } = require('@tronprotocol/wallet-api/src/protocol/core/Contract_pb');

const broadcast = (req, res, next) => {
	const { signedData, rawData } = req.body;
	if (!signedData || !rawData) {
		return responseError(res, 50001, 'params should not be empty');
	}
	const newRaw = Transaction.raw.deserializeBinary([...Buffer.from(rawData, 'base64')]);
	const newTransaction = new Transaction();
	newTransaction.setRawData(newRaw);
	newTransaction.setSignatureList([ new Uint8Array(Buffer.from(signedData, 'base64')) ]);
	getGrpcClient().api.broadcastTransaction(newTransaction)
		.then(data => {
			const d = data.toObject();
			if (d.code !== 0) {
				throw { ...d, message: Buffer.from (d.message, 'base64').toString()}
			}
	   	return responseSuccess(res, d);
		})
		.catch(e => {
			console.log('broadcastTransaction error', e);
			return responseError(res, 50000, e);
		})
}

module.exports = broadcast;

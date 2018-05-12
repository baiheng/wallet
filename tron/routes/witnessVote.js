const { responseError, responseSuccess } = require('../libs/response');

const { httpClient, grpcClient } = require('../libs/TronClient');
const { Transaction } = require('@tronprotocol/wallet-api/src/protocol/core/Tron_pb');
const { VoteWitnessContract } = require('@tronprotocol/wallet-api/src/protocol/core/Contract_pb');

const { getBase64AddressFromBase58 } = require('../libs/tool/address');

const voteWitnessContract = new VoteWitnessContract([
	getBase64AddressFromBase58('27VkVK7HDp9nHLKrdMj431Aq9xXyLWAgtHa'),
	[
		[getBase64AddressFromBase58('27WPirKuXZgSdFMra7K2HWUptWjxSTgqy51'), 3590410209]
	],
	true,
]);

console.log(voteWitnessContract.toObject());
grpcClient.api.voteWitnessAccount(voteWitnessContract)
		.then(data => console.log('voteWitnessAccount success', data.toObject()))
		.catch(e => console.log('voteWitnessAccount error', e));

const witnessVote = (req, res, next) => {
	const { signedData, rawData } = req.body;
	if (!signedData || !rawData) {
		return responseError(res, 50001, 'params should not be empty');
	}
	const newRaw = Transaction.raw.deserializeBinary([...Buffer.from(rawData, 'base64')]);
	const newTransaction = new Transaction();
	newTransaction.setRawData(newRaw);
	newTransaction.setSignatureList([ new Uint8Array(Buffer.from(signedData, 'base64')) ]);
	console.log(newTransaction.toObject().rawData.contractList);
	console.log(newTransaction.toObject());
	grpcClient.api.broadcastTransaction(newTransaction)
		.then(data => {
			const d = data.toObject();
			if (d.code !== 0) {
				throw { ...d, message: Buffer.from (d.message, 'base64').toString()}
			}
	   	return responseSuccess(res, {});
		})
		.catch(e => {
			console.log('broadcastTransaction error', e);
			return responseError(res, 50000, e);
		})
}

module.exports = witnessVote;

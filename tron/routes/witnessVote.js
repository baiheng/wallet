const { responseError, responseSuccess } = require('../libs/response');

const { httpClient, grpcClient } = require('../libs/TronClient');
const { Transaction } = require('@tronprotocol/wallet-api/src/protocol/core/Tron_pb');
const { VoteWitnessContract } = require('@tronprotocol/wallet-api/src/protocol/core/Contract_pb');

const { getBase64AddressFromBase58 } = require('../libs/tool/address');

// const voteWitnessContract = new VoteWitnessContract([
// 	getBase64AddressFromBase58('V'),
// 	[
// 		[getBase64AddressFromBase58('27WPirKuXZgSdFMra7K2HWUptWjxSTgqy51'), 500]
// 	],
// 	true,
// ]);

// console.log(voteWitnessContract.toObject());
// grpcClient.api.voteWitnessAccount(voteWitnessContract)
// 		.then(data => console.log('voteWitnessAccount success', data.toObject()))
// 		.catch(e => console.log('voteWitnessAccount error', e));

const witnessVote = (req, res, next) => {
	const { ownerAddress, voteAddressList, support } = req.body;
	if (!ownerAddress || !voteAddressList || !voteAddressList instanceof Array || !voteAddressList.length) {
		return responseError(res, 50001, 'params should not be empty');
	}
	const voteWitnessContract = new VoteWitnessContract([
		getBase64AddressFromBase58(ownerAddress),
		voteAddressList.map(vote => [ getBase64AddressFromBase58(vote.voteAddress), isNaN(parseInt(vote.voteCount)) ? 0 : parseInt(vote.voteCount) ]),
		!!support,
	])

	grpcClient.api.voteWitnessAccount(voteWitnessContract)
		.then((data) => {
			responseSuccess(res, {
				rawData: Buffer.from(data.getRawData().serializeBinary()).toString('base64')
			})
		})
		.catch((e) => {
			console.log('voteWitnessAccount error', e);
			return responseError(res, 500001, e);
		})
}

module.exports = witnessVote;

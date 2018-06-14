const { ParticipateAssetIssueContract } = require('@tronprotocol/wallet-api/src/protocol/core/Contract_pb');
const { responseError, responseSuccess } = require('../libs/response');

const getGrpcClient = require('../libs/TronClient').getGrpcClient;
const { getBase64AddressFromBase58 } = require('../libs/tool/address');
const { convertToPrice } = require('../libs/convert');


const participateAssetIssue = (req, res, next) => {
	const { ownerAddress, toAddress, assetName, amount } = req.body;
	if (!ownerAddress || !toAddress || !assetName || !amount) {
		return responseError(res, 50001, 'address should not be empty');
	}
	const contract = new ParticipateAssetIssueContract([
		getBase64AddressFromBase58(ownerAddress),
		getBase64AddressFromBase58(toAddress),
		new Uint8Array(Buffer.from(assetName)),
		amount,
	]);

	getGrpcClient().api.participateAssetIssue(contract)
		.then(data => {
			return responseSuccess(res, { rawData: Buffer.from(data.getRawData().serializeBinary()).toString('base64') });

		})
		.catch(e => {
			return responseError(res, 50000, e);
		})
}

module.exports = participateAssetIssue;

const { EmptyMessage } = require("@tronprotocol/wallet-api/src/protocol/api/api_pb");
const { responseError, responseSuccess } = require('../libs/response');

const { httpClient, getGrpcClient } = require('../libs/TronClient');

// 
const latestBlock = (req, res, next) => {
	getGrpcClient().api.getNowBlock(new EmptyMessage())
		.then(data => {
	  	return responseSuccess(res, { blockNumber: data.getBlockHeader().toObject().rawData.number });
		})
		.catch(e => {
	    console.log('getLatestBlock error', e);
	  	return responseError(res, 50000, e);
		});
}

module.exports = latestBlock;

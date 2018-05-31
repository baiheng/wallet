const { EmptyMessage } = require("@tronprotocol/wallet-api/src/protocol/api/api_pb");

const { responseError, responseSuccess } = require('../libs/response');
const { httpClient, grpcClient, getGrpcClient } = require('../libs/TronClient');

// 
const assetIssueList = (req, res, next) => {
	getGrpcClient().api.getAssetIssueList(new EmptyMessage())
		.then(list => {
	   return responseSuccess(res, list.toObject().assetissueList);
		})
		.catch(e => {
	    console.log('getAssetIssueList error', e);
	  	return responseError(res, 50000, err.message);
		});
}

module.exports = assetIssueList;
